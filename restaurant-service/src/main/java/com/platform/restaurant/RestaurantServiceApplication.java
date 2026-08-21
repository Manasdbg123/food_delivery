package com.platform.restaurant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching // This turns on the Redis superpowers we just added!
public class RestaurantServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(RestaurantServiceApplication.class, args);
    }
}
