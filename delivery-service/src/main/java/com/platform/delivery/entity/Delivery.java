package com.platform.delivery.entity;
import jakarta.persistence.*;
import lombok.Data;
@Entity @Table(name = "deliveries") @Data
public class Delivery {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long orderId;
    private Long partnerId;
    private String status;
}
