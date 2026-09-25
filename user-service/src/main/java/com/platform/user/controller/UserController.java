package com.platform.user.controller;

import com.platform.user.dto.UpdateProfileRequest;
import com.platform.user.entity.UserProfile;
import com.platform.user.repository.UserProfileRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * The signed-in user's own profile. The user id always comes from X-User-Id, which
 * the gateway sets from the verified token - never from the path or the body.
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileRepository repo;

    @GetMapping("/me")
    public ResponseEntity<UserProfile> getCurrentUserProfile(@RequestHeader("X-User-Id") String userId) {
        return repo.findById(userId).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfile> updateCurrentUserProfile(
            @RequestHeader("X-User-Id") String userId,
            @Valid @RequestBody UpdateProfileRequest request) {
        // The profile is normally created from the registration event; create it here
        // if that event has not been processed yet, rather than failing the save.
        UserProfile profile = repo.findById(userId).orElseGet(() -> {
            UserProfile fresh = new UserProfile();
            fresh.setUserId(userId);
            return fresh;
        });
        if (request.firstName() != null) profile.setFirstName(request.firstName().trim());
        if (request.lastName() != null) profile.setLastName(request.lastName().trim());
        if (request.phoneNumber() != null) profile.setPhoneNumber(request.phoneNumber().trim());
        return ResponseEntity.ok(repo.save(profile));
    }
}
