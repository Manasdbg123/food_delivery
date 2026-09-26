package com.platform.payment.entity;

import com.platform.payment.domain.PaymentProvider;
import com.platform.payment.domain.PaymentStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

/** One payment per order. The unique order id makes every event handler idempotent. */
@Entity
@Table(name = "payments", uniqueConstraints = @UniqueConstraint(name = "uk_payments_order", columnNames = "orderId"))
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long orderId;
    private String userId;
    private Double amount;
    private String currency;
    private String method;

    @Enumerated(EnumType.STRING)
    private PaymentProvider provider;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private String checkoutSessionId;
    @Column(length = 1000)
    private String checkoutUrl;
    private Instant checkoutExpiresAt;
    private String providerPaymentId;

    @Column(updatable = false)
    private Instant createdAt;
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
