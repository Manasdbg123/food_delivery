package com.platform.payment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

/**
 * Reads an order as the customer who owns it. order-service scopes reads to X-User-Id,
 * so asking to pay for someone else's order comes back as 404. The amount charged is
 * always the one order-service priced, never a number from the browser.
 */
@FeignClient(name = "order-service")
public interface OrderClient {

    @GetMapping("/api/v1/orders/{id}")
    OrderView getOrder(@RequestHeader("X-User-Id") String userId, @PathVariable("id") Long id);

    record OrderView(Long id, String userId, String restaurantName, String status,
                     Double totalAmount, String paymentMethod) {
    }
}
