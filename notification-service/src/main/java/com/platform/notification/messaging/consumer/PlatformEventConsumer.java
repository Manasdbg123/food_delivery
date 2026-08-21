package com.platform.notification.messaging.consumer;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.util.Map;
@Service
public class PlatformEventConsumer {
    @KafkaListener(topics = "user-events", groupId = "notification-group")
    public void handleUserEvents(Map<String, Object> event) { System.out.println("Email sent to new user."); }
    @KafkaListener(topics = "payment-events", groupId = "notification-group")
    public void handlePaymentEvents(Map<String, Object> event) { System.out.println("Payment notification sent."); }
}
