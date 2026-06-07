package com.platform.payment.messaging.producer;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
@Service @RequiredArgsConstructor
public class PaymentEventProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;
    public void publishPaymentResult(Long orderId, boolean isSuccess) {
        Map<String, Object> event = new HashMap<>();
        event.put("eventType", isSuccess ? "PAYMENT_SUCCESS" : "PAYMENT_FAILED");
        event.put("orderId", orderId);
        kafkaTemplate.send("payment-events", String.valueOf(orderId), event);
    }
}
