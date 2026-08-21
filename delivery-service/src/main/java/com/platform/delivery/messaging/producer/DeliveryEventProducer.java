package com.platform.delivery.messaging.producer;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
@Service @RequiredArgsConstructor
public class DeliveryEventProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;
    public void publishDeliveryStatus(Long orderId, String status) {
        Map<String, Object> event = new HashMap<>();
        event.put("eventType", status); event.put("orderId", orderId);
        kafkaTemplate.send("delivery-events", String.valueOf(orderId), event);
    }
}
