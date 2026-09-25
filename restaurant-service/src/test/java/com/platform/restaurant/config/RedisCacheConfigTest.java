package com.platform.restaurant.config;

import com.platform.restaurant.entity.Restaurant;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;

class RedisCacheConfigTest {

    @Test
    void aCachedRestaurantComesBackIntact() {
        Restaurant r = new Restaurant();
        r.setId(3L);
        r.setName("Rameshwaram Cafe");
        r.setCity("Bangalore");
        r.setCreatedAt(LocalDateTime.of(2026, 9, 1, 9, 0));

        GenericJackson2JsonRedisSerializer serializer = RedisCacheConfig.cacheSerializer();
        Restaurant back = assertInstanceOf(Restaurant.class, serializer.deserialize(serializer.serialize(r)));

        assertEquals("Rameshwaram Cafe", back.getName());
        assertEquals(r.getCreatedAt(), back.getCreatedAt());
    }
}
