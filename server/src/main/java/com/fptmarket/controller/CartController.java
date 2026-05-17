package com.fptmarket.controller;

import com.fptmarket.common.ApiResponse;
import com.fptmarket.dto.request.CartItemRequest;
import com.fptmarket.dto.response.CartResponse;
import com.fptmarket.service.CartService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ApiResponse<CartResponse> getCart() {
        return ApiResponse.success(cartService.getCart(), "Cart fetched successfully");
    }

    @PostMapping("/items")
    public ApiResponse<CartResponse> addItem(@Valid @RequestBody CartItemRequest request) {
        return ApiResponse.success(cartService.addItem(request), "Item added to cart");
    }

    @PutMapping("/items/{id}")
    public ApiResponse<CartResponse> updateItem(@PathVariable Long id, @RequestParam Integer quantity) {
        return ApiResponse.success(cartService.updateItem(id, quantity), "Cart updated");
    }

    @DeleteMapping("/items/{id}")
    public ApiResponse<CartResponse> removeItem(@PathVariable Long id) {
        return ApiResponse.success(cartService.removeItem(id), "Item removed from cart");
    }

    @DeleteMapping("/clear")
    public ApiResponse<Void> clearCart() {
        cartService.clearCart();
        return ApiResponse.success(null, "Cart cleared");
    }
}
