package com.platform.menu.controller;

import com.platform.menu.dto.CreateMenuItemRequest;
import com.platform.menu.entity.MenuItem;
import com.platform.menu.exception.ResourceNotFoundException;
import com.platform.menu.repository.MenuItemRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/menus")
@RequiredArgsConstructor
public class MenuController {

    private final MenuItemRepository repository;

    @GetMapping("/restaurant/{restaurantId}")
    @Cacheable(value = "menus", key = "#restaurantId")
    public ResponseEntity<List<MenuItem>> getMenuForRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(repository.findByRestaurantIdAndIsAvailableTrue(restaurantId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItem(@PathVariable Long id) {
        MenuItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        return ResponseEntity.ok(item);
    }

    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(@Valid @RequestBody CreateMenuItemRequest request) {
        MenuItem item = new MenuItem();
        item.setRestaurantId(request.restaurantId());
        item.setName(request.name());
        item.setDescription(request.description());
        item.setPrice(request.price());
        item.setIsVeg(request.isVeg() != null ? request.isVeg() : true);
        item.setImageUrl(request.imageUrl());
        item.setIsAvailable(true);
        MenuItem saved = repository.save(item);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
