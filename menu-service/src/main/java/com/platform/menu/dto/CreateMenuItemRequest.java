package com.platform.menu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateMenuItemRequest(
        @NotNull(message = "Restaurant id is required")
        Long restaurantId,

        @NotBlank(message = "Name is required")
        String name,

        String description,

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        Double price,

        Boolean isVeg,

        String imageUrl,
        String category
) {
}
