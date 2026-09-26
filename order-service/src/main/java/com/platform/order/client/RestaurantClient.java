package com.platform.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "restaurant-service")
public interface RestaurantClient {

    @GetMapping("/api/v1/restaurants/{id}")
    RestaurantView getRestaurant(@PathVariable("id") Long id);

    record RestaurantView(Long id, String name, Boolean isOpen) {
    }
}
