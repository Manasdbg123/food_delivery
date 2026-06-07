package com.platform.restaurant.repository;
import com.platform.restaurant.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    @Query(value = "SELECT * FROM restaurants WHERE is_open = true", nativeQuery = true)
    List<Restaurant> findNearbyRestaurants(@Param("userLat") Double userLat, @Param("userLng") Double userLng, @Param("radius") Double radius);
}
