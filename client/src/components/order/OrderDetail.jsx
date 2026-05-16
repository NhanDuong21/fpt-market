'use client';

import React, { useState } from 'react';
import OrderStatusBadge from './OrderStatusBadge';
import orderService from '@/services/orderService';
import { toast } from 'react-toastify';

const OrderDetail = ({ order, onUpdate }) => {
  const [cancelling, setCancelling] = useState(false);

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;

    try {
      setCancelling(true);
      await orderService.cancelOrder(order.id);
      toast.success('Đã hủy đơn hàng');
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể hủy đơn hàng');
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Đơn hàng #{order.id}</div>
          <div className="text-sm text-gray-500 font-medium">
            Đặt ngày {new Date(order.createdAt).toLocaleString('vi-VN')}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <OrderStatusBadge status={order.status} />
          {canCancel && (
            <button 
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-6 py-2 bg-gray-50 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-600 transition-all text-sm border border-transparent hover:border-red-100"
            >
              {cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-6">Sản phẩm đã đặt</h3>
            <div className="divide-y divide-gray-50">
              {order.items?.map(item => (
                <div key={item.id} className="py-4 flex gap-6 items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex-shrink-0">
                    <img src={item.imageUrl} alt="" className="w-full h-full object-contain" />
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

        {/* Shipping & Payment Summary */}
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
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Địa chỉ</span>
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
              <span className="text-lg font-bold text-gray-900">Tổng tiền</span>
              <span className="text-2xl font-black text-red-600">{order.totalAmount.toLocaleString()}đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
