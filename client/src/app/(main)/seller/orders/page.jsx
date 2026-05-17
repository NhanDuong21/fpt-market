'use client';

import React, { useState, useEffect, useCallback } from 'react';
import sellerOrderService from '@/services/sellerOrderService';
import SellerOrderTable from '@/components/seller/SellerOrderTable';
import SellerOrderCard from '@/components/seller/SellerOrderCard';
import EmptyState from '@/components/common/EmptyState';

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
        <EmptyState
          title="Chưa có đơn bán nào"
          description="Bạn vẫn chưa nhận được đơn hàng nào từ người mua. Hãy tiếp tục đăng bán các sản phẩm chất lượng nhé!"
          buttonText="Đăng bán sản phẩm mới"
          buttonLink="/my-products/new"
        />
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
