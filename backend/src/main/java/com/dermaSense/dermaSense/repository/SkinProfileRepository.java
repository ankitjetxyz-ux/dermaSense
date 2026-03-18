package com.dermaSense.dermaSense.repository;

import com.dermaSense.dermaSense.domain.SkinProfile;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkinProfileRepository extends JpaRepository<SkinProfile, Long> {

    List<SkinProfile> findByUserId(Long userId);
}