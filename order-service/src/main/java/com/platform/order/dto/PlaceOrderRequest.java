package com.platform.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.util.List;

/**
 * What the client may say about an order: which items and how many. Prices, names
 * and totals are looked up server-side - a client-supplied price is never trusted.
 * The user comes from the gateway's X-User-Id header, not from this body.
 */
public record PlaceOrderRequest(
        @NotNull(message = "restaurantId is required")
        Long restaurantId,

        @NotEmpty(message = "Add at least one item")
        @Size(max = 50, message = "An order can have at most 50 different items")
        List<@Valid Line> items,

        @NotBlank(message = "A delivery address is required")
        @Size(max = 300, message = "The delivery address is too long")
        String deliveryAddress,

        @NotBlank(message = "Choose a payment method")
        @Pattern(regexp = "UPI|CARD|COD", message = "Payment method must be UPI, CARD or COD")
        String paymentMethod,

        String couponCode
) {
    public record Line(
            @NotNull(message = "menuItemId is required")
            Long menuItemId,
            @NotNull @Min(value = 1, message = "Quantity must be at least 1")
            @Max(value = 20, message = "Quantity can be at most 20")
            Integer quantity
    ) {
    }
}
