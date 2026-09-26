package com.platform.payment.messaging.producer;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishPaymentResult(Long orderId, boolean isSuccess, String method) {
        send(orderId, isSuccess ? "PAYMENT_SUCCESS" : "PAYMENT_FAILED", method);
    }

    public void publishRefunded(Long orderId) {
        send(orderId, "PAYMENT_REFUNDED", null);
    }

    private void send(Long orderId, String type, String method) {
        Map<String, Object> event = new HashMap<>();
        event.put("eventType", type);
        event.put("orderId", orderId);
        if (method != null) event.put("paymentMethod", method);
        kafkaTemplate.send("payment-events", String.valueOf(orderId), event);
    }
}
