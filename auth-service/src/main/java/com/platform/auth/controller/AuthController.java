package com.platform.auth.controller;
import com.platform.auth.entity.UserCredentials;
import com.platform.auth.messaging.event.UserRegisteredEvent;
import com.platform.auth.messaging.producer.AuthEventProducer;
import com.platform.auth.repository.UserCredentialsRepository;
import com.platform.auth.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserCredentialsRepository repo;
    private final JwtProvider jwtProvider;
    private final AuthEventProducer producer;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        if (repo.findByEmail(request.get("email")).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        UserCredentials user = new UserCredentials();
        user.setEmail(request.get("email"));
        user.setPasswordHash(request.get("password")); // In prod: use BCrypt!
        user.setRole("USER");
        repo.save(user);

        // Publish event to Kafka so User-Service creates the profile
        UserRegisteredEvent event = UserRegisteredEvent.builder()
                .userId(user.getId()).email(user.getEmail()).role(user.getRole())
                .firstName(request.get("firstName")).lastName(request.get("lastName")).build();
        producer.publishUserRegisteredEvent(event);

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        Optional<UserCredentials> userOpt = repo.findByEmail(request.get("email"));
        if (userOpt.isPresent() && userOpt.get().getPasswordHash().equals(request.get("password"))) {
            UserCredentials user = userOpt.get();
            String token = jwtProvider.generateToken(user.getEmail(), user.getRole(), user.getId());
            return ResponseEntity.ok(Map.of("token", token));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
