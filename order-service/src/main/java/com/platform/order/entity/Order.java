package com.platform.order.entity;
import jakarta.persistence.*;
import lombok.Data;
@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userId;
    private Long restaurantId;
    private String status;
    private Double totalAmount;
}
