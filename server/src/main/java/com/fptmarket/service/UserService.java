package com.fptmarket.service;

import com.fptmarket.dto.request.ChangePasswordRequest;
import com.fptmarket.dto.request.UpdateProfileRequest;
import com.fptmarket.dto.response.UserProfileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    UserProfileResponse getProfile();
    UserProfileResponse updateProfile(UpdateProfileRequest request);
    void changePassword(ChangePasswordRequest request);
    UserProfileResponse uploadAvatar(MultipartFile avatarFile);
}
