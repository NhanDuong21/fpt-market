package com.fptmarket.mapper;

import com.fptmarket.dto.response.OrderItemResponse;
import com.fptmarket.dto.response.OrderResponse;
import com.fptmarket.entity.Order;
import com.fptmarket.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", builder = @org.mapstruct.Builder(disableBuilder = true))
public interface OrderMapper {

    OrderResponse toResponse(Order order);

    @Mapping(target = "productId", source = "product.id")
    OrderItemResponse toItemResponse(OrderItem item);
}
