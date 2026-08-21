package com.platform.restaurant.config;

import com.platform.restaurant.entity.Restaurant;
import com.platform.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RestaurantRepository repository;

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }

        repository.save(seed("Spice Route", "Indian", "Mumbai", "12 MG Road, Mumbai", 4.5, 35));
        repository.save(seed("Pizza Palace", "Italian", "Mumbai", "45 Marine Drive, Mumbai", 4.2, 30));
        repository.save(seed("Dragon Wok", "Chinese", "Bangalore", "8 Indiranagar, Bangalore", 4.3, 40));
        repository.save(seed("Burger Barn", "American", "Bangalore", "22 Koramangala, Bangalore", 4.0, 25));
        repository.save(seed("Curry House", "Indian", "Delhi", "5 Connaught Place, Delhi", 4.6, 45));
    }

    private Restaurant seed(String name, String cuisine, String city, String address, double rating, int avgDeliveryTimeMinutes) {
        Restaurant restaurant = new Restaurant();
        restaurant.setName(name);
        restaurant.setCuisine(cuisine);
        restaurant.setCity(city);
        restaurant.setAddress(address);
        restaurant.setRating(rating);
        restaurant.setAvgDeliveryTimeMinutes(avgDeliveryTimeMinutes);
        restaurant.setImageUrl("https://placehold.co/400x300?text=" + name.replace(" ", "+"));
        restaurant.setIsOpen(true);
        return restaurant;
    }
}
