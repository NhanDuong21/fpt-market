package com.fptmarket.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {
    private long totalUsers;
    private long totalCategories;
    private long totalProducts;
    private long pendingProducts;
    private long approvedProducts;
    private long totalOrders;
    private long pendingOrders;
    private long completedOrders;
    private long totalRevenue;
}
