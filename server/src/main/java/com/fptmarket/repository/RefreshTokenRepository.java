package com.fptmarket.repository;

import com.fptmarket.entity.RefreshToken;
import com.fptmarket.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    int deleteByUser(User user);
    int deleteByToken(String token);
}
