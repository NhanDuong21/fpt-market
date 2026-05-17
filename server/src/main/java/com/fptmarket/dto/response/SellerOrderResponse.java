package com.fptmarket.dto.response;

import com.fptmarket.entity.OrderStatus;
import com.fptmarket.entity.PaymentMethod;
import com.fptmarket.entity.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerOrderResponse {
    private Long id;
    private String fullName;
    private String phone;
    private String shippingAddress;
    private BigDecimal sellerTotalAmount;
    private Integer totalItems;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private List<SellerOrderItemResponse> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
