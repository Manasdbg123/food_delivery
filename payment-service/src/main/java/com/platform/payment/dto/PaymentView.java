package com.platform.payment.dto;

import com.platform.payment.domain.PaymentProvider;
import com.platform.payment.domain.PaymentStatus;
import com.platform.payment.entity.Payment;

import java.time.Instant;

public record PaymentView(Long orderId, PaymentStatus status, PaymentProvider provider, String method,
                          Double amount, String currency, Instant updatedAt) {

    public static PaymentView of(Payment p) {
        return new PaymentView(p.getOrderId(), p.getStatus(), p.getProvider(), p.getMethod(),
                p.getAmount(), p.getCurrency(), p.getUpdatedAt());
    }
}
