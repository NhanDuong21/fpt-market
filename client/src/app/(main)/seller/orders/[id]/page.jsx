'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import sellerOrderService from '@/services/sellerOrderService';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import SellerOrderActionButtons from '@/components/seller/SellerOrderActionButtons';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';

export default function SellerOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sellerOrderService.getSellerOrderById(id);
      setOrder(data.data);
    } catch (error) {
      console.error('Failed to fetch seller order details', error);
      router.push('/seller/orders');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/seller/orders" className="text-gray-400 hover:text-red-600 transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Chi tiết đơn bán</h1>
      </div>

      <div className="space-y-8">
        {/* Header Info */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Đơn bán #{order.id}</div>
            <div className="text-sm text-gray-500 font-medium">
              Ngày nhận: {new Date(order.createdAt).toLocaleString('vi-VN')}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <OrderStatusBadge status={order.status} />
            <SellerOrderActionButtons order={order} onUpdate={fetchOrder} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-gray-900 mb-6">Sản phẩm của bạn trong đơn</h3>
              <div className="divide-y divide-gray-50">
                {order.items?.map(item => (
                  <div key={item.id} className="py-4 flex gap-6 items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <SafeImage src={item.imageUrl} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 line-clamp-1">{item.productName}</div>
                      <div className="text-sm text-gray-400 font-bold mt-1">
                        {item.price.toLocaleString()}đ x {item.quantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-gray-900">{item.subtotal.toLocaleString()}đ</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping Summary */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-4">Thông tin giao hàng</h3>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Người nhận</span>
                  <span className="font-bold text-gray-900">{order.fullName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Số điện thoại</span>
                  <span className="font-bold text-gray-900">{order.phone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Địa chỉ giao</span>
                  <span className="font-medium text-gray-600 leading-relaxed">{order.shippingAddress}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-4">Tổng kết</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Phương thức</span>
                  <span className="font-bold text-gray-900">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Vận chuyển</span>
                  <span className="font-bold text-green-600">Miễn phí</span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-50 flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900">Tổng thu nhập</span>
                <span className="text-2xl font-black text-red-600">{order.sellerTotalAmount.toLocaleString()}đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
