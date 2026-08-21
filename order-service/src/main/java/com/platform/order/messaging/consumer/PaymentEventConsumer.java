package com.platform.order.messaging.consumer;
import com.platform.order.entity.Order;
import com.platform.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.util.Map;
@Service @RequiredArgsConstructor
public class PaymentEventConsumer {
    private final OrderRepository repo;
    @KafkaListener(topics = "payment-events", groupId = "order-service-group")
    public void handlePaymentEvent(Map<String, Object> event) {
        String eventType = (String) event.get("eventType");
        Long orderId = Long.valueOf(event.get("orderId").toString());
        Order order = repo.findById(orderId).orElseThrow();
        if ("PAYMENT_SUCCESS".equals(eventType)) order.setStatus("ACCEPTED");
        else if ("PAYMENT_FAILED".equals(eventType)) order.setStatus("PAYMENT_FAILED");
        repo.save(order);
    }
}
