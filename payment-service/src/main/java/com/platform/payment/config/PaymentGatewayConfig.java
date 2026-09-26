package com.platform.payment.config;

import com.platform.payment.gateway.PaymentGateway;
import com.platform.payment.gateway.SimulatedPaymentGateway;
import com.platform.payment.gateway.StripePaymentGateway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
public class PaymentGatewayConfig {

    @Bean
    PaymentGateway paymentGateway(PaymentProperties props) {
        if (!props.stripeEnabled()) {
            return new SimulatedPaymentGateway();
        }
        // Fail at startup, not at the first customer's checkout.
        PaymentProperties.Stripe stripe = props.stripe();
        if (stripe == null || !StringUtils.hasText(stripe.secretKey()) || !StringUtils.hasText(stripe.webhookSecret())) {
            throw new IllegalStateException(
                    "PAYMENT_PROVIDER=stripe needs STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to be set");
        }
        if (!StringUtils.hasText(props.frontendUrl())) {
            throw new IllegalStateException("PAYMENT_PROVIDER=stripe needs FRONTEND_URL, where Stripe returns the customer");
        }
        return new StripePaymentGateway(stripe.secretKey(), stripe.webhookSecret());
    }
}
