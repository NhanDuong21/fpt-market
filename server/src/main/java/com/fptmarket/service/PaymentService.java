package com.fptmarket.service;

import com.fptmarket.dto.response.PaymentResponse;
import com.fptmarket.entity.Order;

import java.util.Map;

public interface PaymentService {
    String createVNPayUrl(Order order, String ipAddress);
    PaymentResponse vnpayCallback(Map<String, String> queryParams);
    PaymentResponse getPaymentByOrderId(Long orderId);
}
