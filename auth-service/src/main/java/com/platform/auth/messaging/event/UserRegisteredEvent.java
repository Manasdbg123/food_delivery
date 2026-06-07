package com.platform.auth.messaging.event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class UserRegisteredEvent {
    private String userId;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
}
