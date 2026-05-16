package com.fptmarket.service.impl;

import com.fptmarket.dto.request.CategoryRequest;
import com.fptmarket.dto.response.CategoryResponse;
import com.fptmarket.entity.Category;
import com.fptmarket.exception.AppException;
import com.fptmarket.common.ErrorCode;
import com.fptmarket.mapper.CategoryMapper;
import com.fptmarket.repository.CategoryRepository;
import com.fptmarket.service.CategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException("Category not found", ErrorCode.NOT_FOUND.getCode()));
        return categoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new AppException("Category name already exists", ErrorCode.BAD_REQUEST.getCode());
        }

        Category category = categoryMapper.toEntity(request);
        category.setSlug(generateSlug(request.getName()));
        
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException("Category not found", ErrorCode.NOT_FOUND.getCode()));

        if (!category.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new AppException("Category name already exists", ErrorCode.BAD_REQUEST.getCode());
        }

        categoryMapper.updateEntity(request, category);
        category.setSlug(generateSlug(request.getName()));

        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new AppException("Category not found", ErrorCode.NOT_FOUND.getCode());
        }
        // TODO: Check if category has products
        categoryRepository.deleteById(id);
    }

    private String generateSlug(String name) {
        return name.toLowerCase().replaceAll("[^a-z0-9\\s]", "").replaceAll("\\s+", "-");
    }
}
