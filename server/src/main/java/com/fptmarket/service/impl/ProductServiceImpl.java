package com.fptmarket.service.impl;

import com.fptmarket.dto.request.ProductRequest;
import com.fptmarket.dto.request.RejectProductRequest;
import com.fptmarket.dto.response.ProductResponse;
import com.fptmarket.entity.*;
import com.fptmarket.exception.AppException;
import com.fptmarket.common.ErrorCode;
import com.fptmarket.mapper.ProductMapper;
import com.fptmarket.repository.CategoryRepository;
import com.fptmarket.repository.ProductImageRepository;
import com.fptmarket.repository.ProductRepository;
import com.fptmarket.repository.UserRepository;
import com.fptmarket.repository.specification.ProductSpecification;
import com.fptmarket.service.CloudinaryService;
import com.fptmarket.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductMapper productMapper;
    private final CloudinaryService cloudinaryService;

    @Override
    public Page<ProductResponse> getAllApprovedProducts(
            String keyword, Long categoryId, Double minPrice, Double maxPrice, String condition, Pageable pageable) {
        
        Specification<Product> spec = Specification.where(ProductSpecification.hasStatus(ProductStatus.APPROVED))
                .and(ProductSpecification.hasKeyword(keyword))
                .and(ProductSpecification.hasCategory(categoryId))
                .and(ProductSpecification.hasPriceBetween(minPrice, maxPrice))
                .and(ProductSpecification.hasCondition(condition));

        return productRepository.findAll(spec, pageable).map(productMapper::toResponse);
    }

    @Override
    public ProductResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException("Product not found", ErrorCode.NOT_FOUND.getCode()));
        return productMapper.toResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request, List<MultipartFile> images) {
        User currentUser = getCurrentUser();
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException("Category not found", ErrorCode.NOT_FOUND.getCode()));

        Product product = productMapper.toEntity(request);
        product.setSlug(generateSlug(request.getName()));
        product.setStatus(ProductStatus.PENDING);
        product.setCategory(category);
        product.setUser(currentUser);

        if (images != null && !images.isEmpty()) {
            for (MultipartFile file : images) {
                try {
                    String url = cloudinaryService.uploadFile(file);
                    ProductImage image = ProductImage.builder()
                            .imageUrl(url)
                            .product(product)
                            .build();
                    product.addImage(image);
                } catch (IOException e) {
                    log.error("Failed to upload image during product creation", e);
                }
            }
        }

        return productMapper.toResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request, List<MultipartFile> images) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product not found", ErrorCode.NOT_FOUND.getCode()));

        User currentUser = getCurrentUser();
        if (!product.getUser().getId().equals(currentUser.getId())) {
            throw new AppException("You are not allowed to update this product", ErrorCode.FORBIDDEN.getCode());
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException("Category not found", ErrorCode.NOT_FOUND.getCode()));

        productMapper.updateEntity(request, product);
        product.setCategory(category);
        product.setSlug(generateSlug(request.getName()));
        product.setStatus(ProductStatus.PENDING); // Reset to PENDING after edit

        if (images != null && !images.isEmpty()) {
            // Option: clear old images or just add new ones? 
            // Requirements say "handle multiple file selections". Usually we add new ones.
            for (MultipartFile file : images) {
                try {
                    String url = cloudinaryService.uploadFile(file);
                    ProductImage image = ProductImage.builder()
                            .imageUrl(url)
                            .product(product)
                            .build();
                    product.addImage(image);
                } catch (IOException e) {
                    log.error("Failed to upload image during product update", e);
                }
            }
        }

        return productMapper.toResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product not found", ErrorCode.NOT_FOUND.getCode()));

        User currentUser = getCurrentUser();
        if (!product.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new AppException("You are not allowed to delete this product", ErrorCode.FORBIDDEN.getCode());
        }

        productRepository.delete(product);
    }

    @Override
    public Page<ProductResponse> getMyProducts(Pageable pageable) {
        User currentUser = getCurrentUser();
        return productRepository.findByUserId(currentUser.getId(), pageable).map(productMapper::toResponse);
    }

    @Override
    public Page<ProductResponse> getAllProductsForAdmin(ProductStatus status, Pageable pageable) {
        if (status != null) {
            return productRepository.findByStatus(status, pageable).map(productMapper::toResponse);
        }
        return productRepository.findAll(pageable).map(productMapper::toResponse);
    }

    @Override
    @Transactional
    public ProductResponse approveProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product not found", ErrorCode.NOT_FOUND.getCode()));
        
        product.setStatus(ProductStatus.APPROVED);
        product.setRejectReason(null);
        
        // TODO: Send email notification
        log.info("Product approved: {}", product.getId());
        
        return productMapper.toResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponse rejectProduct(Long id, RejectProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product not found", ErrorCode.NOT_FOUND.getCode()));
        
        product.setStatus(ProductStatus.REJECTED);
        product.setRejectReason(request.getRejectReason());
        
        // TODO: Send email notification
        log.info("Product rejected: {} for reason: {}", product.getId(), request.getRejectReason());
        
        return productMapper.toResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponse hideProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException("Product not found", ErrorCode.NOT_FOUND.getCode()));
        
        product.setStatus(ProductStatus.HIDDEN);
        
        return productMapper.toResponse(productRepository.save(product));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", ErrorCode.NOT_FOUND.getCode()));
    }

    private String generateSlug(String name) {
        String slug = name.toLowerCase().replaceAll("[^a-z0-9\\s]", "").replaceAll("\\s+", "-");
        String finalSlug = slug;
        int count = 1;
        while (productRepository.existsBySlug(finalSlug)) {
            finalSlug = slug + "-" + count++;
        }
        return finalSlug;
    }
}
