package com.fptmarket.dto.response;

import com.fptmarket.entity.ConditionType;
import com.fptmarket.entity.ProductStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private ConditionType conditionType;
    private ProductStatus status;
    private String rejectReason;
    private CategoryResponse category;
    private UserSummary user;
    private List<String> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class UserSummary {
        private Long id;
        private String fullName;
        private String email;
    }
}
