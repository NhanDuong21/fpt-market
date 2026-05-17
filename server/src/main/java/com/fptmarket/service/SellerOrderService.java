package com.fptmarket.service;

import com.fptmarket.dto.response.SellerOrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SellerOrderService {
    Page<SellerOrderResponse> getSellerOrders(Pageable pageable);
    SellerOrderResponse getSellerOrderById(Long orderId);
    SellerOrderResponse confirmOrder(Long orderId);
    SellerOrderResponse shipOrder(Long orderId);
    SellerOrderResponse completeOrder(Long orderId);
}
