'use client';

import React, { useState } from 'react';
import sellerOrderService from '@/services/sellerOrderService';
import { toast } from 'react-toastify';
import { canSellerConfirmOrder, canSellerShipOrder, canSellerCompleteOrder } from '@/utils/orderStatus';

const SellerOrderActionButtons = ({ order, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xác nhận đơn hàng này?')) return;
    try {
      setLoading(true);
      await sellerOrderService.confirmOrder(order.id);
      toast.success('Đã xác nhận đơn hàng thành công!');
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xác nhận đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleShip = async () => {
    if (!window.confirm('Xác nhận bắt đầu giao đơn hàng này?')) return;
    try {
      setLoading(true);
      await sellerOrderService.shipOrder(order.id);
      toast.success('Đang bắt đầu giao hàng!');
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể chuyển trạng thái giao hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!window.confirm('Xác nhận hoàn thành đơn hàng này? Khách hàng đã thanh toán và nhận hàng thành công?')) return;
    try {
      setLoading(true);
      await sellerOrderService.completeOrder(order.id);
      toast.success('Đơn hàng đã được hoàn thành thành công!');
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể hoàn thành đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const showConfirm = canSellerConfirmOrder(order.status);
  const showShip = canSellerShipOrder(order.status);
  const showComplete = canSellerCompleteOrder(order.status);

  if (!showConfirm && !showShip && !showComplete) return null;

  return (
    <div className="flex gap-4">
      {showConfirm && (
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-red-100 transition-all text-sm uppercase tracking-wider"
        >
          {loading ? 'Đang xử lý...' : 'Xác nhận đơn'}
        </button>
      )}

      {showShip && (
        <button
          onClick={handleShip}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 transition-all text-sm uppercase tracking-wider"
        >
          {loading ? 'Đang xử lý...' : 'Bắt đầu giao hàng'}
        </button>
      )}

      {showComplete && (
        <button
          onClick={handleComplete}
          disabled={loading}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-green-100 transition-all text-sm uppercase tracking-wider"
        >
          {loading ? 'Đang xử lý...' : 'Hoàn thành đơn'}
        </button>
      )}
    </div>
  );
};

export default SellerOrderActionButtons;
