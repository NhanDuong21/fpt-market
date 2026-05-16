package com.fptmarket.mapper;

import com.fptmarket.dto.request.ProductRequest;
import com.fptmarket.dto.response.ProductResponse;
import com.fptmarket.entity.Product;
import com.fptmarket.entity.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true), uses = {CategoryMapper.class})
public interface ProductMapper {

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
    void updateEntity(ProductRequest request, @MappingTarget Product product);

    default List<String> mapProductImages(List<ProductImage> images) {
        if (images == null) {
            return new ArrayList<>();
        }
        return images.stream()
                     .map(ProductImage::getImageUrl)
                     .collect(Collectors.toList());
    }
}
