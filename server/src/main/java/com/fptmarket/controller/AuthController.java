package com.fptmarket.controller;

import com.fptmarket.common.ApiResponse;
import com.fptmarket.dto.request.LoginRequest;
import com.fptmarket.dto.request.RegisterRequest;
import com.fptmarket.dto.request.TokenRefreshRequest;
import com.fptmarket.dto.response.AuthResponse;
import com.fptmarket.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<Void> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ApiResponse.success(null, "Registered successfully");
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ApiResponse.success(response, "Login successful");
    }

    @PostMapping("/refresh-token")
    public ApiResponse<AuthResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ApiResponse.success(response, "Token refreshed");
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@Valid @RequestBody TokenRefreshRequest request) {
        authService.logout(request);
        return ApiResponse.success(null, "Logged out");
    }
}
