package com.fptmarket.repository;

import com.fptmarket.entity.Product;
import com.fptmarket.entity.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySlug(String slug);
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);
    Page<Product> findByUserId(Long userId, Pageable pageable);
    boolean existsBySlug(String slug);
    long countByStatus(ProductStatus status);
}
