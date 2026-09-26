package com.platform.payment.messaging.consumer;

import com.platform.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderEventConsumer {

    private final PaymentService paymentService;

    @KafkaListener(topics = "order-events", groupId = "payment-service-group")
    public void handleOrderEvent(Map<String, Object> event) {
        Long orderId = asLong(event.get("orderId"));
        if (orderId == null) return;
        Object type = event.get("eventType");
        if ("ORDER_CREATED".equals(type)) {
            Object amount = event.get("totalAmount");
            paymentService.onOrderCreated(orderId, asString(event.get("userId")),
                    amount == null ? null : Double.valueOf(amount.toString()), asString(event.get("paymentMethod")));
        } else if ("ORDER_CANCELLED".equals(type)) {
            paymentService.onOrderCancelled(orderId);
        }
    }

    private static Long asLong(Object raw) {
        try {
            return raw == null ? null : Long.valueOf(raw.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static String asString(Object raw) {
        return raw == null ? null : raw.toString();
    }
}
