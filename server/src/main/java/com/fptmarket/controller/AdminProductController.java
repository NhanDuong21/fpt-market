package com.fptmarket.controller;

import com.fptmarket.common.ApiResponse;
import com.fptmarket.dto.request.RejectProductRequest;
import com.fptmarket.dto.response.ProductResponse;
import com.fptmarket.entity.ProductStatus;
import com.fptmarket.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ApiResponse<Page<ProductResponse>> getAllProducts(
            @RequestParam(required = false) ProductStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ApiResponse.success(productService.getAllProductsForAdmin(status, pageable), "All products fetched successfully");
    }

    @PutMapping("/{id}/approve")
    public ApiResponse<ProductResponse> approveProduct(@PathVariable Long id) {
        return ApiResponse.success(productService.approveProduct(id), "Product approved successfully");
    }

    @PutMapping("/{id}/reject")
    public ApiResponse<ProductResponse> rejectProduct(@PathVariable Long id, @Valid @RequestBody RejectProductRequest request) {
        return ApiResponse.success(productService.rejectProduct(id, request), "Product rejected successfully");
    }

    @PutMapping("/{id}/hide")
    public ApiResponse<ProductResponse> hideProduct(@PathVariable Long id) {
        return ApiResponse.success(productService.hideProduct(id), "Product hidden successfully");
    }
}
