package com.platform.user.controller;
import com.platform.user.entity.UserProfile;
import com.platform.user.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/users") @RequiredArgsConstructor
public class UserController {
    private final UserProfileRepository repo;
    @GetMapping("/me")
    public ResponseEntity<UserProfile> getCurrentUserProfile(@RequestHeader("X-User-Id") String userId) {
        return repo.findById(userId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
