package com.platform.menu.config;

import com.platform.menu.entity.MenuItem;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;

class RedisConfigTest {

    /** The cached value must survive a round trip, timestamps included. */
    @Test
    void aCachedMenuComesBackAsTheSameItems() {
        MenuItem item = new MenuItem();
        item.setId(7L);
        item.setRestaurantId(1L);
        item.setName("Masala Dosa");
        item.setPrice(120.0);
        item.setCreatedAt(LocalDateTime.of(2026, 9, 1, 10, 30));

        GenericJackson2JsonRedisSerializer serializer = RedisConfig.cacheSerializer();
        Object back = serializer.deserialize(serializer.serialize(List.of(item)));

        List<?> items = assertInstanceOf(List.class, back);
        MenuItem restored = assertInstanceOf(MenuItem.class, items.get(0));
        assertEquals("Masala Dosa", restored.getName());
        assertEquals(item.getCreatedAt(), restored.getCreatedAt());
    }
}
