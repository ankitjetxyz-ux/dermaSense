package com.dermaSense.dermaSense.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "skin_profiles")
public class SkinProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long id;

    @Column(nullable = false)
    private String skinType;

    private String concern;

    private Integer sensitivityLevel;

    @Column(nullable = false)
    private Boolean acneProne = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public SkinProfile() {
    }

    public SkinProfile(String skinType, String concern, User user) {
        this.skinType = skinType;
        this.concern = concern;
        this.user = user;
    }

    @PrePersist
    public void prePersist() {
        if (acneProne == null) {
            acneProne = false;
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public String getSkinType() {
        return skinType;
    }

    public void setSkinType(String skinType) {
        this.skinType = skinType;
    }

    public String getConcern() {
        return concern;
    }

    public void setConcern(String concern) {
        this.concern = concern;
    }

    public Integer getSensitivityLevel() {
        return sensitivityLevel;
    }

    public void setSensitivityLevel(Integer sensitivityLevel) {
        this.sensitivityLevel = sensitivityLevel;
    }

    public Boolean getAcneProne() {
        return acneProne;
    }

    public void setAcneProne(Boolean acneProne) {
        this.acneProne = acneProne;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}