package com.fptmarket.controller;

import com.fptmarket.common.ApiResponse;
import com.fptmarket.dto.response.PaymentResponse;
import com.fptmarket.service.PaymentService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/v1/payments", "/api/payments"})
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping("/vnpay/callback")
    public ApiResponse<PaymentResponse> vnpayCallback(@RequestParam Map<String, String> queryParams) {
        PaymentResponse response = paymentService.vnpayCallback(queryParams);
        return ApiResponse.success(response, "Thanh toán được xử lý thành công");
    }

    @GetMapping("/order/{orderId}")
    public ApiResponse<PaymentResponse> getPaymentByOrderId(@PathVariable Long orderId) {
        PaymentResponse response = paymentService.getPaymentByOrderId(orderId);
        return ApiResponse.success(response, "Lấy thông tin thanh toán thành công");
    }
}
