package com.platform.menu.config;

import com.platform.menu.entity.MenuItem;
import com.platform.menu.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final MenuItemRepository repository;

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }

        // restaurantId values line up with restaurant-service's DataSeeder insertion order (1-5)
        seed(1L, "Butter Chicken", "Creamy tomato curry with tender chicken", 320.0, false);
        seed(1L, "Paneer Tikka Masala", "Grilled paneer in spiced gravy", 260.0, true);
        seed(1L, "Garlic Naan", "Tandoor-baked flatbread with garlic", 60.0, true);

        seed(2L, "Margherita Pizza", "Classic tomato, mozzarella and basil", 280.0, true);
        seed(2L, "Pepperoni Pizza", "Loaded with spicy pepperoni", 340.0, false);

        seed(3L, "Kung Pao Chicken", "Wok-tossed chicken with peanuts and chili", 300.0, false);
        seed(3L, "Veg Hakka Noodles", "Stir-fried noodles with fresh vegetables", 220.0, true);

        seed(4L, "Classic Cheese Burger", "Beef patty with cheddar and house sauce", 250.0, false);
        seed(4L, "Crispy Veg Burger", "Crispy vegetable patty with lettuce", 190.0, true);

        seed(5L, "Chicken Curry", "Slow-cooked North Indian chicken curry", 290.0, false);
        seed(5L, "Dal Makhani", "Slow-simmered black lentils in butter", 180.0, true);
    }

    private void seed(Long restaurantId, String name, String description, double price, boolean isVeg) {
        MenuItem item = new MenuItem();
        item.setRestaurantId(restaurantId);
        item.setName(name);
        item.setDescription(description);
        item.setPrice(price);
        item.setIsVeg(isVeg);
        item.setImageUrl("https://placehold.co/300x200?text=" + name.replace(" ", "+"));
        item.setIsAvailable(true);
        repository.save(item);
    }
}
