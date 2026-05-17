'use client';

import React from 'react';
import { getPaymentStatusLabel, getPaymentStatusBadgeClass } from '@/utils/paymentStatus';

const PaymentStatusBadge = ({ method, status }) => {
  const label = getPaymentStatusLabel(method, status);
  const badgeClass = getPaymentStatusBadgeClass(method, status);

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
      {label}
    </span>
  );
};

export default PaymentStatusBadge;
