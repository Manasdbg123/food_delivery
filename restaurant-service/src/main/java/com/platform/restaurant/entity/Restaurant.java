package com.platform.restaurant.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "restaurants")
@Data
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String cuisine;

    @Column(nullable = false)
    private String city;

    private String address;
    /** Neighbourhood shown on listings, e.g. "Koramangala". */
    private String area;

    private Double rating;

    private Integer avgDeliveryTimeMinutes;

    private String imageUrl;
    private Integer costForTwo;
    /** Short promotional line shown on the listing card; blank when there is none. */
    private String offer;
    /** Pure-vegetarian kitchen. */
    private Boolean veg = false;

    @Column(name = "is_open")
    private Boolean isOpen = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
