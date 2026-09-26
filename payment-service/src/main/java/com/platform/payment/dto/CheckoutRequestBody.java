package com.platform.payment.dto;

import jakarta.validation.constraints.NotNull;

public record CheckoutRequestBody(@NotNull(message = "orderId is required") Long orderId) {
}
