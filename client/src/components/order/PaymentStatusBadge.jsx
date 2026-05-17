'use client';

import React from 'react';
import { getPaymentStatusLabel, getPaymentStatusBadgeClass } from '@/utils/paymentStatus';

const PaymentStatusBadge = ({ method, status }) => {
  if (method === 'COD') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
        Thanh toán khi nhận hàng
      </span>
    );
  }

  const label = getPaymentStatusLabel(status);
  const badgeClass = getPaymentStatusBadgeClass(status);

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
      {label}
    </span>
  );
};

export default PaymentStatusBadge;
