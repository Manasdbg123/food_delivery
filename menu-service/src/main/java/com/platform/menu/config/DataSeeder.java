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

        // restaurantId values line up with restaurant-service's seeding order (1-15).
        seed(1L, "Chicken Dum Biryani", "Long-grain basmati slow-cooked with marinated chicken, saffron and fried onions", 340.0, false, "Biryani", true);
        seed(1L, "Mutton Biryani", "Tender goat on the bone, layered and sealed in dum", 420.0, false, "Biryani", true);
        seed(1L, "Paneer Tikka Biryani", "Char-grilled paneer folded into fragrant rice", 290.0, true, "Biryani", false);
        seed(1L, "Egg Biryani", "Two boiled eggs in spiced masala rice", 260.0, false, "Biryani", false);
        seed(1L, "Chicken 65", "Crisp, curry-leaf tempered fried chicken", 280.0, false, "Starters", true);
        seed(1L, "Gobi Manchurian", "Cauliflower florets tossed in a tangy Indo-Chinese sauce", 210.0, true, "Starters", false);
        seed(1L, "Mirchi Ka Salan", "Green chillies in a peanut and sesame gravy", 140.0, true, "Sides", false);
        seed(1L, "Raita", "Cool yoghurt with cucumber and roasted cumin", 60.0, true, "Sides", false);
        seed(1L, "Double Ka Meetha", "Bread pudding soaked in saffron milk, topped with nuts", 130.0, true, "Desserts", false);
        seed(2L, "Classic Cheese Burger", "Grilled patty, cheddar, pickles and house sauce", 260.0, false, "Burgers", true);
        seed(2L, "Crispy Chicken Burger", "Buttermilk fried chicken with slaw", 280.0, false, "Burgers", true);
        seed(2L, "Crispy Veg Burger", "Crumbed vegetable patty with lettuce and mayo", 190.0, true, "Burgers", false);
        seed(2L, "Peri Peri Fries", "Skin-on fries dusted with peri peri", 150.0, true, "Sides", true);
        seed(2L, "Loaded Nachos", "Nachos with cheese sauce, salsa and jalapeños", 220.0, true, "Sides", false);
        seed(2L, "Chocolate Brownie Shake", "Thick shake blended with a fudge brownie", 210.0, true, "Shakes", false);
        seed(2L, "Blueberry Cheesecake", "Baked cheesecake with blueberry compote", 240.0, true, "Desserts", false);
        seed(3L, "Ghee Podi Roast Dosa", "Crisp dosa brushed with ghee and gunpowder spice", 140.0, true, "Dosa", true);
        seed(3L, "Masala Dosa", "Golden dosa with potato palya, sambar and chutneys", 120.0, true, "Dosa", true);
        seed(3L, "Thatte Idli", "Plate-sized soft idli with coconut chutney", 70.0, true, "Idli & Vada", true);
        seed(3L, "Medu Vada", "Crisp lentil fritters, two pieces, with sambar", 80.0, true, "Idli & Vada", false);
        seed(3L, "Pongal", "Rice and moong dal cooked with black pepper and ghee", 110.0, true, "Meals", false);
        seed(3L, "Mini Meals", "Rice, sambar, rasam, poriyal, curd and papad", 180.0, true, "Meals", false);
        seed(3L, "Kesari Bath", "Semolina halwa with saffron and cashews", 70.0, true, "Sweets", false);
        seed(3L, "Filter Coffee", "Strong decoction with frothed milk", 50.0, true, "Beverages", true);
        seed(4L, "Chicken Club Sandwich", "Triple-decker with egg, chicken and fries", 360.0, false, "Mains", true);
        seed(4L, "Fish and Chips", "Beer-battered basa with tartare sauce", 520.0, false, "Mains", false);
        seed(4L, "Penne Arrabbiata", "Penne in a spicy tomato and garlic sauce", 380.0, true, "Pasta", false);
        seed(4L, "Margherita Pizza", "San Marzano tomato, mozzarella and basil", 420.0, true, "Pizza", true);
        seed(4L, "Pepperoni Pizza", "Loaded with spicy pepperoni and mozzarella", 520.0, false, "Pizza", false);
        seed(4L, "Sizzling Brownie", "Warm brownie with vanilla ice cream on a hot plate", 280.0, true, "Desserts", true);
        seed(4L, "Cold Coffee", "Blended iced coffee with a scoop of ice cream", 190.0, true, "Beverages", false);
        seed(5L, "Butter Chicken", "Tandoori chicken in a silky tomato and butter gravy", 380.0, false, "Mains", true);
        seed(5L, "Mutton Rogan Josh", "Slow-braised mutton in Kashmiri chilli gravy", 460.0, false, "Mains", false);
        seed(5L, "Dal Makhani", "Black lentils simmered overnight with butter and cream", 280.0, true, "Mains", true);
        seed(5L, "Paneer Butter Masala", "Cottage cheese in a rich tomato-cashew gravy", 320.0, true, "Mains", false);
        seed(5L, "Seekh Kebab", "Minced lamb skewers from the tandoor, four pieces", 360.0, false, "Kebabs", true);
        seed(5L, "Tandoori Chicken (Half)", "Yoghurt and spice marinated, charred in the tandoor", 340.0, false, "Kebabs", false);
        seed(5L, "Garlic Naan", "Tandoor-baked bread with garlic and butter", 70.0, true, "Breads", false);
        seed(5L, "Laccha Paratha", "Flaky layered whole-wheat bread", 60.0, true, "Breads", false);
        seed(5L, "Phirni", "Chilled rice pudding with cardamom and pistachio", 120.0, true, "Desserts", false);
        seed(6L, "Chicken Dum Biryani", "Long-grain basmati slow-cooked with marinated chicken, saffron and fried onions", 340.0, false, "Biryani", true);
        seed(6L, "Mutton Biryani", "Tender goat on the bone, layered and sealed in dum", 420.0, false, "Biryani", true);
        seed(6L, "Paneer Tikka Biryani", "Char-grilled paneer folded into fragrant rice", 290.0, true, "Biryani", false);
        seed(6L, "Egg Biryani", "Two boiled eggs in spiced masala rice", 260.0, false, "Biryani", false);
        seed(6L, "Chicken 65", "Crisp, curry-leaf tempered fried chicken", 280.0, false, "Starters", true);
        seed(6L, "Gobi Manchurian", "Cauliflower florets tossed in a tangy Indo-Chinese sauce", 210.0, true, "Starters", false);
        seed(6L, "Mirchi Ka Salan", "Green chillies in a peanut and sesame gravy", 140.0, true, "Sides", false);
        seed(6L, "Raita", "Cool yoghurt with cucumber and roasted cumin", 60.0, true, "Sides", false);
        seed(6L, "Double Ka Meetha", "Bread pudding soaked in saffron milk, topped with nuts", 130.0, true, "Desserts", false);
        seed(7L, "Butter Chicken", "Tandoori chicken in a silky tomato and butter gravy", 380.0, false, "Mains", true);
        seed(7L, "Mutton Rogan Josh", "Slow-braised mutton in Kashmiri chilli gravy", 460.0, false, "Mains", false);
        seed(7L, "Dal Makhani", "Black lentils simmered overnight with butter and cream", 280.0, true, "Mains", true);
        seed(7L, "Paneer Butter Masala", "Cottage cheese in a rich tomato-cashew gravy", 320.0, true, "Mains", false);
        seed(7L, "Seekh Kebab", "Minced lamb skewers from the tandoor, four pieces", 360.0, false, "Kebabs", true);
        seed(7L, "Tandoori Chicken (Half)", "Yoghurt and spice marinated, charred in the tandoor", 340.0, false, "Kebabs", false);
        seed(7L, "Garlic Naan", "Tandoor-baked bread with garlic and butter", 70.0, true, "Breads", false);
        seed(7L, "Laccha Paratha", "Flaky layered whole-wheat bread", 60.0, true, "Breads", false);
        seed(7L, "Phirni", "Chilled rice pudding with cardamom and pistachio", 120.0, true, "Desserts", false);
        seed(8L, "Butter Chicken", "Tandoori chicken in a silky tomato and butter gravy", 380.0, false, "Mains", true);
        seed(8L, "Mutton Rogan Josh", "Slow-braised mutton in Kashmiri chilli gravy", 460.0, false, "Mains", false);
        seed(8L, "Dal Makhani", "Black lentils simmered overnight with butter and cream", 280.0, true, "Mains", true);
        seed(8L, "Paneer Butter Masala", "Cottage cheese in a rich tomato-cashew gravy", 320.0, true, "Mains", false);
        seed(8L, "Seekh Kebab", "Minced lamb skewers from the tandoor, four pieces", 360.0, false, "Kebabs", true);
        seed(8L, "Tandoori Chicken (Half)", "Yoghurt and spice marinated, charred in the tandoor", 340.0, false, "Kebabs", false);
        seed(8L, "Garlic Naan", "Tandoor-baked bread with garlic and butter", 70.0, true, "Breads", false);
        seed(8L, "Laccha Paratha", "Flaky layered whole-wheat bread", 60.0, true, "Breads", false);
        seed(8L, "Phirni", "Chilled rice pudding with cardamom and pistachio", 120.0, true, "Desserts", false);
        seed(9L, "Chicken Club Sandwich", "Triple-decker with egg, chicken and fries", 360.0, false, "Mains", true);
        seed(9L, "Fish and Chips", "Beer-battered basa with tartare sauce", 520.0, false, "Mains", false);
        seed(9L, "Penne Arrabbiata", "Penne in a spicy tomato and garlic sauce", 380.0, true, "Pasta", false);
        seed(9L, "Margherita Pizza", "San Marzano tomato, mozzarella and basil", 420.0, true, "Pizza", true);
        seed(9L, "Pepperoni Pizza", "Loaded with spicy pepperoni and mozzarella", 520.0, false, "Pizza", false);
        seed(9L, "Sizzling Brownie", "Warm brownie with vanilla ice cream on a hot plate", 280.0, true, "Desserts", true);
        seed(9L, "Cold Coffee", "Blended iced coffee with a scoop of ice cream", 190.0, true, "Beverages", false);
        seed(10L, "Chicken Dum Biryani", "Long-grain basmati slow-cooked with marinated chicken, saffron and fried onions", 340.0, false, "Biryani", true);
        seed(10L, "Mutton Biryani", "Tender goat on the bone, layered and sealed in dum", 420.0, false, "Biryani", true);
        seed(10L, "Paneer Tikka Biryani", "Char-grilled paneer folded into fragrant rice", 290.0, true, "Biryani", false);
        seed(10L, "Egg Biryani", "Two boiled eggs in spiced masala rice", 260.0, false, "Biryani", false);
        seed(10L, "Chicken 65", "Crisp, curry-leaf tempered fried chicken", 280.0, false, "Starters", true);
        seed(10L, "Gobi Manchurian", "Cauliflower florets tossed in a tangy Indo-Chinese sauce", 210.0, true, "Starters", false);
        seed(10L, "Mirchi Ka Salan", "Green chillies in a peanut and sesame gravy", 140.0, true, "Sides", false);
        seed(10L, "Raita", "Cool yoghurt with cucumber and roasted cumin", 60.0, true, "Sides", false);
        seed(10L, "Double Ka Meetha", "Bread pudding soaked in saffron milk, topped with nuts", 130.0, true, "Desserts", false);
        seed(11L, "Chicken Dum Biryani", "Long-grain basmati slow-cooked with marinated chicken, saffron and fried onions", 340.0, false, "Biryani", true);
        seed(11L, "Mutton Biryani", "Tender goat on the bone, layered and sealed in dum", 420.0, false, "Biryani", true);
        seed(11L, "Paneer Tikka Biryani", "Char-grilled paneer folded into fragrant rice", 290.0, true, "Biryani", false);
        seed(11L, "Egg Biryani", "Two boiled eggs in spiced masala rice", 260.0, false, "Biryani", false);
        seed(11L, "Chicken 65", "Crisp, curry-leaf tempered fried chicken", 280.0, false, "Starters", true);
        seed(11L, "Gobi Manchurian", "Cauliflower florets tossed in a tangy Indo-Chinese sauce", 210.0, true, "Starters", false);
        seed(11L, "Mirchi Ka Salan", "Green chillies in a peanut and sesame gravy", 140.0, true, "Sides", false);
        seed(11L, "Raita", "Cool yoghurt with cucumber and roasted cumin", 60.0, true, "Sides", false);
        seed(11L, "Double Ka Meetha", "Bread pudding soaked in saffron milk, topped with nuts", 130.0, true, "Desserts", false);
        seed(12L, "Chicken Dum Biryani", "Long-grain basmati slow-cooked with marinated chicken, saffron and fried onions", 340.0, false, "Biryani", true);
        seed(12L, "Mutton Biryani", "Tender goat on the bone, layered and sealed in dum", 420.0, false, "Biryani", true);
        seed(12L, "Paneer Tikka Biryani", "Char-grilled paneer folded into fragrant rice", 290.0, true, "Biryani", false);
        seed(12L, "Egg Biryani", "Two boiled eggs in spiced masala rice", 260.0, false, "Biryani", false);
        seed(12L, "Chicken 65", "Crisp, curry-leaf tempered fried chicken", 280.0, false, "Starters", true);
        seed(12L, "Gobi Manchurian", "Cauliflower florets tossed in a tangy Indo-Chinese sauce", 210.0, true, "Starters", false);
        seed(12L, "Mirchi Ka Salan", "Green chillies in a peanut and sesame gravy", 140.0, true, "Sides", false);
        seed(12L, "Raita", "Cool yoghurt with cucumber and roasted cumin", 60.0, true, "Sides", false);
        seed(12L, "Double Ka Meetha", "Bread pudding soaked in saffron milk, topped with nuts", 130.0, true, "Desserts", false);
        seed(13L, "Ghee Podi Roast Dosa", "Crisp dosa brushed with ghee and gunpowder spice", 140.0, true, "Dosa", true);
        seed(13L, "Masala Dosa", "Golden dosa with potato palya, sambar and chutneys", 120.0, true, "Dosa", true);
        seed(13L, "Thatte Idli", "Plate-sized soft idli with coconut chutney", 70.0, true, "Idli & Vada", true);
        seed(13L, "Medu Vada", "Crisp lentil fritters, two pieces, with sambar", 80.0, true, "Idli & Vada", false);
        seed(13L, "Pongal", "Rice and moong dal cooked with black pepper and ghee", 110.0, true, "Meals", false);
        seed(13L, "Mini Meals", "Rice, sambar, rasam, poriyal, curd and papad", 180.0, true, "Meals", false);
        seed(13L, "Kesari Bath", "Semolina halwa with saffron and cashews", 70.0, true, "Sweets", false);
        seed(13L, "Filter Coffee", "Strong decoction with frothed milk", 50.0, true, "Beverages", true);
        seed(14L, "Chicken Dum Biryani", "Long-grain basmati slow-cooked with marinated chicken, saffron and fried onions", 340.0, false, "Biryani", true);
        seed(14L, "Mutton Biryani", "Tender goat on the bone, layered and sealed in dum", 420.0, false, "Biryani", true);
        seed(14L, "Paneer Tikka Biryani", "Char-grilled paneer folded into fragrant rice", 290.0, true, "Biryani", false);
        seed(14L, "Egg Biryani", "Two boiled eggs in spiced masala rice", 260.0, false, "Biryani", false);
        seed(14L, "Chicken 65", "Crisp, curry-leaf tempered fried chicken", 280.0, false, "Starters", true);
        seed(14L, "Gobi Manchurian", "Cauliflower florets tossed in a tangy Indo-Chinese sauce", 210.0, true, "Starters", false);
        seed(14L, "Mirchi Ka Salan", "Green chillies in a peanut and sesame gravy", 140.0, true, "Sides", false);
        seed(14L, "Raita", "Cool yoghurt with cucumber and roasted cumin", 60.0, true, "Sides", false);
        seed(14L, "Double Ka Meetha", "Bread pudding soaked in saffron milk, topped with nuts", 130.0, true, "Desserts", false);
        seed(15L, "Ghee Podi Roast Dosa", "Crisp dosa brushed with ghee and gunpowder spice", 140.0, true, "Dosa", true);
        seed(15L, "Masala Dosa", "Golden dosa with potato palya, sambar and chutneys", 120.0, true, "Dosa", true);
        seed(15L, "Thatte Idli", "Plate-sized soft idli with coconut chutney", 70.0, true, "Idli & Vada", true);
        seed(15L, "Medu Vada", "Crisp lentil fritters, two pieces, with sambar", 80.0, true, "Idli & Vada", false);
        seed(15L, "Pongal", "Rice and moong dal cooked with black pepper and ghee", 110.0, true, "Meals", false);
        seed(15L, "Mini Meals", "Rice, sambar, rasam, poriyal, curd and papad", 180.0, true, "Meals", false);
        seed(15L, "Kesari Bath", "Semolina halwa with saffron and cashews", 70.0, true, "Sweets", false);
        seed(15L, "Filter Coffee", "Strong decoction with frothed milk", 50.0, true, "Beverages", true);
    }

    private void seed(Long restaurantId, String name, String description, double price, boolean isVeg,
                      String category, boolean bestseller) {
        MenuItem item = new MenuItem();
        item.setRestaurantId(restaurantId);
        item.setName(name);
        item.setDescription(description);
        item.setPrice(price);
        item.setIsVeg(isVeg);
        item.setCategory(category);
        item.setBestseller(bestseller);
        item.setIsAvailable(true);
        repository.save(item);
    }
}
