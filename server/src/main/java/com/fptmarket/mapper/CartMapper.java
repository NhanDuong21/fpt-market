package com.fptmarket.mapper;

import com.fptmarket.dto.response.CartItemResponse;
import com.fptmarket.dto.response.CartResponse;
import com.fptmarket.entity.Cart;
import com.fptmarket.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface CartMapper {

    @Mapping(target = "totalAmount", expression = "java(calculateTotal(cart))")
    @Mapping(target = "totalItems", expression = "java(calculateTotalItems(cart))")
    CartResponse toResponse(Cart cart);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "productSlug", source = "product.slug")
    @Mapping(target = "productImageUrl", expression = "java(getFirstImageUrl(item))")
    @Mapping(target = "price", source = "product.price")
    @Mapping(target = "stockQuantity", source = "product.quantity")
    @Mapping(target = "subtotal", expression = "java(calculateSubtotal(item))")
    CartItemResponse toItemResponse(CartItem item);

    default BigDecimal calculateTotal(Cart cart) {
        if (cart == null || cart.getItems() == null) return BigDecimal.ZERO;
        return cart.getItems().stream()
                .map(this::calculateSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    default Integer calculateTotalItems(Cart cart) {
        if (cart == null || cart.getItems() == null) return 0;
        return cart.getItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }

    default BigDecimal calculateSubtotal(CartItem item) {
        if (item == null || item.getProduct() == null) return BigDecimal.ZERO;
        return item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
    }

    default String getFirstImageUrl(CartItem item) {
        if (item == null || item.getProduct() == null || item.getProduct().getImages() == null || item.getProduct().getImages().isEmpty()) {
            return null;
        }
        return item.getProduct().getImages().get(0).getImageUrl();
    }
}
