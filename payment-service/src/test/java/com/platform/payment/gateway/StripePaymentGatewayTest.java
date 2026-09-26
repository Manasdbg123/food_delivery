package com.platform.payment.gateway;

import com.platform.payment.gateway.PaymentGateway.WebhookEvent;
import com.stripe.Stripe;
import com.stripe.net.Webhook;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/** Signs events exactly the way Stripe does and checks what the gateway makes of them. */
class StripePaymentGatewayTest {

    private static final String SECRET = "whsec_test_secret";
    private final StripePaymentGateway gateway = new StripePaymentGateway("sk_test_unused", SECRET);

    private static String event(String type, String paymentStatus) {
        return """
                {
                  "id": "evt_1",
                  "object": "event",
                  "api_version": "%s",
                  "type": "%s",
                  "data": {
                    "object": {
                      "id": "cs_test_1",
                      "object": "checkout.session",
                      "client_reference_id": "42",
                      "metadata": {"orderId": "42"},
                      "payment_intent": "pi_test_1",
                      "payment_status": "%s"
                    }
                  }
                }""".formatted(Stripe.API_VERSION, type, paymentStatus);
    }

    private static String sign(String payload, String secret) throws Exception {
        long timestamp = Webhook.Util.getTimeNow();
        return "t=" + timestamp + ",v1=" + Webhook.Util.computeHmacSha256(secret, timestamp + "." + payload);
    }

    @Test
    void aCompletedPaidCheckoutIsReportedAsPaid() throws Exception {
        String payload = event("checkout.session.completed", "paid");

        WebhookEvent result = gateway.parseWebhook(payload, sign(payload, SECRET));

        assertEquals(WebhookEvent.Type.PAID, result.type());
        assertEquals(42L, result.orderId());
        assertEquals("cs_test_1", result.sessionId());
        assertEquals("pi_test_1", result.providerPaymentId());
    }

    @Test
    void aCompletedButUnpaidCheckoutWaitsForTheAsyncResult() throws Exception {
        String payload = event("checkout.session.completed", "unpaid");

        assertEquals(WebhookEvent.Type.IGNORED, gateway.parseWebhook(payload, sign(payload, SECRET)).type());
    }

    @Test
    void anExpiredCheckoutIsReportedAsFailed() throws Exception {
        String payload = event("checkout.session.expired", "unpaid");

        WebhookEvent result = gateway.parseWebhook(payload, sign(payload, SECRET));

        assertEquals(WebhookEvent.Type.FAILED, result.type());
        assertEquals(42L, result.orderId());
    }

    @Test
    void unrelatedEventsAreIgnored() throws Exception {
        String payload = event("customer.created", "paid");

        assertEquals(WebhookEvent.Type.IGNORED, gateway.parseWebhook(payload, sign(payload, SECRET)).type());
    }

    @Test
    void aForgedSignatureIsRejected() throws Exception {
        String payload = event("checkout.session.completed", "paid");

        assertThrows(InvalidWebhookException.class, () -> gateway.parseWebhook(payload, sign(payload, "whsec_attacker")));
        assertThrows(InvalidWebhookException.class, () -> gateway.parseWebhook(payload, null));
    }

    @Test
    void aTamperedBodyIsRejected() throws Exception {
        String payload = event("checkout.session.completed", "paid");
        String signature = sign(payload, SECRET);

        assertThrows(InvalidWebhookException.class,
                () -> gateway.parseWebhook(payload.replace("\"42\"", "\"43\""), signature));
    }
}
