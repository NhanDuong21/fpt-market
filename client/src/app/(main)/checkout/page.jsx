'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import Link from 'next/link';
import EmptyState from '@/components/common/EmptyState';
import SafeImage from '@/components/common/SafeImage';

export default function CheckoutPage() {
  const { cart, loading } = useCart();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="Giỏ hàng đang trống"
          description="Bạn không thể tiến hành thanh toán khi không có sản phẩm nào trong giỏ hàng."
          buttonText="Tiếp tục mua sắm"
          buttonLink="/"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/cart" className="text-gray-400 hover:text-red-600 transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Thanh toán</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Đơn hàng của bạn</h2>
            
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {cart.items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <SafeImage src={item.productImageUrl} alt={item.productName} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-sm line-clamp-1">{item.productName}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase">Số lượng: {item.quantity}</div>
                    <div className="text-sm font-black text-red-600 mt-1">{item.subtotal.toLocaleString()}đ</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-3">
              <div className="flex justify-between text-gray-600 font-bold">
                <span>Tạm tính</span>
                <span>{cart.totalAmount.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-gray-600 font-bold">
                <span>Vận chuyển</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="pt-4 flex justify-between items-end">
                <span className="text-xl font-black text-gray-900">Tổng tiền</span>
                <span className="text-3xl font-black text-red-600">
                  {cart.totalAmount.toLocaleString()}đ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
