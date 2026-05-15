package com.fptmarket.service;

import com.fptmarket.dto.request.LoginRequest;
import com.fptmarket.dto.request.RegisterRequest;
import com.fptmarket.dto.request.TokenRefreshRequest;
import com.fptmarket.dto.response.AuthResponse;

public interface AuthService {
    void register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(TokenRefreshRequest request);
    void logout(TokenRefreshRequest request);
}
