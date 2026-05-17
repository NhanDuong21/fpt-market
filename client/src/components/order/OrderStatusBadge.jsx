import React from 'react';
import { 
  getOrderStatusLabel, 
  getOrderStatusBadgeClass,
  getPaymentStatusLabel,
  getPaymentStatusBadgeClass 
} from '@/utils/orderStatus';

const OrderStatusBadge = ({ status, type = 'order' }) => {
  const label = type === 'payment' ? getPaymentStatusLabel(status) : getOrderStatusLabel(status);
  const badgeClass = type === 'payment' ? getPaymentStatusBadgeClass(status) : getOrderStatusBadgeClass(status);

  return (
    <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full border ${badgeClass}`}>
      {label}
    </span>
  );
};

export default OrderStatusBadge;
