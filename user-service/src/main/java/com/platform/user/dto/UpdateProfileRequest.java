package com.platform.user.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(max = 60, message = "First name is too long")
        String firstName,
        @Size(max = 60, message = "Last name is too long")
        String lastName,
        // Digits, spaces, dashes and an optional leading +; 7-20 characters.
        @Pattern(regexp = "^$|^\\+?[0-9 \\-]{7,20}$", message = "Enter a valid phone number")
        String phoneNumber
) {
}
