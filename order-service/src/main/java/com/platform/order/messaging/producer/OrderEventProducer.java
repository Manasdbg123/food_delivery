package com.platform.order.messaging.producer;

import com.platform.order.entity.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishOrderCreated(Order order) {
        Map<String, Object> event = base("ORDER_CREATED", order);
        event.put("totalAmount", order.getTotalAmount());
        event.put("paymentMethod", order.getPaymentMethod());
        kafkaTemplate.send("order-events", String.valueOf(order.getId()), event);
    }

    public void publishOrderCancelled(Order order) {
        kafkaTemplate.send("order-events", String.valueOf(order.getId()), base("ORDER_CANCELLED", order));
    }

    private Map<String, Object> base(String type, Order order) {
        Map<String, Object> event = new HashMap<>();
        event.put("eventType", type);
        event.put("orderId", order.getId());
        event.put("userId", order.getUserId());
        return event;
    }
}
