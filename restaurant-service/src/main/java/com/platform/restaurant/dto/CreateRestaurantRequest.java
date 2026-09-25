package com.platform.restaurant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record CreateRestaurantRequest(
        @NotBlank(message = "Name is required")
        String name,

        String cuisine,

        @NotBlank(message = "City is required")
        String city,

        String address,

        @Positive(message = "Average delivery time must be positive")
        Integer avgDeliveryTimeMinutes,

        String imageUrl,
        String area,
        @Positive(message = "Cost for two must be positive")
        Integer costForTwo,
        Boolean veg
) {
}
