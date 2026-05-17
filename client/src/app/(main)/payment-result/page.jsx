'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import paymentService from '@/services/paymentService';
import Link from 'next/link';
import PaymentStatusBadge from '@/components/order/PaymentStatusBadge';
import { getPaymentMethodLabel, getPaymentStatusLabel } from '@/utils/paymentStatus';
import { useCart } from '@/context/CartContext';
import { CheckCircle, XCircle } from 'lucide-react';

const PaymentResultContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { fetchCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const calledRef = useRef(false);

  useEffect(() => {
    const verifyTransaction = async () => {
      if (calledRef.current) return;
      calledRef.current = true;

      try {
        const queryString = searchParams.toString();
        if (!queryString) {
          setLoading(false);
          setSuccess(false);
          setErrorMessage('Không tìm thấy thông tin giao dịch thanh toán.');
          return;
        }

        const res = await paymentService.vnpayCallback(queryString);
        if (res.success && res.data) {
          if (res.data.paymentStatus === 'PAID') {
            setSuccess(true);
            setPaymentDetails(res.data);
          } else if (res.data.paymentStatus === 'CANCELLED') {
            setSuccess(false);
            setPaymentDetails(res.data);
            setErrorMessage('Giao dịch thanh toán đã bị hủy bởi người dùng.');
          } else {
            setSuccess(false);
            setPaymentDetails(res.data);
            setErrorMessage('Thanh toán thất bại hoặc đã bị hủy.');
          }
        } else {
          setSuccess(false);
          setErrorMessage(res?.message || 'Giao dịch không thành công hoặc chữ ký không hợp lệ.');
        }
      } catch (error) {
        console.error('Error verifying transaction:', error);
        setSuccess(false);
        setErrorMessage(error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi xác thực giao dịch.');
      } finally {
        setLoading(false);
        if (fetchCart) {
          fetchCart();
        }
      }
    };

    verifyTransaction();
  }, [searchParams, fetchCart]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-gray-50/50">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent border-solid rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Đang xác thực thanh toán</h2>
        <p className="text-gray-500 font-medium">Vui lòng không đóng trình duyệt hoặc tải lại trang...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-16 px-4">
      {success ? (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl p-10 text-center relative overflow-hidden">
          {/* Top aesthetic accent */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-red-600"></div>

          {/* Large success circle with Lucide CheckCircle */}
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle className="text-green-500 w-16 h-16" />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Thanh toán thành công</h1>
          <p className="text-gray-500 font-medium mb-8">Cảm ơn bạn đã tin tưởng mua sắm tại FPT-Market</p>

          <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100 text-left space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Mã đơn hàng</span>
              <span className="font-extrabold text-gray-900">#{paymentDetails?.orderId}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Phương thức</span>
              <span className="font-extrabold text-red-600 bg-red-50 px-3 py-1 rounded-xl text-xs uppercase">
                {getPaymentMethodLabel(paymentDetails?.paymentMethod)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Số tiền thanh toán</span>
              <span className="font-black text-gray-900 text-lg">
                {paymentDetails?.amount ? (paymentDetails.amount).toLocaleString('vi-VN') + ' đ' : '0 đ'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Trạng thái</span>
              <PaymentStatusBadge method={paymentDetails?.paymentMethod} status={paymentDetails?.paymentStatus} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href={`/my-orders/${paymentDetails?.orderId}`}
              className="flex-1 py-5 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-100 transition-all text-center"
            >
              Xem đơn hàng
            </Link>
            <Link 
              href="/products"
              className="flex-1 py-5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-extrabold text-lg rounded-2xl border border-gray-200 transition-all text-center"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl p-10 text-center relative overflow-hidden">
          {/* Top aesthetic accent */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-red-600"></div>

          {/* Large failure circle with Lucide XCircle */}
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <XCircle className="text-red-500 w-16 h-16" />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Thanh toán chưa hoàn tất</h1>
          <p className="text-gray-500 font-medium mb-8">Giao dịch của bạn đã bị hủy hoặc không thể hoàn thành</p>

          <div className="bg-red-50/50 rounded-3xl p-6 mb-8 border border-red-100 text-center">
            <p className="text-red-700 font-bold text-base leading-relaxed">
              {errorMessage || 'Thanh toán thất bại hoặc đã bị hủy từ cổng giao dịch VNPay.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/cart"
              className="flex-1 py-5 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-100 transition-all text-center"
            >
              Quay lại giỏ hàng
            </Link>
            <Link 
              href="/"
              className="flex-1 py-5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-extrabold text-lg rounded-2xl border border-gray-200 transition-all text-center"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentResultPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-16 h-16 border-t-4 border-b-4 border-red-600 border-solid rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Đang tải kết quả...</h2>
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  );
};

export default PaymentResultPage;
