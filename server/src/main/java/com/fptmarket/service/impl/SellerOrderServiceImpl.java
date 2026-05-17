package com.fptmarket.service.impl;

import com.fptmarket.common.ErrorCode;
import com.fptmarket.dto.response.SellerOrderItemResponse;
import com.fptmarket.dto.response.SellerOrderResponse;
import com.fptmarket.entity.*;
import com.fptmarket.exception.AppException;
import com.fptmarket.repository.OrderRepository;
import com.fptmarket.repository.UserRepository;
import com.fptmarket.service.SellerOrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SellerOrderServiceImpl implements SellerOrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final com.fptmarket.repository.PaymentRepository paymentRepository;

    public SellerOrderServiceImpl(OrderRepository orderRepository, UserRepository userRepository, com.fptmarket.repository.PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Page<SellerOrderResponse> getSellerOrders(Pageable pageable) {
        User currentUser = getCurrentUser();
        Page<Order> orders = orderRepository.findSellerOrders(currentUser.getId(), pageable);
        return orders.map(order -> mapToSellerOrderResponse(order, currentUser.getId()));
    }

    @Override
    public SellerOrderResponse getSellerOrderById(Long orderId) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException("Order not found", ErrorCode.NOT_FOUND.getCode()));
        
        return mapToSellerOrderResponse(order, currentUser.getId());
    }

    @Override
    @Transactional
    public SellerOrderResponse confirmOrder(Long orderId) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException("Order not found", ErrorCode.NOT_FOUND.getCode()));

        validateSellerOwnership(order, currentUser.getId());

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new AppException("Order must be PENDING to confirm", ErrorCode.BAD_REQUEST.getCode());
        }

        order.setStatus(OrderStatus.CONFIRMED);
        Order savedOrder = orderRepository.save(order);

        // TODO: Send Email confirming order to buyer
        log.info("Seller {} confirmed Order ID: {}", currentUser.getEmail(), orderId);

        return mapToSellerOrderResponse(savedOrder, currentUser.getId());
    }

    @Override
    @Transactional
    public SellerOrderResponse shipOrder(Long orderId) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException("Order not found", ErrorCode.NOT_FOUND.getCode()));

        validateSellerOwnership(order, currentUser.getId());

        if (order.getStatus() != OrderStatus.CONFIRMED) {
            throw new AppException("Order must be CONFIRMED to start shipping", ErrorCode.BAD_REQUEST.getCode());
        }

        order.setStatus(OrderStatus.SHIPPING);
        Order savedOrder = orderRepository.save(order);

        // TODO: Send Email notifying shipping to buyer
        log.info("Seller {} started shipping Order ID: {}", currentUser.getEmail(), orderId);

        return mapToSellerOrderResponse(savedOrder, currentUser.getId());
    }

    @Override
    @Transactional
    public SellerOrderResponse completeOrder(Long orderId) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException("Order not found", ErrorCode.NOT_FOUND.getCode()));

        validateSellerOwnership(order, currentUser.getId());

        if (order.getStatus() != OrderStatus.SHIPPING) {
            throw new AppException("Order must be SHIPPING to complete", ErrorCode.BAD_REQUEST.getCode());
        }

        order.setStatus(OrderStatus.COMPLETED);
        
        // Update product status to SOLD if completed (optional business rule)
        for (OrderItem item : order.getItems()) {
            if (item.getProduct() != null && item.getProduct().getUser().getId().equals(currentUser.getId())) {
                Product product = item.getProduct();
                if (product.getQuantity() <= 0) {
                    product.setStatus(ProductStatus.SOLD);
                }
            }
        }

        Order savedOrder = orderRepository.save(order);

        // TODO: Send Email notifying completion to buyer
        log.info("Seller {} completed Order ID: {}", currentUser.getEmail(), orderId);

        return mapToSellerOrderResponse(savedOrder, currentUser.getId());
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", ErrorCode.NOT_FOUND.getCode()));
    }

    private void validateSellerOwnership(Order order, Long sellerId) {
        boolean hasOwnership = order.getItems().stream()
                .anyMatch(item -> item.getProduct() != null && item.getProduct().getUser().getId().equals(sellerId));
        if (!hasOwnership) {
            throw new AppException("You do not have permission to access this order", ErrorCode.FORBIDDEN.getCode());
        }
    }

    private SellerOrderResponse mapToSellerOrderResponse(Order order, Long sellerId) {
        List<OrderItem> sellerItems = order.getItems().stream()
                .filter(item -> item.getProduct() != null && item.getProduct().getUser().getId().equals(sellerId))
                .collect(Collectors.toList());

        if (sellerItems.isEmpty()) {
            throw new AppException("You do not have permission to view this order", ErrorCode.FORBIDDEN.getCode());
        }

        BigDecimal sellerTotalAmount = sellerItems.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = sellerItems.stream()
                .mapToInt(OrderItem::getQuantity)
                .sum();

        List<SellerOrderItemResponse> itemResponses = sellerItems.stream()
                .map(item -> SellerOrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                        .productName(item.getProductName())
                        .price(item.getPrice())
                        .imageUrl(item.getImageUrl())
                        .quantity(item.getQuantity())
                        .subtotal(item.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        PaymentStatus paymentStatus = paymentRepository.findByOrderId(order.getId())
                .map(Payment::getPaymentStatus)
                .orElse(PaymentStatus.PENDING);

        return SellerOrderResponse.builder()
                .id(order.getId())
                .fullName(order.getFullName())
                .phone(order.getPhone())
                .shippingAddress(order.getShippingAddress())
                .sellerTotalAmount(sellerTotalAmount)
                .totalItems(totalItems)
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(paymentStatus)
                .items(itemResponses)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
