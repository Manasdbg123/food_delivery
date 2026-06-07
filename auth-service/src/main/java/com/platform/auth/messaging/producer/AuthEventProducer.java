package com.platform.auth.messaging.producer;
import com.platform.auth.messaging.event.UserRegisteredEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
@Service @RequiredArgsConstructor
public class AuthEventProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;
    public void publishUserRegisteredEvent(UserRegisteredEvent event) {
        kafkaTemplate.send("user-events", event.getUserId(), event);
    }
}
