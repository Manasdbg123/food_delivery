package com.platform.payment.service;

import com.platform.payment.client.OrderClient;
import com.platform.payment.config.PaymentProperties;
import com.platform.payment.domain.PaymentProvider;
import com.platform.payment.domain.PaymentStatus;
import com.platform.payment.dto.CheckoutResponse;
import com.platform.payment.dto.PaymentView;
import com.platform.payment.entity.Payment;
import com.platform.payment.exception.ResourceNotFoundException;
import com.platform.payment.gateway.PaymentGateway;
import com.platform.payment.gateway.PaymentGateway.WebhookEvent;
import com.platform.payment.messaging.producer.PaymentEventProducer;
import com.platform.payment.repository.PaymentRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Objects;

/**
 * Owns the money side of an order.
 *
 * Cash on delivery and simulated payments are settled as soon as the order is created.
 * With Stripe the payment stays PENDING until the customer pays on Stripe Checkout and
 * Stripe's signed webhook confirms it; only then is PAYMENT_SUCCESS published and the
 * restaurant starts cooking. Every handler tolerates duplicate and out-of-order events.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    /** How long a checkout page stays payable. Stripe's minimum is 30 minutes. */
    static final Duration CHECKOUT_WINDOW = Duration.ofMinutes(30);
    private static final String COD = "COD";
    private static final String ORDER_AWAITING_PAYMENT = "CREATED";

    private final PaymentRepository repo;
    private final PaymentEventProducer producer;
    private final PaymentGateway gateway;
    private final OrderClient orderClient;
    private final PaymentProperties props;

    @Transactional
    public void onOrderCreated(Long orderId, String userId, Double amount, String method) {
        if (repo.findByOrderId(orderId).isPresent()) {
            return; // a redelivered event, or the customer already opened checkout
        }
        Payment payment = newPayment(orderId, userId, amount, method);
        if (COD.equals(method)) {
            payment.setProvider(PaymentProvider.CASH);
            payment.setStatus(PaymentStatus.CASH_ON_DELIVERY);
        } else if (!gateway.hostedCheckout()) {
            payment.setProvider(PaymentProvider.SIMULATED);
            payment.setStatus(PaymentStatus.SUCCEEDED);
        } else {
            payment.setProvider(PaymentProvider.STRIPE);
            payment.setStatus(PaymentStatus.PENDING);
        }
        repo.save(payment);
        if (payment.getStatus() != PaymentStatus.PENDING) {
            producer.publishPaymentResult(orderId, true, method);
        }
    }

    /** Opens (or reopens) the hosted checkout page for one of the caller's orders. */
    @Transactional
    public CheckoutResponse startCheckout(String userId, Long orderId) {
        OrderClient.OrderView order = fetchOrder(userId, orderId);
        if (COD.equals(order.paymentMethod())) {
            throw new IllegalArgumentException("This order is paid in cash on delivery");
        }
        Payment existing = repo.findByOrderId(orderId).orElse(null);
        if (!gateway.hostedCheckout()) {
            PaymentStatus status = existing == null ? PaymentStatus.PENDING : existing.getStatus();
            return new CheckoutResponse(orderId, PaymentProvider.SIMULATED.name(), status, null);
        }
        if (existing != null && existing.getStatus() == PaymentStatus.SUCCEEDED) {
            throw new IllegalStateException("This order has already been paid");
        }
        boolean payable = ORDER_AWAITING_PAYMENT.equals(order.status())
                && (existing == null || existing.getStatus() == PaymentStatus.PENDING);
        if (!payable) {
            throw new IllegalStateException("This order can no longer be paid for");
        }

        Payment payment = existing;
        if (payment == null) {
            payment = newPayment(orderId, userId, order.totalAmount(), order.paymentMethod());
            payment.setProvider(PaymentProvider.STRIPE);
            payment.setStatus(PaymentStatus.PENDING);
        }

        Instant now = Instant.now();
        boolean reusable = payment.getCheckoutUrl() != null && payment.getCheckoutExpiresAt() != null
                && payment.getCheckoutExpiresAt().isAfter(now.plus(Duration.ofMinutes(2)));
        if (!reusable) {
            String orderPage = trimSlash(props.frontendUrl()) + "/orders/" + orderId;
            String description = "FoodieHub order #" + orderId
                    + (order.restaurantName() == null ? "" : " · " + order.restaurantName());
            PaymentGateway.CheckoutSession session = gateway.createCheckout(new PaymentGateway.CheckoutRequest(
                    orderId, toMinorUnits(order.totalAmount()), currency(), description,
                    orderPage + "?payment=success", orderPage + "?payment=cancelled", now.plus(CHECKOUT_WINDOW)));
            payment.setAmount(order.totalAmount());
            payment.setCheckoutSessionId(session.id());
            payment.setCheckoutUrl(session.url());
            payment.setCheckoutExpiresAt(session.expiresAt());
            payment = repo.save(payment);
        }
        return new CheckoutResponse(orderId, PaymentProvider.STRIPE.name(), payment.getStatus(), payment.getCheckoutUrl());
    }

    @Transactional
    public void handleWebhook(String payload, String signature) {
        WebhookEvent event = gateway.parseWebhook(payload, signature);
        if (event.type() == WebhookEvent.Type.IGNORED) {
            return;
        }
        Payment payment = repo.findByOrderId(event.orderId()).orElse(null);
        if (payment == null) {
            log.warn("Webhook for order {} with no payment record", event.orderId());
            return;
        }
        if (event.type() == WebhookEvent.Type.PAID) {
            onPaid(payment, event);
        } else {
            onFailed(payment, event);
        }
    }

    @Transactional
    public void onOrderCancelled(Long orderId) {
        repo.findByOrderId(orderId).ifPresent(payment -> {
            switch (payment.getStatus()) {
                case SUCCEEDED -> {
                    if (payment.getProvider() == PaymentProvider.STRIPE) {
                        gateway.refund(payment.getProviderPaymentId());
                    }
                    payment.setStatus(PaymentStatus.REFUNDED);
                    producer.publishRefunded(orderId);
                }
                case PENDING -> {
                    if (payment.getCheckoutSessionId() != null) {
                        gateway.expireCheckout(payment.getCheckoutSessionId());
                    }
                    payment.setStatus(PaymentStatus.CANCELLED);
                }
                case CASH_ON_DELIVERY -> payment.setStatus(PaymentStatus.CANCELLED);
                default -> {
                    return;
                }
            }
            repo.save(payment);
        });
    }

    public PaymentView getForUser(String userId, Long orderId) {
        return repo.findByOrderId(orderId)
                .filter(p -> Objects.equals(p.getUserId(), userId))
                .map(PaymentView::of)
                .orElseThrow(() -> new ResourceNotFoundException("No payment found for order " + orderId));
    }

    private void onPaid(Payment payment, WebhookEvent event) {
        if (payment.getStatus() == PaymentStatus.SUCCEEDED || payment.getStatus() == PaymentStatus.REFUNDED) {
            return; // Stripe retries webhooks; a second delivery changes nothing
        }
        payment.setProviderPaymentId(event.providerPaymentId());
        if (payment.getStatus() != PaymentStatus.PENDING) {
            // The order was cancelled (or its checkout written off) while the customer was
            // still on the payment page. The money arrived anyway, so send it straight back.
            gateway.refund(event.providerPaymentId());
            payment.setStatus(PaymentStatus.REFUNDED);
            repo.save(payment);
            producer.publishRefunded(payment.getOrderId());
            return;
        }
        payment.setStatus(PaymentStatus.SUCCEEDED);
        repo.save(payment);
        producer.publishPaymentResult(payment.getOrderId(), true, payment.getMethod());
    }

    private void onFailed(Payment payment, WebhookEvent event) {
        if (payment.getStatus() != PaymentStatus.PENDING) {
            return;
        }
        if (event.sessionId() != null && !event.sessionId().equals(payment.getCheckoutSessionId())) {
            return; // an older checkout the customer replaced with a new one
        }
        payment.setStatus(PaymentStatus.FAILED);
        repo.save(payment);
        producer.publishPaymentResult(payment.getOrderId(), false, payment.getMethod());
    }

    private Payment newPayment(Long orderId, String userId, Double amount, String method) {
        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setUserId(userId);
        payment.setAmount(amount);
        payment.setCurrency(currency());
        payment.setMethod(method);
        return payment;
    }

    private OrderClient.OrderView fetchOrder(String userId, Long orderId) {
        try {
            return orderClient.getOrder(userId, orderId);
        } catch (FeignException.NotFound e) {
            throw new ResourceNotFoundException("Order not found with id: " + orderId);
        } catch (FeignException e) {
            throw new IllegalStateException("We couldn't load your order just now. Please try again.");
        }
    }

    private String currency() {
        return props.currency() == null || props.currency().isBlank() ? "inr" : props.currency().toLowerCase();
    }

    static long toMinorUnits(Double amount) {
        if (amount == null || amount <= 0) {
            throw new IllegalStateException("This order has nothing to pay");
        }
        return Math.round(amount * 100);
    }

    private static String trimSlash(String url) {
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }
}
