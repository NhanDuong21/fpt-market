package com.fptmarket.service;

import com.fptmarket.dto.request.ProductRequest;
import com.fptmarket.dto.request.RejectProductRequest;
import com.fptmarket.dto.response.ProductResponse;
import com.fptmarket.entity.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    Page<ProductResponse> getAllApprovedProducts(
            String keyword, Long categoryId, Double minPrice, Double maxPrice, String condition, Pageable pageable);
    
    ProductResponse getProductBySlug(String slug);
    
    ProductResponse createProduct(ProductRequest request, List<MultipartFile> images);
    
    ProductResponse updateProduct(Long id, ProductRequest request, List<MultipartFile> images);
    
    void deleteProduct(Long id);
    
    Page<ProductResponse> getMyProducts(Pageable pageable);
    
    // Admin methods
    Page<ProductResponse> getAllProductsForAdmin(ProductStatus status, Pageable pageable);
    
    ProductResponse approveProduct(Long id);
    
    ProductResponse rejectProduct(Long id, RejectProductRequest request);
    
    ProductResponse hideProduct(Long id);
}
