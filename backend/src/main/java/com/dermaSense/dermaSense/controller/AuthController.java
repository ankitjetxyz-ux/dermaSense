package com.dermaSense.dermaSense.controller;

import com.dermaSense.dermaSense.domain.User;
import com.dermaSense.dermaSense.repository.UserRepository;
import java.net.URI;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        String resolvedName = request.fullName() != null && !request.fullName().isBlank()
                ? request.fullName().trim()
                : (request.name() == null ? "" : request.name().trim());

        if (request.email() == null || request.email().isBlank()
                || resolvedName.isBlank()
                || request.password() == null || request.password().isBlank()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Name, email and password are required."));
        }

        if (request.password().length() < 6) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Password must be at least 6 characters."));
        }

        if (userRepository.findByEmailIgnoreCase(request.email().trim()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse("Email is already registered."));
        }

        User user = new User();
        user.setFullName(resolvedName);
        user.setEmail(request.email().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setAge(request.age());
        user.setGender(request.gender());

        User saved = userRepository.save(user);
        AuthUserResponse payload = toResponse(saved);
        return ResponseEntity.created(URI.create("/api/users/" + saved.getId())).body(payload);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request.email() == null || request.email().isBlank() || request.password() == null || request.password().isBlank()) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Email and password are required."));
        }

        return userRepository.findByEmailIgnoreCase(request.email().trim())
                .map(user -> {
                    if (!passwordEncoder.matches(request.password(), user.getPassword())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(new ErrorResponse("Invalid email or password."));
                    }
                    return ResponseEntity.ok(toResponse(user));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ErrorResponse("Invalid email or password.")));
    }

    private AuthUserResponse toResponse(User user) {
        return new AuthUserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getAge(), user.getGender());
    }

    public record RegisterRequest(String fullName, String name, String email, String password, Integer age, String gender) {
    }

    public record LoginRequest(String email, String password) {
    }

    public record AuthUserResponse(Long id, String fullName, String email, Integer age, String gender) {
    }

    public record ErrorResponse(String message) {
    }
}
