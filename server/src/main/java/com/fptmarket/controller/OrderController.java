package com.fptmarket.controller;

import com.fptmarket.common.ApiResponse;
import com.fptmarket.dto.request.OrderRequest;
import com.fptmarket.dto.response.OrderResponse;
import com.fptmarket.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ApiResponse<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
        return ApiResponse.success(orderService.createOrder(request), "Order created successfully");
    }

    @GetMapping("/my")
    public ApiResponse<Page<OrderResponse>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.success(orderService.getMyOrders(pageable), "Orders fetched successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getOrderById(@PathVariable Long id) {
        return ApiResponse.success(orderService.getOrderById(id), "Order details fetched");
    }

    @PutMapping("/{id}/cancel")
    public ApiResponse<OrderResponse> cancelOrder(@PathVariable Long id) {
        return ApiResponse.success(orderService.cancelOrder(id), "Order cancelled successfully");
    }
}
