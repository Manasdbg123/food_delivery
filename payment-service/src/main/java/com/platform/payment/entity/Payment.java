package com.platform.payment.entity;
import jakarta.persistence.*;
import lombok.Data;
@Entity
@Table(name = "payments")
@Data
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long orderId;
    private Double amount;
    private String status;
}
