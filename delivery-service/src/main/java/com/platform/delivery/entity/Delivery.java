package com.platform.delivery.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(name = "deliveries")
@Data
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private Long orderId;
    private Long partnerId;
    private String partnerName;
    /** PREPARING, OUT_FOR_DELIVERY, DELIVERED or CANCELLED. */
    private String status;
    /** When the delivery entered its current status; drives the next transition. */
    private Instant statusSince;
}
