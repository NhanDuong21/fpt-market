'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';

export default function CartPage() {
  const { cart, loading, cartCount } = useCart();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-24 h-24 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">Giỏ hàng đang trống</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi nhé!
        </p>
        <Link 
          href="/"
          className="inline-block px-12 py-4 bg-red-600 text-white font-bold rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all"
        >
          Khám phá ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-black text-gray-900">Giỏ hàng</h1>
        <span className="px-4 py-1 bg-red-600 text-white text-sm font-black rounded-full">
          {cartCount}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* List of Items */}
        <div className="lg:col-span-2">
          {cart.items.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
          
          <div className="mt-8 flex justify-between items-center">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-400 font-bold hover:text-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div>
          <CartSummary 
            totalAmount={cart.totalAmount} 
            totalItems={cartCount}
          />
        </div>
      </div>
    </div>
  );
}
