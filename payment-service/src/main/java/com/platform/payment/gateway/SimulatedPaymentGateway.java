package com.platform.payment.gateway;

/** Approves every payment on the spot. Used when no payment provider is configured. */
public class SimulatedPaymentGateway implements PaymentGateway {

    @Override
    public boolean hostedCheckout() {
        return false;
    }

    @Override
    public CheckoutSession createCheckout(CheckoutRequest request) {
        throw new UnsupportedOperationException("Simulated payments have no checkout page");
    }

    @Override
    public WebhookEvent parseWebhook(String payload, String signature) {
        throw new InvalidWebhookException("Webhooks are not enabled: no payment provider is configured");
    }

    @Override
    public void refund(String providerPaymentId) {
        // Nothing was charged.
    }

    @Override
    public void expireCheckout(String sessionId) {
        // No checkout page exists.
    }
}
