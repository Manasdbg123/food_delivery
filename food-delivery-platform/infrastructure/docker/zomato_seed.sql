CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

CREATE TABLE IF NOT EXISTS restaurants (id INT PRIMARY KEY, name VARCHAR(255), cuisine VARCHAR(255), rating FLOAT, delivery_time VARCHAR(50), image_url VARCHAR(500));
CREATE TABLE IF NOT EXISTS menu_items (id INT AUTO_INCREMENT PRIMARY KEY, restaurant_id INT, name VARCHAR(255), price INT, is_veg BOOLEAN, FOREIGN KEY (restaurant_id) REFERENCES restaurants(id));

INSERT IGNORE INTO restaurants VALUES (1, 'Meghana Foods', 'Biryani, Andhra', 4.5, '30-40 min', 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500');
INSERT IGNORE INTO restaurants VALUES (2, 'Truffles', 'Burgers, American', 4.4, '25-35 min', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500');
INSERT IGNORE INTO restaurants VALUES (3, 'Empire Restaurant', 'North Indian, Mughlai', 4.2, '35-45 min', 'https://images.unsplash.com/photo-1610970881699-44a5587cbd0f?w=500');
INSERT IGNORE INTO restaurants VALUES (4, 'A2B - Adyar Ananda Bhavan', 'South Indian, Sweets', 4.3, '20-30 min', 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500');
INSERT IGNORE INTO restaurants VALUES (5, 'Domino's Pizza', 'Pizzas, Fast Food', 4.1, '25-30 min', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500');
INSERT IGNORE INTO restaurants VALUES (6, 'KFC', 'Burger, Fast Food', 4.0, '20-30 min', 'https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=500');
INSERT IGNORE INTO restaurants VALUES (7, 'Corner House Ice Cream', 'Desserts, Ice Cream', 4.8, '15-25 min', 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=500');
INSERT IGNORE INTO restaurants VALUES (8, 'Rameshwaram Cafe', 'South Indian', 4.6, '40-50 min', 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500');
INSERT IGNORE INTO restaurants VALUES (9, 'Nagarjuna', 'Andhra, Biryani', 4.4, '30-40 min', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500');
INSERT IGNORE INTO restaurants VALUES (10, 'Leon's Burgers & Wings', 'American, Fast Food', 4.3, '25-35 min', 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500');
INSERT IGNORE INTO restaurants VALUES (11, 'Ambur Star Briyani', 'Biryani, South Indian', 4.1, '35-45 min', 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500');
INSERT IGNORE INTO restaurants VALUES (12, 'McDonald's', 'Burgers, Beverages', 4.2, '20-30 min', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500');
INSERT IGNORE INTO restaurants VALUES (13, 'Polar Bear', 'Desserts, Ice Cream', 4.3, '15-25 min', 'https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?w=500');
INSERT IGNORE INTO restaurants VALUES (14, 'Behrouz Biryani', 'Biryani, Mughlai', 4.0, '45-55 min', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500');
INSERT IGNORE INTO restaurants VALUES (15, 'Theobroma', 'Bakery, Desserts', 4.5, '25-35 min', 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500');
