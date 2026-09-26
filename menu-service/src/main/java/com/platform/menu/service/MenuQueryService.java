package com.platform.menu.service;

import com.platform.menu.entity.MenuItem;
import com.platform.menu.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Menu reads, cached in Redis per restaurant.
 *
 * The cache sits here rather than on the controller because it must hold plain data:
 * a cached ResponseEntity serialises to JSON but cannot be deserialised back, so
 * every cache hit would fail.
 */
@Service
@RequiredArgsConstructor
public class MenuQueryService {

    private final MenuItemRepository repository;

    @Cacheable(value = "menus", key = "#restaurantId")
    public List<MenuItem> availableItems(Long restaurantId) {
        return repository.findByRestaurantIdAndIsAvailableTrue(restaurantId);
    }

    @CacheEvict(value = "menus", key = "#item.restaurantId")
    public MenuItem save(MenuItem item) {
        return repository.save(item);
    }
}
