package com.fptmarket.service.impl;

import com.fptmarket.dto.response.AdminDashboardResponse;
import com.fptmarket.entity.OrderStatus;
import com.fptmarket.entity.ProductStatus;
import com.fptmarket.repository.*;
import com.fptmarket.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public AdminDashboardResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalCategories = categoryRepository.count();
        long totalProducts = productRepository.count();
        long pendingProducts = productRepository.countByStatus(ProductStatus.PENDING);
        long approvedProducts = productRepository.countByStatus(ProductStatus.APPROVED);
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long completedOrders = orderRepository.countByStatus(OrderStatus.COMPLETED);

        BigDecimal revenue = paymentRepository.sumRevenueByStatusPaid();
        long totalRevenue = revenue != null ? revenue.longValue() : 0L;

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalCategories(totalCategories)
                .totalProducts(totalProducts)
                .pendingProducts(pendingProducts)
                .approvedProducts(approvedProducts)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .completedOrders(completedOrders)
                .totalRevenue(totalRevenue)
                .build();
    }
}
