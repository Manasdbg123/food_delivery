package com.platform.restaurant.config;

import com.platform.restaurant.entity.Restaurant;
import com.platform.restaurant.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
/**
 * Seeds the restaurants the frontend's sample catalogue shows (frontend/src/data/catalog.js),
 * in the same order, so ids 1-15 line up between the two. Runs only on an empty table.
 */
public class DataSeeder implements CommandLineRunner {

    private final RestaurantRepository repository;

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }

        repository.save(seed("Meghana Foods", "Biryani, Andhra", "Bangalore", "Koramangala", 4.5, 30, 500, "20% off up to ₹50", false, "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=70"));
        repository.save(seed("Truffles", "Burgers, American, Desserts", "Bangalore", "Indiranagar", 4.4, 35, 450, "Free delivery", false, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=70"));
        repository.save(seed("Rameshwaram Cafe", "South Indian, Pure Veg", "Bangalore", "Jayanagar", 4.6, 25, 250, "", true, "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=800&q=70"));
        repository.save(seed("Leopold Cafe", "Continental, Cafe, Desserts", "Mumbai", "Colaba", 4.3, 25, 900, "", false, "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=70"));
        repository.save(seed("Bademiya", "Kebabs, Mughlai", "Mumbai", "Colaba", 4.2, 45, 600, "₹75 off above ₹399", false, "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=70"));
        repository.save(seed("Britannia & Co.", "Parsi, Biryani", "Mumbai", "Fort", 4.5, 30, 800, "", false, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=70"));
        repository.save(seed("Karim's", "Mughlai, North Indian, Kebabs", "Delhi", "Chandni Chowk", 4.7, 40, 700, "15% off up to ₹90", false, "https://images.unsplash.com/photo-1610970881699-44a5587cbd0f?auto=format&fit=crop&w=800&q=70"));
        repository.save(seed("Bukhara", "North Indian, Kebabs", "Delhi", "Chanakyapuri", 4.8, 50, 3000, "", false, "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=800&q=70"));
        repository.save(seed("Big Chill", "Italian, Pizza, Desserts", "Delhi", "Khan Market", 4.6, 35, 1200, "Free dessert above ₹799", false, "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=70"));
        repository.save(seed("Paradise Biryani", "Biryani, Hyderabadi", "Hyderabad", "Secunderabad", 4.1, 30, 600, "20% off up to ₹100", false, "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=70"));
        repository.save(seed("Bawarchi", "Biryani, North Indian", "Hyderabad", "RTC X Roads", 4.3, 35, 500, "", false, "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=70"));
        repository.save(seed("Cafe Bahar", "Biryani, Desserts", "Hyderabad", "Himayatnagar", 4.4, 25, 450, "", false, "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=800&q=70"));
        repository.save(seed("Murugan Idli Shop", "South Indian, Pure Veg", "Chennai", "Besant Nagar", 4.5, 20, 200, "", true, "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=70"));
        repository.save(seed("Anjappar", "Chettinad, Biryani", "Chennai", "T. Nagar", 4.2, 40, 550, "₹50 off above ₹299", false, "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=800&q=70"));
        repository.save(seed("Saravana Bhavan", "South Indian, Pure Veg", "Chennai", "Mylapore", 4.4, 25, 350, "", true, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=70"));
    }

    private Restaurant seed(String name, String cuisine, String city, String area, double rating,
                            int avgDeliveryTimeMinutes, int costForTwo, String offer, boolean veg, String imageUrl) {
        Restaurant restaurant = new Restaurant();
        restaurant.setName(name);
        restaurant.setCuisine(cuisine);
        restaurant.setCity(city);
        restaurant.setArea(area);
        restaurant.setAddress(area + ", " + city);
        restaurant.setRating(rating);
        restaurant.setAvgDeliveryTimeMinutes(avgDeliveryTimeMinutes);
        restaurant.setCostForTwo(costForTwo);
        restaurant.setOffer(offer.isBlank() ? null : offer);
        restaurant.setVeg(veg);
        restaurant.setImageUrl(imageUrl);
        restaurant.setIsOpen(true);
        return restaurant;
    }
}
