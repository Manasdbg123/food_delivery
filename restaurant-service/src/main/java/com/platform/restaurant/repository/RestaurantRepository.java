package com.platform.restaurant.repository;

import com.platform.restaurant.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    List<Restaurant> findByCityIgnoreCaseAndIsOpenTrue(String city);

    List<Restaurant> findByIsOpenTrue();
}
