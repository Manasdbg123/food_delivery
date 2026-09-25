package com.platform.restaurant.controller;

import com.platform.restaurant.dto.CreateRestaurantRequest;
import com.platform.restaurant.entity.Restaurant;
import com.platform.restaurant.exception.ResourceNotFoundException;
import com.platform.restaurant.repository.RestaurantRepository;
import com.platform.restaurant.service.RestaurantQueryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantRepository repository;
    private final RestaurantQueryService restaurants;

    @GetMapping
    public ResponseEntity<List<Restaurant>> getRestaurants(@RequestParam(required = false) String city) {
        List<Restaurant> restaurants = (city == null || city.isBlank())
                ? repository.findByIsOpenTrue()
                : repository.findByCityIgnoreCaseAndIsOpenTrue(city);
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurant(@PathVariable Long id) {
        return ResponseEntity.ok(restaurants.byId(id));
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<Boolean> getRestaurantStatus(@PathVariable Long id) {
        Restaurant restaurant = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
        return ResponseEntity.ok(Boolean.TRUE.equals(restaurant.getIsOpen()));
    }

    @PostMapping
    public ResponseEntity<Restaurant> createRestaurant(@Valid @RequestBody CreateRestaurantRequest request) {
        Restaurant restaurant = new Restaurant();
        restaurant.setName(request.name());
        restaurant.setCuisine(request.cuisine());
        restaurant.setCity(request.city());
        restaurant.setAddress(request.address());
        restaurant.setAvgDeliveryTimeMinutes(request.avgDeliveryTimeMinutes());
        restaurant.setImageUrl(request.imageUrl());
        restaurant.setArea(request.area());
        restaurant.setCostForTwo(request.costForTwo());
        restaurant.setVeg(Boolean.TRUE.equals(request.veg()));
        restaurant.setRating(0.0);
        restaurant.setIsOpen(true);
        Restaurant saved = repository.save(restaurant);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
