import os

project = "food-delivery-platform"

auth_yml = """spring:
  application:
    name: auth-service
  datasource:
    url: jdbc:mysql://localhost:3306/user_db?allowPublicKeyRetrieval=true&useSSL=false
    username: root
    password: manas@9546
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer

server:
  port: 8081

eureka:
  instance:
    hostname: localhost
    prefer-ip-address: true
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/

jwt:
  secret: 5367566B5970337336763979244226452948404D635166546A576E5A71347437
  expiration: 86400000"""

user_yml = """spring:
  application:
    name: user-service
  datasource:
    url: jdbc:mysql://localhost:3306/user_db?allowPublicKeyRetrieval=true&useSSL=false
    username: root
    password: manas@9546
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
  kafka:
    bootstrap-servers: localhost:9092
    consumer:
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      group-id: user-group
      properties:
        spring.json.trusted.packages: "com.platform.auth.messaging.event,com.platform.user.messaging.event,*"

server:
  port: 8082

eureka:
  instance:
    hostname: localhost
    prefer-ip-address: true
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/"""

restaurants = [
    {"id": 1, "name": "Meghana Foods", "cuisine": "Biryani, Andhra", "rating": 4.5, "time": "30-40 min", "img": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500"},
    {"id": 2, "name": "Truffles", "cuisine": "Burgers, American", "rating": 4.4, "time": "25-35 min", "img": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"},
    {"id": 3, "name": "Empire Restaurant", "cuisine": "North Indian, Mughlai", "rating": 4.2, "time": "35-45 min", "img": "https://images.unsplash.com/photo-1610970881699-44a5587cbd0f?w=500"},
    {"id": 4, "name": "A2B - Adyar Ananda Bhavan", "cuisine": "South Indian, Sweets", "rating": 4.3, "time": "20-30 min", "img": "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500"},
    {"id": 5, "name": "Domino's Pizza", "cuisine": "Pizzas, Fast Food", "rating": 4.1, "time": "25-30 min", "img": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"},
    {"id": 6, "name": "KFC", "cuisine": "Burger, Fast Food", "rating": 4.0, "time": "20-30 min", "img": "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=500"},
    {"id": 7, "name": "Corner House Ice Cream", "cuisine": "Desserts, Ice Cream", "rating": 4.8, "time": "15-25 min", "img": "https://images.unsplash.com/photo-1557142046-c704a3adf364?w=500"},
    {"id": 8, "name": "Rameshwaram Cafe", "cuisine": "South Indian", "rating": 4.6, "time": "40-50 min", "img": "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=500"},
    {"id": 9, "name": "Nagarjuna", "cuisine": "Andhra, Biryani", "rating": 4.4, "time": "30-40 min", "img": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500"},
    {"id": 10, "name": "Leon's Burgers & Wings", "cuisine": "American, Fast Food", "rating": 4.3, "time": "25-35 min", "img": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500"},
    {"id": 11, "name": "Ambur Star Briyani", "cuisine": "Biryani, South Indian", "rating": 4.1, "time": "35-45 min", "img": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500"},
    {"id": 12, "name": "McDonald's", "cuisine": "Burgers, Beverages", "rating": 4.2, "time": "20-30 min", "img": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500"},
    {"id": 13, "name": "Polar Bear", "cuisine": "Desserts, Ice Cream", "rating": 4.3, "time": "15-25 min", "img": "https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?w=500"},
    {"id": 14, "name": "Behrouz Biryani", "cuisine": "Biryani, Mughlai", "rating": 4.0, "time": "45-55 min", "img": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500"},
    {"id": 15, "name": "Theobroma", "cuisine": "Bakery, Desserts", "rating": 4.5, "time": "25-35 min", "img": "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500"}
]

sql = "CREATE DATABASE IF NOT EXISTS restaurant_db;\nUSE restaurant_db;\n\n"
sql += "CREATE TABLE IF NOT EXISTS restaurants (id INT PRIMARY KEY, name VARCHAR(255), cuisine VARCHAR(255), rating FLOAT, delivery_time VARCHAR(50), image_url VARCHAR(500));\n"
sql += "CREATE TABLE IF NOT EXISTS menu_items (id INT AUTO_INCREMENT PRIMARY KEY, restaurant_id INT, name VARCHAR(255), price INT, is_veg BOOLEAN, FOREIGN KEY (restaurant_id) REFERENCES restaurants(id));\n\n"

for r in restaurants:
    sql += f"INSERT IGNORE INTO restaurants VALUES ({r['id']}, '{r['name']}', '{r['cuisine']}', {r['rating']}, '{r['time']}', '{r['img']}');\n"

os.makedirs(f"{project}/auth-service/src/main/resources", exist_ok=True)
os.makedirs(f"{project}/user-service/src/main/resources", exist_ok=True)
os.makedirs(f"{project}/infrastructure/docker", exist_ok=True)

with open(f"{project}/auth-service/src/main/resources/application.yml", "w", encoding="utf-8") as f:
    f.write(auth_yml.strip() + "\n")
with open(f"{project}/user-service/src/main/resources/application.yml", "w", encoding="utf-8") as f:
    f.write(user_yml.strip() + "\n")
with open(f"{project}/infrastructure/docker/zomato_seed.sql", "w", encoding="utf-8") as f:
    f.write(sql)

print("[✓] Configurations patched and infrastructure/docker/zomato_seed.sql written.")
