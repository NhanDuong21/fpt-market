package com.fptmarket.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectProductRequest {
    @NotBlank(message = "Reject reason is required")
    private String rejectReason;
}
