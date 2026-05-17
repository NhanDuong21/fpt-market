import React from 'react';
import { getOrderStatusLabel, getOrderStatusBadgeClass } from '@/utils/orderStatus';

const OrderStatusBadge = ({ status }) => {
  const label = getOrderStatusLabel(status);
  const badgeClass = getOrderStatusBadgeClass(status);

  return (
    <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full border ${badgeClass}`}>
      {label}
    </span>
  );
};

export default OrderStatusBadge;
