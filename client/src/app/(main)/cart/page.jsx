'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyState from '@/components/common/EmptyState';

export default function CartPage() {
  const { cart, loading, fetchCart, cartItems, totalItems } = useCart();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // ONLY show the Empty State ("Giỏ hàng trống") if !loading and cartItems.length === 0.
  // This prevents the UI from flashing an empty cart before the fetch completes.
  if (!loading && cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="Giỏ hàng của bạn đang trống"
          description="Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi nhé!"
          buttonText="Khám phá sản phẩm"
          buttonLink="/"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-black text-gray-900">Giỏ hàng ({totalItems})</h1>
        <span className="px-4 py-1 bg-red-600 text-white text-sm font-black rounded-full">
          {totalItems}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* List of Items */}
        <div className="lg:col-span-2">
          {cartItems.map(item => (
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
            totalAmount={cart?.totalAmount || 0} 
            totalItems={totalItems}
          />
        </div>
      </div>
    </div>
  );
}
