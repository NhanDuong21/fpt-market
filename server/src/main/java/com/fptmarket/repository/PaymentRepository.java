package com.fptmarket.repository;

import com.fptmarket.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(Long orderId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentStatus = com.fptmarket.entity.PaymentStatus.PAID")
    BigDecimal sumRevenueByStatusPaid();
}
