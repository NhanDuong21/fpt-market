'use client';

import React, { useState, useEffect, useCallback } from 'react';
import sellerOrderService from '@/services/sellerOrderService';
import SellerOrderTable from '@/components/seller/SellerOrderTable';
import SellerOrderCard from '@/components/seller/SellerOrderCard';
import Link from 'next/link';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await sellerOrderService.getSellerOrders(page, 10);
      setOrders(data.data.content);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch seller orders', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading && page === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Quản lý đơn bán</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Chưa có đơn bán nào</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Bạn vẫn chưa nhận được đơn hàng nào từ người mua. Hãy tiếp tục đăng bán các sản phẩm chất lượng nhé!
          </p>
          <Link 
            href="/my-products/new"
            className="inline-block px-10 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all"
          >
            Đăng bán sản phẩm mới
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <SellerOrderTable orders={orders} />
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden">
            {orders.map(order => (
              <SellerOrderCard key={order.id} order={order} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-12">
              <button 
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="px-6 py-2 border-2 border-gray-100 rounded-xl font-bold hover:border-red-600 hover:text-red-600 disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-900 transition-all"
              >
                Trang trước
              </button>
              <button 
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="px-6 py-2 border-2 border-gray-100 rounded-xl font-bold hover:border-red-600 hover:text-red-600 disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-900 transition-all"
              >
                Trang sau
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
