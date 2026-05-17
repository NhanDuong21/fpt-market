'use client';

import React from 'react';
import Link from 'next/link';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import PaymentStatusBadge from '@/components/order/PaymentStatusBadge';

const SellerOrderTable = ({ orders }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-3xl border border-gray-100 shadow-sm">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Mã đơn</th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Khách hàng</th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Ngày đặt</th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Trạng thái</th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Thanh toán</th>
            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Số lượng</th>
            <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Thu nhập</th>
            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                #{order.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {order.fullName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <PaymentStatusBadge method={order.paymentMethod} status={order.paymentStatus} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600 font-semibold">
                {order.totalItems}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-black">
                {order.sellerTotalAmount.toLocaleString()}đ
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                <Link 
                  href={`/seller/orders/${order.id}`}
                  className="inline-block px-4 py-2 border-2 border-gray-100 hover:border-red-600 hover:text-red-600 rounded-xl font-bold transition-all text-xs"
                >
                  Xử lý
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerOrderTable;
