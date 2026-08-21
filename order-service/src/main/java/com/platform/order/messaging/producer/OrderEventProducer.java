package com.platform.order.messaging.producer;
import com.platform.order.entity.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
@Service @RequiredArgsConstructor
public class OrderEventProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;
    public void publishOrderCreated(Order order) {
        Map<String, Object> event = new HashMap<>();
        event.put("eventType", "ORDER_CREATED");
        event.put("orderId", order.getId());
        event.put("userId", order.getUserId());
        event.put("totalAmount", order.getTotalAmount());
        kafkaTemplate.send("order-events", String.valueOf(order.getId()), event);
    }
}
