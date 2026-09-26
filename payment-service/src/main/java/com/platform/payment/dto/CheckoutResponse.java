package com.platform.payment.dto;

import com.platform.payment.domain.PaymentStatus;

/** Where to send the customer. {@code checkoutUrl} is null when there is no page to visit. */
public record CheckoutResponse(Long orderId, String provider, PaymentStatus status, String checkoutUrl) {
}
