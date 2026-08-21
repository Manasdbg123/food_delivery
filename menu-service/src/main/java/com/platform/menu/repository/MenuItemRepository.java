package com.platform.menu.repository;

import com.platform.menu.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    List<MenuItem> findByRestaurantIdAndIsAvailableTrue(Long restaurantId);
}
