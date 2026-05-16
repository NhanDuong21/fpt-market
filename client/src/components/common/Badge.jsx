import React from 'react';

const Badge = ({ status, className = '' }) => {
  const statusConfig = {
    // Product Statuses
    PENDING: { label: 'Chờ duyệt', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
    APPROVED: { label: 'Đang bán', color: 'bg-green-50 text-green-600 border-green-100' },
    REJECTED: { label: 'Từ chối', color: 'bg-red-50 text-red-600 border-red-100' },
    SOLD: { label: 'Đã bán', color: 'bg-gray-100 text-gray-500 border-gray-200' },
    HIDDEN: { label: 'Đã ẩn', color: 'bg-gray-50 text-gray-400 border-gray-100' },
    
    // Order Statuses
    CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    SHIPPING: { label: 'Đang giao', color: 'bg-purple-50 text-purple-600 border-purple-100' },
    COMPLETED: { label: 'Hoàn thành', color: 'bg-green-50 text-green-600 border-green-100' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-red-50 text-red-600 border-red-100' },
  };

  const config = statusConfig[status] || { label: status, color: 'bg-gray-50 text-gray-600 border-gray-100' };

  return (
    <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full border-2 ${config.color} ${className}`}>
      {config.label}
    </span>
  );
};

export default Badge;
