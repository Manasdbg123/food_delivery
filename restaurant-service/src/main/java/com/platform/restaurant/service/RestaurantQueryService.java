package com.platform.restaurant.service;

import com.platform.restaurant.entity.Restaurant;
import com.platform.restaurant.exception.ResourceNotFoundException;
import com.platform.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/**
 * Cached single-restaurant reads. Cached as the entity, not as a ResponseEntity,
 * which Redis could store but never read back.
 */
@Service
@RequiredArgsConstructor
public class RestaurantQueryService {

    private final RestaurantRepository repository;

    @Cacheable(value = "restaurants", key = "#id")
    public Restaurant byId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + id));
    }
}
