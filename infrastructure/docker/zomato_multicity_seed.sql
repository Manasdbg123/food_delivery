CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

CREATE TABLE IF NOT EXISTS restaurants (
    id INT PRIMARY KEY, name VARCHAR(255), city VARCHAR(100), cuisine VARCHAR(255), 
    rating FLOAT, delivery_time VARCHAR(50), image_url VARCHAR(500)
);

-- Bangalore
INSERT IGNORE INTO restaurants VALUES (1, 'Meghana Foods', 'Bangalore', 'Biryani, Andhra', 4.5, '30 min', 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500');
INSERT IGNORE INTO restaurants VALUES (2, 'Truffles', 'Bangalore', 'Burgers, American', 4.4, '35 min', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500');
INSERT IGNORE INTO restaurants VALUES (3, 'Rameshwaram Cafe', 'Bangalore', 'South Indian', 4.6, '40 min', 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500');

-- Mumbai
INSERT IGNORE INTO restaurants VALUES (4, 'Leopold Cafe', 'Mumbai', 'Continental, Desserts', 4.3, '25 min', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500');
INSERT IGNORE INTO restaurants VALUES (5, 'Bademiya', 'Mumbai', 'Kebabs, Mughlai', 4.2, '45 min', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500');
INSERT IGNORE INTO restaurants VALUES (6, 'Britannia & Co.', 'Mumbai', 'Parsi, Biryani', 4.5, '30 min', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500');

-- Delhi
INSERT IGNORE INTO restaurants VALUES (7, 'Karims', 'Delhi', 'Mughlai, North Indian', 4.7, '40 min', 'https://images.unsplash.com/photo-1610970881699-44a5587cbd0f?w=500');
INSERT IGNORE INTO restaurants VALUES (8, 'Bukhara', 'Delhi', 'North Indian', 4.8, '50 min', 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500');
INSERT IGNORE INTO restaurants VALUES (9, 'Big Chill', 'Delhi', 'Italian, Desserts', 4.6, '35 min', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500');

-- Hyderabad
INSERT IGNORE INTO restaurants VALUES (10, 'Paradise Biryani', 'Hyderabad', 'Biryani, Hyderabadi', 4.1, '30 min', 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500');
INSERT IGNORE INTO restaurants VALUES (11, 'Bawarchi', 'Hyderabad', 'Biryani, North Indian', 4.3, '35 min', 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500');
INSERT IGNORE INTO restaurants VALUES (12, 'Cafe Bahar', 'Hyderabad', 'Biryani, Desserts', 4.4, '25 min', 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500');

-- Chennai
INSERT IGNORE INTO restaurants VALUES (13, 'Murugan Idli Shop', 'Chennai', 'South Indian', 4.5, '20 min', 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500');
INSERT IGNORE INTO restaurants VALUES (14, 'Anjappar', 'Chennai', 'Chettinad, Biryani', 4.2, '40 min', 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500');
INSERT IGNORE INTO restaurants VALUES (15, 'Saravana Bhavan', 'Chennai', 'South Indian, Pure Veg', 4.4, '25 min', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500');
