package com.fptmarket.mapper;

import com.fptmarket.dto.request.ProductRequest;
import com.fptmarket.dto.response.ProductResponse;
import com.fptmarket.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true), uses = {CategoryMapper.class})
public interface ProductMapper {

    @Mapping(target = "user.id", source = "user.id")
    @Mapping(target = "user.fullName", source = "user.fullName")
    @Mapping(target = "user.email", source = "user.email")
    @Mapping(target = "images", expression = "java(mapProductImages(product.getImages()))")
    ProductResponse toResponse(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "rejectReason", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Product toEntity(ProductRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "rejectReason", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(ProductRequest request, @MappingTarget Product product);

    default java.util.List<String> mapProductImages(java.util.List<com.fptmarket.entity.ProductImage> images) {
        if (images == null) return new java.util.ArrayList<>();
        return images.stream()
                     .map(com.fptmarket.entity.ProductImage::getImageUrl)
                     .collect(java.util.stream.Collectors.toList());
    }
}
