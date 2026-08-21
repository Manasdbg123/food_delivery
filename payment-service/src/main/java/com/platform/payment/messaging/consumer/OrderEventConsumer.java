package com.platform.payment.messaging.consumer;
import com.platform.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.util.Map;
@Service @RequiredArgsConstructor
public class OrderEventConsumer {
    private final PaymentService paymentService;
    @KafkaListener(topics = "order-events", groupId = "payment-service-group")
    public void handleOrderEvent(Map<String, Object> event) {
        if ("ORDER_CREATED".equals(event.get("eventType"))) {
            paymentService.processPayment(Long.valueOf(event.get("orderId").toString()), Double.valueOf(event.get("totalAmount").toString()));
        }
    }
}
