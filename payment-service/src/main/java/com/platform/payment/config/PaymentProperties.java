package com.platform.payment.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * How payments are taken.
 *
 * <ul>
 *   <li>{@code simulated} (the default) approves every online payment straight away, so
 *       the platform runs end to end with no payment account.</li>
 *   <li>{@code stripe} sends the customer to Stripe Checkout and waits for Stripe's
 *       signed webhook before the restaurant is told to start cooking.</li>
 * </ul>
 *
 * @param frontendUrl public address of the storefront; Stripe returns the customer there
 */
@ConfigurationProperties(prefix = "payment")
public record PaymentProperties(String provider, String currency, String frontendUrl, Stripe stripe) {

    public record Stripe(String secretKey, String webhookSecret) {
    }

    public boolean stripeEnabled() {
        return "stripe".equalsIgnoreCase(provider);
    }
}
