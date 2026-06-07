package com.platform.user.messaging.consumer;
import com.platform.user.entity.UserProfile;
import com.platform.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.util.Map;
@Service @RequiredArgsConstructor
public class UserEventConsumer {
    private final UserProfileRepository repo;
    @KafkaListener(topics = "user-events", groupId = "user-service-group")
    public void handleUserRegisteredEvent(Map<String, Object> eventPayload) {
        String userId = (String) eventPayload.get("userId");
        if (repo.existsById(userId)) return;
        UserProfile profile = new UserProfile();
        profile.setUserId(userId);
        profile.setEmail((String) eventPayload.get("email"));
        profile.setFirstName((String) eventPayload.get("firstName"));
        profile.setLastName((String) eventPayload.get("lastName"));
        repo.save(profile);
    }
}
