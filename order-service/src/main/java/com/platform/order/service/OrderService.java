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
    public Order placeOrder(Order request) {
        request.setStatus("CREATED");
        Order savedOrder = repo.save(request);
        producer.publishOrderCreated(savedOrder);
        return savedOrder;
    }
}
