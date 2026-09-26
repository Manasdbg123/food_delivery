package com.platform.order.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "menu-service")
public interface MenuClient {

    @GetMapping("/api/v1/menus/{id}")
    MenuItemView getMenuItem(@PathVariable("id") Long id);

    record MenuItemView(Long id, Long restaurantId, String name, Double price, Boolean isVeg, Boolean isAvailable) {
    }
}
