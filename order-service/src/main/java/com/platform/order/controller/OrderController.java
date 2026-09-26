package com.platform.order.controller;

import com.platform.order.dto.PlaceOrderRequest;
import com.platform.order.entity.Order;
import com.platform.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Orders belong to the caller identified by X-User-Id, which the gateway sets from the
 * verified JWT and strips from client requests. Every read and write is scoped to it.
 */
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private static final String USER = "X-User-Id";

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestHeader(USER) String userId,
                                            @Valid @RequestBody PlaceOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.placeOrder(userId, request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<Order>> myOrders(@RequestHeader(USER) String userId) {
        return ResponseEntity.ok(orderService.ordersForUser(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@RequestHeader(USER) String userId, @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getForUser(userId, id));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Order> cancel(@RequestHeader(USER) String userId, @PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancel(userId, id));
    }
}
