package com.fptmarket.repository;

import com.fptmarket.entity.Order;
import com.fptmarket.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.items i WHERE i.product.user.id = :sellerId ORDER BY o.createdAt DESC")
    Page<Order> findSellerOrders(@Param("sellerId") Long sellerId, Pageable pageable);

    long countByStatus(OrderStatus status);
}
