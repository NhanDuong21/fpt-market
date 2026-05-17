/*
 * SQL MIGRATION NOTE:
 * Run the following commands in MySQL Workbench if encountering "Data truncated" errors:
 * ALTER TABLE orders MODIFY COLUMN payment_method VARCHAR(20) NOT NULL;
 * ALTER TABLE payments MODIFY COLUMN payment_method VARCHAR(20) NOT NULL;
 * ALTER TABLE payments MODIFY COLUMN payment_status VARCHAR(20) NOT NULL;
 * ALTER TABLE orders MODIFY COLUMN status VARCHAR(20) NOT NULL;
 */
package com.fptmarket.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 20, nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 20, nullable = false)
    private PaymentStatus paymentStatus;

    @Column(nullable = false)
    private BigDecimal amount;

    private String transactionNo;

    private String bankCode;

    @Column(length = 1000)
    private String paymentUrl;

    private LocalDateTime paidAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
