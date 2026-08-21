package com.platform.order.controller;

import com.platform.order.dto.PlaceOrderRequest;
import com.platform.order.entity.Order;
import com.platform.order.exception.ResourceNotFoundException;
import com.platform.order.repository.OrderRepository;
import com.platform.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<Order> placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        Order order = new Order();
        order.setUserId(request.userId());
        order.setRestaurantId(request.restaurantId());
        order.setTotalAmount(request.totalAmount());
        Order placed = orderService.placeOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(placed);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return ResponseEntity.ok(order);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersForUser(@PathVariable String userId) {
        return ResponseEntity.ok(orderRepository.findByUserId(userId));
    }
}
