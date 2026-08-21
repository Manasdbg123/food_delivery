package com.platform.order.service;
import com.platform.order.client.RestaurantClient;
import com.platform.order.entity.Order;
import com.platform.order.messaging.producer.OrderEventProducer;
import com.platform.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class OrderService {
    private final OrderRepository repo;
    private final OrderEventProducer producer;
    private final RestaurantClient restaurantClient;

    public Order placeOrder(Order request) {
        Boolean isOpen;
        try {
            isOpen = restaurantClient.isRestaurantOpen(request.getRestaurantId());
        } catch (Exception e) {
            throw new IllegalStateException("Unable to verify restaurant availability, please try again later");
        }
        if (isOpen == null || !isOpen) {
            throw new IllegalStateException("Restaurant is currently closed and cannot accept orders");
        }

        request.setStatus("CREATED");
        Order savedOrder = repo.save(request);
        producer.publishOrderCreated(savedOrder);
        return savedOrder;
    }
}
