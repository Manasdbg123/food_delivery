package com.platform.payment.gateway;

import com.stripe.exception.EventDataObjectDeserializationException;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.Refund;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.RequestOptions;
import com.stripe.net.Webhook;
import com.stripe.param.RefundCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.util.Map;
import java.util.Set;

/** Stripe Checkout: a hosted payment page, confirmed by a signed webhook. */
@Slf4j
public class StripePaymentGateway implements PaymentGateway {

    private static final Set<String> PAID_EVENTS = Set.of(
            "checkout.session.completed", "checkout.session.async_payment_succeeded");
    private static final Set<String> FAILED_EVENTS = Set.of(
            "checkout.session.expired", "checkout.session.async_payment_failed");

    private final RequestOptions options;
    private final String webhookSecret;

    public StripePaymentGateway(String secretKey, String webhookSecret) {
        this.options = RequestOptions.builder().setApiKey(secretKey).build();
        this.webhookSecret = webhookSecret;
    }

    @Override
    public boolean hostedCheckout() {
        return true;
    }

    @Override
    public CheckoutSession createCheckout(CheckoutRequest request) {
        String orderId = String.valueOf(request.orderId());
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setClientReferenceId(orderId)
                .putMetadata("orderId", orderId)
                .setPaymentIntentData(SessionCreateParams.PaymentIntentData.builder()
                        .putMetadata("orderId", orderId)
                        .build())
                .setSuccessUrl(request.successUrl())
                .setCancelUrl(request.cancelUrl())
                .setExpiresAt(request.expiresAt().getEpochSecond())
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency(request.currency())
                                .setUnitAmount(request.amountMinor())
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(request.description())
                                        .build())
                                .build())
                        .build())
                .build();
        try {
            Session session = Session.create(params, options);
            return new CheckoutSession(session.getId(), session.getUrl(), Instant.ofEpochSecond(session.getExpiresAt()));
        } catch (StripeException e) {
            log.error("Stripe checkout for order {} failed: {}", orderId, e.getMessage());
            throw new IllegalStateException("We couldn't start the payment just now. Please try again.");
        }
    }

    @Override
    public WebhookEvent parseWebhook(String payload, String signature) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, signature, webhookSecret);
        } catch (SignatureVerificationException e) {
            throw new InvalidWebhookException("Invalid Stripe signature");
        } catch (RuntimeException e) {
            throw new InvalidWebhookException("Malformed Stripe event");
        }

        boolean paidEvent = PAID_EVENTS.contains(event.getType());
        if (!paidEvent && !FAILED_EVENTS.contains(event.getType())) {
            return WebhookEvent.ignored();
        }
        if (!(deserialize(event) instanceof Session session)) {
            return WebhookEvent.ignored();
        }
        Long orderId = orderId(session);
        if (orderId == null) {
            return WebhookEvent.ignored();
        }
        // checkout.session.completed also fires for delayed methods that have not paid yet;
        // those settle later with async_payment_succeeded or async_payment_failed.
        if (paidEvent && !"paid".equals(session.getPaymentStatus())) {
            return WebhookEvent.ignored();
        }
        return new WebhookEvent(paidEvent ? WebhookEvent.Type.PAID : WebhookEvent.Type.FAILED,
                orderId, session.getId(), session.getPaymentIntent());
    }

    @Override
    public void refund(String providerPaymentId) {
        try {
            Refund.create(RefundCreateParams.builder().setPaymentIntent(providerPaymentId).build(), options);
        } catch (StripeException e) {
            log.error("Stripe refund for {} failed: {}", providerPaymentId, e.getMessage());
            throw new IllegalStateException("The refund could not be issued: " + e.getMessage());
        }
    }

    @Override
    public void expireCheckout(String sessionId) {
        try {
            Session.retrieve(sessionId, options).expire(options);
        } catch (StripeException e) {
            // Already completed or expired; either way it can no longer be paid.
            log.info("Could not expire Stripe session {}: {}", sessionId, e.getMessage());
        }
    }

    private static StripeObject deserialize(Event event) {
        EventDataObjectDeserializer data = event.getDataObjectDeserializer();
        return data.getObject().orElseGet(() -> {
            try {
                // The event was sent with a different API version than this SDK pins.
                return data.deserializeUnsafe();
            } catch (EventDataObjectDeserializationException e) {
                return null;
            }
        });
    }

    private static Long orderId(Session session) {
        Map<String, String> metadata = session.getMetadata();
        String raw = metadata != null && metadata.get("orderId") != null
                ? metadata.get("orderId") : session.getClientReferenceId();
        try {
            return raw == null ? null : Long.valueOf(raw);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
