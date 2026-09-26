package com.platform.payment.gateway;

import java.time.Instant;

/**
 * The payment provider, behind an interface so the service logic is tested without
 * network calls and the platform runs without a provider account.
 */
public interface PaymentGateway {

    /** Whether customers are sent to a hosted checkout page to pay. */
    boolean hostedCheckout();

    CheckoutSession createCheckout(CheckoutRequest request);

    /** Verifies the signature and reduces the provider's event to what the service acts on. */
    WebhookEvent parseWebhook(String payload, String signature);

    void refund(String providerPaymentId);

    void expireCheckout(String sessionId);

    record CheckoutRequest(Long orderId, long amountMinor, String currency, String description,
                           String successUrl, String cancelUrl, Instant expiresAt) {
    }

    record CheckoutSession(String id, String url, Instant expiresAt) {
    }

    record WebhookEvent(Type type, Long orderId, String sessionId, String providerPaymentId) {
        public enum Type { PAID, FAILED, IGNORED }

        public static WebhookEvent ignored() {
            return new WebhookEvent(Type.IGNORED, null, null, null);
        }
    }
}
