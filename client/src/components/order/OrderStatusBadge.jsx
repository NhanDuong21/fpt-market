import React from 'react';

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING: { label: 'Chờ xác nhận', color: 'bg-orange-100 text-orange-600 border-orange-200' },
    CONFIRMED: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-600 border-blue-200' },
    SHIPPING: { label: 'Đang giao hàng', color: 'bg-purple-100 text-purple-600 border-purple-200' },
    COMPLETED: { label: 'Đã hoàn thành', color: 'bg-green-100 text-green-600 border-green-200' },
    CANCELLED: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-400 border-gray-200' },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full border ${config.color}`}>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
