package com.platform.order.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * One line of an order. Name and price are copied from menu-service at the moment
 * the order is placed, so a later menu change never rewrites an old receipt.
 */
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    private Long menuItemId;
    private String name;
    private Double price;
    private Integer quantity;
    private Boolean isVeg;
}
