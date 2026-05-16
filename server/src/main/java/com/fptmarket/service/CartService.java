package com.fptmarket.service;

import com.fptmarket.dto.request.CartItemRequest;
import com.fptmarket.dto.response.CartResponse;

public interface CartService {
    CartResponse getCart();
    CartResponse addItem(CartItemRequest request);
    CartResponse updateItem(Long itemId, Integer quantity);
    CartResponse removeItem(Long itemId);
    void clearCart();
}
