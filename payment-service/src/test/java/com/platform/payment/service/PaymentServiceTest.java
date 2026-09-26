package com.platform.payment.service;

import com.platform.payment.client.OrderClient;
import com.platform.payment.config.PaymentProperties;
import com.platform.payment.domain.PaymentProvider;
import com.platform.payment.domain.PaymentStatus;
import com.platform.payment.dto.CheckoutResponse;
import com.platform.payment.entity.Payment;
import com.platform.payment.exception.ResourceNotFoundException;
import com.platform.payment.gateway.PaymentGateway;
import com.platform.payment.gateway.PaymentGateway.WebhookEvent;
import com.platform.payment.gateway.SimulatedPaymentGateway;
import com.platform.payment.messaging.producer.PaymentEventProducer;
import com.platform.payment.repository.PaymentRepository;
import feign.FeignException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    private static final PaymentProperties STRIPE = new PaymentProperties(
            "stripe", "inr", "https://foodiehub.example/", new PaymentProperties.Stripe("sk_test_x", "whsec_x"));

    @Mock PaymentRepository repo;
    @Mock PaymentEventProducer producer;
    @Mock PaymentGateway stripe;
    @Mock OrderClient orders;

    PaymentService service;

    @BeforeEach
    void setUp() {
        lenient().when(repo.save(any(Payment.class))).thenAnswer(inv -> inv.getArgument(0));
        lenient().when(stripe.hostedCheckout()).thenReturn(true);
        service = new PaymentService(repo, producer, stripe, orders, STRIPE);
    }

    private PaymentService simulated() {
        return new PaymentService(repo, producer, new SimulatedPaymentGateway(), orders,
                new PaymentProperties("simulated", "inr", "http://localhost:5173", null));
    }

    private Payment payment(PaymentStatus status) {
        Payment p = new Payment();
        p.setOrderId(7L);
        p.setUserId("user-1");
        p.setAmount(552.0);
        p.setMethod("CARD");
        p.setProvider(PaymentProvider.STRIPE);
        p.setStatus(status);
        p.setCheckoutSessionId("cs_current");
        return p;
    }

    private void orderIs(String status, String method) {
        when(orders.getOrder("user-1", 7L)).thenReturn(
                new OrderClient.OrderView(7L, "user-1", "Meghana Foods", status, 552.0, method));
    }

    // --- order created -------------------------------------------------------------

    @Test
    void cashOnDeliveryIsAcceptedStraightAway() {
        when(repo.findByOrderId(7L)).thenReturn(Optional.empty());

        service.onOrderCreated(7L, "user-1", 552.0, "COD");

        ArgumentCaptor<Payment> saved = ArgumentCaptor.forClass(Payment.class);
        verify(repo).save(saved.capture());
        assertEquals(PaymentStatus.CASH_ON_DELIVERY, saved.getValue().getStatus());
        verify(producer).publishPaymentResult(7L, true, "COD");
    }

    @Test
    void withStripeAnOnlineOrderWaitsForTheCustomerToPay() {
        when(repo.findByOrderId(7L)).thenReturn(Optional.empty());

        service.onOrderCreated(7L, "user-1", 552.0, "CARD");

        ArgumentCaptor<Payment> saved = ArgumentCaptor.forClass(Payment.class);
        verify(repo).save(saved.capture());
        assertEquals(PaymentStatus.PENDING, saved.getValue().getStatus());
        verifyNoInteractions(producer);
    }

    @Test
    void simulatedPaymentsSucceedImmediately() {
        when(repo.findByOrderId(7L)).thenReturn(Optional.empty());

        simulated().onOrderCreated(7L, "user-1", 552.0, "UPI");

        verify(producer).publishPaymentResult(7L, true, "UPI");
    }

    @Test
    void aRedeliveredOrderEventIsIgnored() {
        when(repo.findByOrderId(7L)).thenReturn(Optional.of(payment(PaymentStatus.PENDING)));

        service.onOrderCreated(7L, "user-1", 552.0, "CARD");

        verify(repo, never()).save(any());
        verifyNoInteractions(producer);
    }

    // --- checkout ----------------------------------------------------------------

    @Test
    void checkoutChargesTheAmountOrderServicePriced() {
        orderIs("CREATED", "CARD");
        when(repo.findByOrderId(7L)).thenReturn(Optional.empty());
        when(stripe.createCheckout(any())).thenReturn(new PaymentGateway.CheckoutSession(
                "cs_1", "https://checkout.stripe.com/c/cs_1", Instant.now().plus(30, ChronoUnit.MINUTES)));

        CheckoutResponse response = service.startCheckout("user-1", 7L);

        ArgumentCaptor<PaymentGateway.CheckoutRequest> request = ArgumentCaptor.forClass(PaymentGateway.CheckoutRequest.class);
        verify(stripe).createCheckout(request.capture());
        assertEquals(55200, request.getValue().amountMinor());
        assertEquals("inr", request.getValue().currency());
        assertEquals("https://foodiehub.example/orders/7?payment=success", request.getValue().successUrl());
        assertEquals("https://foodiehub.example/orders/7?payment=cancelled", request.getValue().cancelUrl());
        assertEquals("https://checkout.stripe.com/c/cs_1", response.checkoutUrl());
    }

    @Test
    void anOpenCheckoutIsReusedInsteadOfCreatingAnother() {
        orderIs("CREATED", "CARD");
        Payment open = payment(PaymentStatus.PENDING);
        open.setCheckoutUrl("https://checkout.stripe.com/c/cs_current");
        open.setCheckoutExpiresAt(Instant.now().plus(20, ChronoUnit.MINUTES));
        when(repo.findByOrderId(7L)).thenReturn(Optional.of(open));

        CheckoutResponse response = service.startCheckout("user-1", 7L);

        assertEquals("https://checkout.stripe.com/c/cs_current", response.checkoutUrl());
        verify(stripe, never()).createCheckout(any());
    }

    @Test
    void someoneElsesOrderCannotBePaidFor() {
        when(orders.getOrder("intruder", 7L)).thenThrow(FeignException.NotFound.class);

        assertThrows(ResourceNotFoundException.class, () -> service.startCheckout("intruder", 7L));
        verify(stripe, never()).createCheckout(any());
    }

    @Test
    void aPaidOrderCannotBePaidTwice() {
        orderIs("ACCEPTED", "CARD");
        when(repo.findByOrderId(7L)).thenReturn(Optional.of(payment(PaymentStatus.SUCCEEDED)));

        assertThrows(IllegalStateException.class, () -> service.startCheckout("user-1", 7L));
    }

    @Test
    void aCancelledOrderCannotBePaidFor() {
        orderIs("CANCELLED", "CARD");
        when(repo.findByOrderId(7L)).thenReturn(Optional.of(payment(PaymentStatus.CANCELLED)));

        assertThrows(IllegalStateException.class, () -> service.startCheckout("user-1", 7L));
    }

    @Test
    void cashOrdersHaveNoCheckout() {
        orderIs("ACCEPTED", "COD");

        assertThrows(IllegalArgumentException.class, () -> service.startCheckout("user-1", 7L));
    }

    // --- webhook -----------------------------------------------------------------

    @Test
    void aPaidWebhookAcceptsTheOrder() {
        Payment pending = payment(PaymentStatus.PENDING);
        when(stripe.parseWebhook("body", "sig")).thenReturn(
                new WebhookEvent(WebhookEvent.Type.PAID, 7L, "cs_current", "pi_1"));
        when(repo.findByOrderId(7L)).thenReturn(Optional.of(pending));

        service.handleWebhook("body", "sig");

        assertEquals(PaymentStatus.SUCCEEDED, pending.getStatus());
        assertEquals("pi_1", pending.getProviderPaymentId());
        verify(producer).publishPaymentResult(7L, true, "CARD");
    }

    @Test
    void aRepeatedPaidWebhookChangesNothing() {
        when(stripe.parseWebhook("body", "sig")).thenReturn(
                new WebhookEvent(WebhookEvent.Type.PAID, 7L, "cs_current", "pi_1"));
        when(repo.findByOrderId(7L)).thenReturn(Optional.of(payment(PaymentStatus.SUCCEEDED)));

        service.handleWebhook("body", "sig");

        verifyNoInteractions(producer);
        verify(stripe, never()).refund(any());
    }

    @Test
    void moneyThatArrivesAfterCancellingIsRefunded() {
        Payment cancelled = payment(PaymentStatus.CANCELLED);
        when(stripe.parseWebhook("body", "sig")).thenReturn(
                new WebhookEvent(WebhookEvent.Type.PAID, 7L, "cs_current", "pi_1"));
        when(repo.findByOrderId(7L)).thenReturn(Optional.of(cancelled));

        service.handleWebhook("body", "sig");

        verify(stripe).refund("pi_1");
        assertEquals(PaymentStatus.REFUNDED, cancelled.getStatus());
        verify(producer).publishRefunded(7L);
        verify(producer, never()).publishPaymentResult(anyLong(), anyBoolean(), any());
    }

    @Test
    void anExpiredCheckoutFailsThePayment() {
        Payment pending = payment(PaymentStatus.PENDING);
        when(stripe.parseWebhook("body", "sig")).thenReturn(
                new WebhookEvent(WebhookEvent.Type.FAILED, 7L, "cs_current", null));
        when(repo.findByOrderId(7L)).thenReturn(Optional.of(pending));

        service.handleWebhook("body", "sig");

        assertEquals(PaymentStatus.FAILED, pending.getStatus());
        verify(producer).publishPaymentResult(7L, false, "CARD");
    }

    @Test
    void theExpiryOfAReplacedCheckoutIsIgnored() {
        Payment pending = payment(PaymentStatus.PENDING);
        when(stripe.parseWebhook("body", "sig")).thenReturn(
                new WebhookEvent(WebhookEvent.Type.FAILED, 7L, "cs_old", null));
        when(repo.findByOrderId(7L)).thenReturn(Optional.of(pending));

        service.handleWebhook("body", "sig");

        assertEquals(PaymentStatus.PENDING, pending.getStatus());
        verifyNoInteractions(producer);
    }

    // --- cancellation ------------------------------------------------------------

    @Test
    void cancellingAPaidOrderRefundsIt() {
        Payment paid = payment(PaymentStatus.SUCCEEDED);
        paid.setProviderPaymentId("pi_1");
        when(repo.findByOrderId(7L)).thenReturn(Optional.of(paid));

        service.onOrderCancelled(7L);

        verify(stripe).refund("pi_1");
        assertEquals(PaymentStatus.REFUNDED, paid.getStatus());
        verify(producer).publishRefunded(7L);
    }

    @Test
    void cancellingAnUnpaidOrderClosesItsCheckout() {
        Payment pending = payment(PaymentStatus.PENDING);
        when(repo.findByOrderId(7L)).thenReturn(Optional.of(pending));

        service.onOrderCancelled(7L);

        verify(stripe).expireCheckout("cs_current");
        verify(stripe, never()).refund(any());
        assertEquals(PaymentStatus.CANCELLED, pending.getStatus());
    }

    @Test
    void paymentDetailsAreOnlyShownToTheirOwner() {
        when(repo.findByOrderId(7L)).thenReturn(Optional.of(payment(PaymentStatus.SUCCEEDED)));

        assertEquals(PaymentStatus.SUCCEEDED, service.getForUser("user-1", 7L).status());
        assertThrows(ResourceNotFoundException.class, () -> service.getForUser("intruder", 7L));
    }

    @Test
    void amountsAreSentInMinorUnits() {
        assertEquals(80400, PaymentService.toMinorUnits(804.0));
        assertEquals(1, PaymentService.toMinorUnits(0.005));
        assertThrows(IllegalStateException.class, () -> PaymentService.toMinorUnits(0.0));
    }
}
