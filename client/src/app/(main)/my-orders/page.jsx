'use client';

import React, { useState, useEffect, useCallback } from 'react';
import orderService from '@/services/orderService';
import OrderCard from '@/components/order/OrderCard';
import EmptyState from '@/components/common/EmptyState';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await orderService.getMyOrders(page, 10);
      setOrders(data.data.content);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch orders', error);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Đơn hàng của tôi</h1>

      {orders.length === 0 ? (
        <EmptyState
          title="Bạn chưa có đơn mua nào"
          description="Bạn vẫn chưa thực hiện giao dịch nào trên FPT-Market."
          buttonText="Mua sắm ngay"
          buttonLink="/"
        />
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}

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
