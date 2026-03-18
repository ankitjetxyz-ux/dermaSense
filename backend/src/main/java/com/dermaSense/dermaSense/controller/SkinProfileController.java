package com.dermaSense.dermaSense.controller;

import com.dermaSense.dermaSense.domain.SkinProfile;
import com.dermaSense.dermaSense.domain.User;
import com.dermaSense.dermaSense.repository.SkinProfileRepository;
import com.dermaSense.dermaSense.repository.UserRepository;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/skin-profiles")
public class SkinProfileController {

    private final SkinProfileRepository skinProfileRepository;
    private final UserRepository userRepository;

    public SkinProfileController(SkinProfileRepository skinProfileRepository, UserRepository userRepository) {
        this.skinProfileRepository = skinProfileRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<SkinProfile> getAllSkinProfiles() {
        return skinProfileRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkinProfile> getSkinProfileById(@PathVariable Long id) {
        return skinProfileRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<SkinProfile> getSkinProfilesByUser(@PathVariable Long userId) {
        return skinProfileRepository.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<?> createSkinProfile(@RequestBody CreateSkinProfileRequest request) {
        User user = userRepository.findById(request.userId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found for id=" + request.userId());
        }

        SkinProfile skinProfile = new SkinProfile(request.skinType(), request.concern(), user);
        SkinProfile saved = skinProfileRepository.save(skinProfile);
        return ResponseEntity.created(URI.create("/api/skin-profiles/" + saved.getId())).body(saved);
    }

    public record CreateSkinProfileRequest(String skinType, String concern, Long userId) {
    }
}