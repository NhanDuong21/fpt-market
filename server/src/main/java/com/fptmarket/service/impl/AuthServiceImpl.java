package com.fptmarket.service.impl;

import com.fptmarket.common.ErrorCode;
import com.fptmarket.dto.request.LoginRequest;
import com.fptmarket.dto.request.RegisterRequest;
import com.fptmarket.dto.request.TokenRefreshRequest;
import com.fptmarket.dto.response.AuthResponse;
import com.fptmarket.entity.RefreshToken;
import com.fptmarket.entity.Role;
import com.fptmarket.entity.Status;
import com.fptmarket.entity.User;
import com.fptmarket.exception.AppException;
import com.fptmarket.repository.RefreshTokenRepository;
import com.fptmarket.repository.UserRepository;
import com.fptmarket.security.JwtTokenProvider;
import com.fptmarket.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenDurationMs;

    public AuthServiceImpl(UserRepository userRepository, 
                           RefreshTokenRepository refreshTokenRepository, 
                           PasswordEncoder passwordEncoder, 
                           AuthenticationManager authenticationManager, 
                           JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email already in use", ErrorCode.USER_ALREADY_EXISTS.getCode());
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.USER)
                .status(Status.ACTIVE)
                .build();

        userRepository.save(user);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Attempting login for user: {}", request.getEmail());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.error("Authenticated user not found in database: {}", request.getEmail());
                    return new AppException("User not found", ErrorCode.UNAUTHORIZED.getCode());
                });

        if (user.getStatus() == Status.BANNED) {
            throw new AppException("User is banned", ErrorCode.FORBIDDEN.getCode());
        }

        RefreshToken refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .build())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        RefreshToken refreshToken = refreshTokenRepository.findByToken(requestRefreshToken)
                .orElseThrow(() -> new AppException("Refresh token is not in database!", ErrorCode.UNAUTHORIZED.getCode()));

        verifyExpiration(refreshToken);

        User user = refreshToken.getUser();
        String token = jwtTokenProvider.generateTokenFromEmail(user.getEmail());

        return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(refreshToken.getToken())
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .role(user.getRole().name())
                        .build())
                .build();
    }

    @Override
    @Transactional
    public void logout(TokenRefreshRequest request) {
        refreshTokenRepository.deleteByToken(request.getRefreshToken());
        SecurityContextHolder.clearContext();
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenDurationMs))
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    private void verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new AppException("Refresh token was expired. Please make a new signin request", ErrorCode.UNAUTHORIZED.getCode());
        }
    }
}
