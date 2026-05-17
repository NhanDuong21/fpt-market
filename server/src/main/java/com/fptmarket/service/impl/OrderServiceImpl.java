package com.fptmarket.service.impl;

import com.fptmarket.common.ErrorCode;
import com.fptmarket.dto.request.OrderRequest;
import com.fptmarket.dto.response.OrderResponse;
import com.fptmarket.dto.response.PaymentResponse;
import com.fptmarket.entity.*;
import com.fptmarket.exception.AppException;
import com.fptmarket.mapper.OrderMapper;
import com.fptmarket.repository.*;
import com.fptmarket.service.OrderService;
import com.fptmarket.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;
    private final OrderMapper orderMapper;
    private final HttpServletRequest httpServletRequest;

    public OrderServiceImpl(OrderRepository orderRepository, 
                            CartRepository cartRepository, 
                            ProductRepository productRepository, 
                            UserRepository userRepository,
                            PaymentRepository paymentRepository,
                            PaymentService paymentService,
                            OrderMapper orderMapper,
                            HttpServletRequest httpServletRequest) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.paymentService = paymentService;
        this.orderMapper = orderMapper;
        this.httpServletRequest = httpServletRequest;
    }

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException("Cart not found", ErrorCode.NOT_FOUND.getCode()));

        if (cart.getItems().isEmpty()) {
            throw new AppException("Cart is empty", ErrorCode.BAD_REQUEST.getCode());
        }

        // Validate stock for all items first
        for (CartItem item : cart.getItems()) {
            if (item.getQuantity() > item.getProduct().getQuantity()) {
                throw new AppException("Insufficient stock for product: " + item.getProduct().getName(), ErrorCode.BAD_REQUEST.getCode());
            }
        }

        Order order = Order.builder()
                .user(user)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .shippingAddress(request.getShippingAddress())
                .status(OrderStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(BigDecimal.ZERO)
                .items(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            
            // Deduct stock
            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            // Snapshot pattern
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(product.getName())
                    .price(product.getPrice())
                    .imageUrl(product.getImages().isEmpty() ? null : product.getImages().get(0).getImageUrl())
                    .quantity(cartItem.getQuantity())
                    .subtotal(subtotal)
                    .build();
            
            order.addItem(orderItem);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // Create Payment entity
        Payment payment = Payment.builder()
                .order(savedOrder)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .amount(totalAmount)
                .build();

        String paymentUrl = null;
        if (request.getPaymentMethod() == PaymentMethod.VNPAY) {
            String ipAddress = getClientIp(httpServletRequest);
            paymentUrl = paymentService.createVNPayUrl(savedOrder, ipAddress);
            payment.setPaymentUrl(paymentUrl);
        }

        paymentRepository.save(payment);

        // Clear cart
        cart.clearItems();
        cartRepository.save(cart);

        // TODO: Send Order Confirmation Email
        log.info("Order created successfully: {}", savedOrder.getId());

        OrderResponse response = orderMapper.toResponse(savedOrder);
        response.setPaymentUrl(paymentUrl);
        response.setPaymentDetails(mapPaymentToResponse(payment));
        return response;
    }

    @Override
    public Page<OrderResponse> getMyOrders(Pageable pageable) {
        User user = getCurrentUser();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(order -> {
                    OrderResponse res = orderMapper.toResponse(order);
                    paymentRepository.findByOrderId(order.getId()).ifPresent(p -> {
                        res.setPaymentUrl(p.getPaymentUrl());
                        res.setPaymentDetails(mapPaymentToResponse(p));
                    });
                    return res;
                });
    }

    @Override
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException("Order not found", ErrorCode.NOT_FOUND.getCode()));
        
        User user = getCurrentUser();
        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new AppException("You don't have permission to view this order", ErrorCode.FORBIDDEN.getCode());
        }

        OrderResponse res = orderMapper.toResponse(order);
        paymentRepository.findByOrderId(order.getId()).ifPresent(p -> {
            res.setPaymentUrl(p.getPaymentUrl());
            res.setPaymentDetails(mapPaymentToResponse(p));
        });
        return res;
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException("Order not found", ErrorCode.NOT_FOUND.getCode()));

        User user = getCurrentUser();
        if (!order.getUser().getId().equals(user.getId())) {
            throw new AppException("You don't have permission to cancel this order", ErrorCode.FORBIDDEN.getCode());
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new AppException("Only pending or confirmed orders can be cancelled", ErrorCode.BAD_REQUEST.getCode());
        }

        // Restore stock
        for (OrderItem item : order.getItems()) {
            if (item.getProduct() != null) {
                Product product = item.getProduct();
                product.setQuantity(product.getQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order savedOrder = orderRepository.save(order);

        paymentRepository.findByOrderId(order.getId()).ifPresent(p -> {
            p.setPaymentStatus(PaymentStatus.CANCELLED);
            paymentRepository.save(p);
        });

        // TODO: Send Order Cancellation Email
        log.info("Order cancelled successfully: {}", savedOrder.getId());

        OrderResponse res = orderMapper.toResponse(savedOrder);
        paymentRepository.findByOrderId(order.getId()).ifPresent(p -> {
            res.setPaymentUrl(p.getPaymentUrl());
            res.setPaymentDetails(mapPaymentToResponse(p));
        });
        return res;
    }

    @Override
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(order -> {
            OrderResponse res = orderMapper.toResponse(order);
            paymentRepository.findByOrderId(order.getId()).ifPresent(p -> {
                res.setPaymentUrl(p.getPaymentUrl());
                res.setPaymentDetails(mapPaymentToResponse(p));
            });
            return res;
        });
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", ErrorCode.NOT_FOUND.getCode()));
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    private PaymentResponse mapPaymentToResponse(Payment payment) {
        if (payment == null) return null;
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .amount(payment.getAmount())
                .transactionNo(payment.getTransactionNo())
                .bankCode(payment.getBankCode())
                .paymentUrl(payment.getPaymentUrl())
                .paidAt(payment.getPaidAt())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
