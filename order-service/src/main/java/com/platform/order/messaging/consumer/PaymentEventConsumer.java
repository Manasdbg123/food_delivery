package com.platform.order.messaging.consumer;

import com.platform.order.domain.OrderStatus;
import com.platform.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

/** Moves orders along as payment and delivery report back. */
@Service
@RequiredArgsConstructor
public class PaymentEventConsumer {

    private final OrderService orderService;

    @KafkaListener(topics = "payment-events", groupId = "order-service-group")
    public void handlePaymentEvent(Map<String, Object> event) {
        Long orderId = orderId(event);
        if (orderId == null) return;
        Object type = event.get("eventType");
        if ("PAYMENT_SUCCESS".equals(type)) orderService.applyStatusEvent(orderId, OrderStatus.ACCEPTED);
        else if ("PAYMENT_FAILED".equals(type)) orderService.applyStatusEvent(orderId, OrderStatus.PAYMENT_FAILED);
    }

    @KafkaListener(topics = "delivery-events", groupId = "order-service-group")
    public void handleDeliveryEvent(Map<String, Object> event) {
        Long orderId = orderId(event);
        Object type = event.get("eventType");
        if (orderId != null && type != null) orderService.applyStatusEvent(orderId, type.toString());
    }

    private Long orderId(Map<String, Object> event) {
        Object raw = event.get("orderId");
        try {
            return raw == null ? null : Long.valueOf(raw.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
