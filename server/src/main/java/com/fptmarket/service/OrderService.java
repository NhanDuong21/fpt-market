package com.fptmarket.service;

import com.fptmarket.dto.request.OrderRequest;
import com.fptmarket.dto.response.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    Page<OrderResponse> getMyOrders(Pageable pageable);
    OrderResponse getOrderById(Long id);
    OrderResponse cancelOrder(Long id);
    Page<OrderResponse> getAllOrders(Pageable pageable);
}
