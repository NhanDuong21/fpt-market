package com.fptmarket.service.impl;

import com.fptmarket.common.ErrorCode;
import com.fptmarket.dto.request.CartItemRequest;
import com.fptmarket.dto.response.CartResponse;
import com.fptmarket.entity.*;
import com.fptmarket.exception.AppException;
import com.fptmarket.mapper.CartMapper;
import com.fptmarket.repository.CartItemRepository;
import com.fptmarket.repository.CartRepository;
import com.fptmarket.repository.ProductRepository;
import com.fptmarket.repository.UserRepository;
import com.fptmarket.service.CartService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    public CartServiceImpl(CartRepository cartRepository, 
                           CartItemRepository cartItemRepository, 
                           ProductRepository productRepository, 
                           UserRepository userRepository, 
                           CartMapper cartMapper) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.cartMapper = cartMapper;
    }

    @Override
    @Transactional
    public CartResponse getCart() {
        return cartMapper.toResponse(getOrCreateCart());
    }

    @Override
    @Transactional
    public CartResponse addItem(CartItemRequest request) {
        Cart cart = getOrCreateCart();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new AppException("Product not found", ErrorCode.NOT_FOUND.getCode()));

        if (product.getStatus() != ProductStatus.APPROVED) {
            throw new AppException("Product is not available for purchase", ErrorCode.BAD_REQUEST.getCode());
        }

        if (product.getUser().getId().equals(cart.getUser().getId())) {
            throw new AppException("You cannot add your own product to cart", ErrorCode.BAD_REQUEST.getCode());
        }

        if (request.getQuantity() > product.getQuantity()) {
            throw new AppException("Insufficient stock. Available: " + product.getQuantity(), ErrorCode.BAD_REQUEST.getCode());
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            if (newQuantity > product.getQuantity()) {
                throw new AppException("Insufficient stock for total quantity", ErrorCode.BAD_REQUEST.getCode());
            }
            item.setQuantity(newQuantity);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.addItem(newItem);
        }

        return cartMapper.toResponse(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponse updateItem(Long itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new AppException("Item not found in cart", ErrorCode.NOT_FOUND.getCode()));

        if (quantity > item.getProduct().getQuantity()) {
            throw new AppException("Insufficient stock", ErrorCode.BAD_REQUEST.getCode());
        }

        item.setQuantity(quantity);
        return cartMapper.toResponse(cartRepository.save(item.getCart()));
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new AppException("Item not found in cart", ErrorCode.NOT_FOUND.getCode()));
        
        Cart cart = item.getCart();
        cart.removeItem(item);
        return cartMapper.toResponse(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public void clearCart() {
        Cart cart = getOrCreateCart();
        cart.clearItems();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", ErrorCode.NOT_FOUND.getCode()));

        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }
}
