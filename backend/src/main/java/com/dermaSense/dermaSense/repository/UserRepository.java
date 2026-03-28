package com.dermaSense.dermaSense.repository;

import com.dermaSense.dermaSense.domain.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmailIgnoreCase(String email);
}