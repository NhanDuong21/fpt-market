package com.fptmarket.controller;

import com.fptmarket.common.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthCheckController {

    @GetMapping
    public ApiResponse<Void> healthCheck() {
        return ApiResponse.success(null, "FPT-Market Backend is up and running");
    }
}
