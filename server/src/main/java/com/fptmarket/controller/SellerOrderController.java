package com.fptmarket.controller;

import com.fptmarket.common.ApiResponse;
import com.fptmarket.dto.response.SellerOrderResponse;
import com.fptmarket.service.SellerOrderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seller/orders")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class SellerOrderController {

    private final SellerOrderService sellerOrderService;

    public SellerOrderController(SellerOrderService sellerOrderService) {
        this.sellerOrderService = sellerOrderService;
    }

    @GetMapping
    public ApiResponse<Page<SellerOrderResponse>> getSellerOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.success(sellerOrderService.getSellerOrders(pageable), "Seller orders fetched successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<SellerOrderResponse> getSellerOrderById(@PathVariable Long id) {
        return ApiResponse.success(sellerOrderService.getSellerOrderById(id), "Seller order details fetched");
    }

    @PutMapping("/{id}/confirm")
    public ApiResponse<SellerOrderResponse> confirmOrder(@PathVariable Long id) {
        return ApiResponse.success(sellerOrderService.confirmOrder(id), "Order confirmed successfully");
    }

    @PutMapping("/{id}/ship")
    public ApiResponse<SellerOrderResponse> shipOrder(@PathVariable Long id) {
        return ApiResponse.success(sellerOrderService.shipOrder(id), "Order is now shipping");
    }

    @PutMapping("/{id}/complete")
    public ApiResponse<SellerOrderResponse> completeOrder(@PathVariable Long id) {
        return ApiResponse.success(sellerOrderService.completeOrder(id), "Order completed successfully");
    }
}
