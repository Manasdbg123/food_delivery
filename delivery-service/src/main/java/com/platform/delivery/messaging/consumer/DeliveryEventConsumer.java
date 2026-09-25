package com.platform.delivery.messaging.consumer;

import com.platform.delivery.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class DeliveryEventConsumer {

    private final DeliveryService deliveries;

    @KafkaListener(topics = "payment-events", groupId = "delivery-service-group")
    public void onPayment(Map<String, Object> event) {
        if ("PAYMENT_SUCCESS".equals(event.get("eventType")) && event.get("orderId") != null) {
            deliveries.start(Long.valueOf(event.get("orderId").toString()));
        }
    }

    @KafkaListener(topics = "order-events", groupId = "delivery-service-group")
    public void onOrder(Map<String, Object> event) {
        if ("ORDER_CANCELLED".equals(event.get("eventType")) && event.get("orderId") != null) {
            deliveries.cancel(Long.valueOf(event.get("orderId").toString()));
        }
    }
}
