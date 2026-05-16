package com.fptmarket.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fptmarket.service.CloudinaryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@Slf4j
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryServiceImpl(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        
        if ("placeholder".equals(cloudName) || "placeholder".equals(apiKey) || "placeholder".equals(apiSecret)) {
            log.warn("Cloudinary credentials are not configured. Using placeholder mode.");
            this.cloudinary = null;
        } else {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret));
        }
    }

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        if (cloudinary == null) {
            log.info("Placeholder mode: returning dummy image URL for {}", file.getOriginalFilename());
            return "https://via.placeholder.com/800x600?text=" + file.getOriginalFilename();
        }
        
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            log.error("Failed to upload file to Cloudinary", e);
            throw e;
        }
    }
}
