package com.platform.auth.controller;
import com.platform.auth.dto.LoginRequest;
import com.platform.auth.dto.RegisterRequest;
import com.platform.auth.entity.UserCredentials;
import com.platform.auth.messaging.event.UserRegisteredEvent;
import com.platform.auth.messaging.producer.AuthEventProducer;
import com.platform.auth.repository.UserCredentialsRepository;
import com.platform.auth.security.JwtProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (repo.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }
        UserCredentials user = new UserCredentials();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole("USER");
        repo.save(user);

        // Publish event to Kafka so User-Service creates the profile
        UserRegisteredEvent event = UserRegisteredEvent.builder()
                .userId(user.getId()).email(user.getEmail()).role(user.getRole())
                .firstName(request.firstName()).lastName(request.lastName()).build();
        producer.publishUserRegisteredEvent(event);

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Optional<UserCredentials> userOpt = repo.findByEmail(request.email());
        if (userOpt.isPresent() && passwordEncoder.matches(request.password(), userOpt.get().getPasswordHash())) {
            UserCredentials user = userOpt.get();
            String token = jwtProvider.generateToken(user.getEmail(), user.getRole(), user.getId());
            return ResponseEntity.ok(Map.of("token", token));
        }
        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }
}
