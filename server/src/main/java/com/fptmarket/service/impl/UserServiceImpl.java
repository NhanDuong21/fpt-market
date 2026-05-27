package com.fptmarket.service.impl;

import com.fptmarket.common.ErrorCode;
import com.fptmarket.dto.request.ChangePasswordRequest;
import com.fptmarket.dto.request.UpdateProfileRequest;
import com.fptmarket.dto.response.UserProfileResponse;
import com.fptmarket.entity.User;
import com.fptmarket.exception.AppException;
import com.fptmarket.repository.UserRepository;
import com.fptmarket.service.CloudinaryService;
import com.fptmarket.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile() {
        User user = getCurrentUser();
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException("Mật khẩu hiện tại không chính xác", ErrorCode.BAD_REQUEST.getCode());
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException("Mật khẩu mới và xác nhận mật khẩu không khớp", ErrorCode.BAD_REQUEST.getCode());
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserProfileResponse uploadAvatar(MultipartFile avatarFile) {
        User user = getCurrentUser();
        if (avatarFile != null && !avatarFile.isEmpty()) {
            try {
                Map<String, Object> uploadResult = cloudinaryService.uploadImage(avatarFile);
                String url = (String) uploadResult.get("secure_url");
                user.setAvatarUrl(url);
                user = userRepository.save(user);
            } catch (IOException e) {
                log.error("Failed to upload avatar to Cloudinary", e);
                throw new AppException("Failed to upload avatar", ErrorCode.INTERNAL_SERVER_ERROR.getCode());
            }
        }
        return mapToResponse(user);
    }

    private User getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new AppException("Unauthorized", ErrorCode.UNAUTHORIZED.getCode());
        }
        String currentEmail = authentication.getName();
        return userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new AppException("User not found", ErrorCode.NOT_FOUND.getCode()));
    }

    private UserProfileResponse mapToResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
