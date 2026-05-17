'use client';

import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import OrderStatusBadge from './OrderStatusBadge';
import PaymentStatusBadge from './PaymentStatusBadge';
import { getPaymentMethodLabel } from '@/utils/paymentStatus';

const OrderCard = ({ order }) => {
  const firstItem = order.items?.[0];
  const itemCount = order.items?.length || 0;

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all mb-4">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-400 font-bold uppercase tracking-widest">
          Đơn hàng #{order.id}
        </div>
        <div className="flex gap-2 flex-wrap">
          <PaymentStatusBadge method={order.paymentMethod} status={order.paymentDetails?.paymentStatus} />
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
          <SafeImage src={firstItem?.imageUrl} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-gray-900 line-clamp-1">{firstItem?.productName}</div>
          <div className="text-sm text-gray-500 mt-1">
            {itemCount > 1 ? `và ${itemCount - 1} sản phẩm khác` : `Số lượng: ${firstItem?.quantity}`}
          </div>
          <div className="text-lg font-black text-red-600 mt-1">{order.totalAmount.toLocaleString()}đ</div>
          <div className="text-xs text-gray-400 mt-1 font-semibold">
            Phương thức: <span className="text-gray-600 font-black">{getPaymentMethodLabel(order.paymentMethod)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-gray-50">
        <div className="text-xs text-gray-400 font-medium">
          Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
        </div>
        <Link 
          href={`/my-orders/${order.id}`}
          className="px-6 py-2 border-2 border-gray-100 text-gray-900 font-bold rounded-xl hover:border-red-600 hover:text-red-600 transition-all text-sm"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
