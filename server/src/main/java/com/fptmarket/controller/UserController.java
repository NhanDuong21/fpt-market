package com.fptmarket.controller;

import com.fptmarket.common.ApiResponse;
import com.fptmarket.dto.request.ChangePasswordRequest;
import com.fptmarket.dto.request.UpdateProfileRequest;
import com.fptmarket.dto.response.UserProfileResponse;
import com.fptmarket.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ApiResponse<UserProfileResponse> getProfile() {
        UserProfileResponse profile = userService.getProfile();
        return ApiResponse.success(profile, "User profile fetched successfully");
    }

    @PutMapping
    public ApiResponse<UserProfileResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        UserProfileResponse profile = userService.updateProfile(request);
        return ApiResponse.success(profile, "User profile updated successfully");
    }

    @PutMapping("/change-password")
    public ApiResponse<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
        return ApiResponse.success(null, "Password changed successfully");
    }

    @PutMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<UserProfileResponse> uploadAvatar(@RequestParam("avatar") MultipartFile file) {
        UserProfileResponse profile = userService.uploadAvatar(file);
        return ApiResponse.success(profile, "Avatar uploaded successfully");
    }
}
