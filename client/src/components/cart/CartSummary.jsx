'use client';

import React from 'react';
import Link from 'next/link';

const CartSummary = ({ totalAmount, totalItems }) => {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-24">
      <h2 className="text-2xl font-black text-gray-900 mb-6">Tổng cộng</h2>
      
      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-gray-600">
          <span className="font-semibold">Sản phẩm ({totalItems})</span>
          <span className="font-bold">{totalAmount.toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span className="font-semibold">Phí vận chuyển</span>
          <span className="font-bold text-green-600">Miễn phí</span>
        </div>
        <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
          <span className="text-lg font-bold text-gray-900">Thành tiền</span>
          <span className="text-3xl font-black text-red-600 leading-none">
            {totalAmount.toLocaleString()}đ
          </span>
        </div>
      </div>

      <Link 
        href="/checkout"
        className="block w-full py-5 bg-red-600 text-white text-center font-bold rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 hover:shadow-red-200 transition-all transform hover:-translate-y-1"
      >
        Tiến hành đặt hàng
      </Link>
      
      <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
        Bằng cách đặt hàng, bạn đồng ý với <Link href="#" className="underline">Điều khoản dịch vụ</Link> của FPT-Market.
      </p>
    </div>
  );
};

export default CartSummary;
