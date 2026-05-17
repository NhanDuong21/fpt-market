'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

import SafeImage from '@/components/common/SafeImage';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm mb-4 transition-all hover:shadow-md">
      {/* Product Image */}
      <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
        <SafeImage 
          src={item.productImageUrl} 
          alt={item.productName}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 text-center sm:text-left">
        <Link 
          href={`/products/${item.productSlug}`}
          className="text-lg font-bold text-gray-900 hover:text-red-600 transition-colors line-clamp-1"
        >
          {item.productName}
        </Link>
        <div className="text-red-600 font-black mt-1">
          {item.price.toLocaleString()}đ
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
          <button 
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="px-3 py-1 hover:bg-white text-gray-600 font-bold transition-colors"
          >-</button>
          <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
          <button 
            onClick={() => updateQuantity(item.id, Math.min(item.stockQuantity, item.quantity + 1))}
            className="px-3 py-1 hover:bg-white text-gray-600 font-bold transition-colors"
          >+</button>
        </div>
        
        <button 
          onClick={() => removeItem(item.id)}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          title="Xóa khỏi giỏ hàng"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-[120px]">
        <div className="text-xs text-gray-400 font-bold uppercase mb-1">Thành tiền</div>
        <div className="text-xl font-black text-gray-900">
          {item.subtotal.toLocaleString()}đ
        </div>
      </div>
    </div>
  );
};

export default CartItem;
