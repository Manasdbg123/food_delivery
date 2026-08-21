package com.platform.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PlaceOrderRequest(
        @NotBlank(message = "userId is required")
        String userId,

        @NotNull(message = "restaurantId is required")
        Long restaurantId,

        @NotNull(message = "totalAmount is required")
        @Positive(message = "totalAmount must be positive")
        Double totalAmount
) {
}
