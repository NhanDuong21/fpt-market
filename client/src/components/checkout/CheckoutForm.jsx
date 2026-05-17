'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/context/CartContext';
import orderService from '@/services/orderService';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const schema = z.object({
  fullName: z.string().min(2, 'Họ tên quá ngắn'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  shippingAddress: z.string().min(10, 'Địa chỉ giao hàng quá ngắn (tối thiểu 10 ký tự)'),
  paymentMethod: z.enum(['COD', 'VNPAY'], { errorMap: () => ({ message: 'Vui lòng chọn phương thức thanh toán' }) }),
});

const CheckoutForm = () => {
  const router = useRouter();
  const { cart, refreshCart, setCart } = useCart();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      phone: '',
      shippingAddress: '',
      paymentMethod: 'COD'
    }
  });

  const watchPaymentMethod = watch('paymentMethod');

  const onSubmit = async (data) => {
    try {
      const response = await orderService.createOrder(data);
      setCart(null); // Instant local cart zeroing
      await refreshCart();
      
      if (response.data.paymentMethod === 'VNPAY' && response.data.paymentUrl) {
        toast.success('Đang chuyển hướng đến cổng thanh toán VNPay...');
        window.location.href = response.data.paymentUrl;
      } else {
        toast.success('Đặt hàng thành công!');
        router.push(`/my-orders/${response.data.id}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Đã xảy ra lỗi khi đặt hàng';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-xl text-lg">1</span>
          Thông tin giao hàng
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Họ và tên</label>
            <input 
              {...register('fullName')}
              type="text"
              placeholder="Nhập họ tên người nhận"
              className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all ${
                errors.fullName ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-red-600 focus:bg-white'
              }`}
            />
            {errors.fullName && <p className="mt-2 text-xs font-bold text-red-600 uppercase tracking-wider">{errors.fullName.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Số điện thoại</label>
              <input 
                {...register('phone')}
                type="text"
                placeholder="Ví dụ: 0987654321"
                className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all ${
                  errors.phone ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-red-600 focus:bg-white'
                }`}
              />
              {errors.phone && <p className="mt-2 text-xs font-bold text-red-600 uppercase tracking-wider">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Địa chỉ chi tiết</label>
            <textarea 
              {...register('shippingAddress')}
              rows="3"
              placeholder="Số nhà, tên đường, KTX, Tòa nhà..."
              className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all resize-none ${
                errors.shippingAddress ? 'border-red-300 bg-red-50' : 'border-transparent focus:border-red-600 focus:bg-white'
              }`}
            ></textarea>
            {errors.shippingAddress && <p className="mt-2 text-xs font-bold text-red-600 uppercase tracking-wider">{errors.shippingAddress.message}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-xl text-lg">2</span>
          Phương thức thanh toán
        </h2>
        
        <div className="space-y-4">
          {/* COD Option */}
          <label className={`flex items-center justify-between p-6 border-2 rounded-2xl cursor-pointer transition-all ${
            watchPaymentMethod === 'COD' 
              ? 'border-red-600 bg-red-50/50 shadow-md shadow-red-50' 
              : 'border-gray-100 hover:border-red-200 bg-white'
          }`}>
            <div className="flex items-center gap-4">
              <input 
                type="radio" 
                value="COD" 
                {...register('paymentMethod')} 
                className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300 accent-red-600"
              />
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="font-black text-gray-900 text-base uppercase tracking-tight">Thanh toán khi nhận hàng (COD)</div>
                <div className="text-xs text-gray-500 font-medium">Nhận hàng rồi mới trả tiền. An toàn 100%.</div>
              </div>
            </div>
          </label>

          {/* VNPay Option */}
          <label className={`flex items-center justify-between p-6 border-2 rounded-2xl cursor-pointer transition-all ${
            watchPaymentMethod === 'VNPAY' 
              ? 'border-red-600 bg-red-50/50 shadow-md shadow-red-50' 
              : 'border-gray-100 hover:border-red-200 bg-white'
          }`}>
            <div className="flex items-center gap-4">
              <input 
                type="radio" 
                value="VNPAY" 
                {...register('paymentMethod')} 
                className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300 accent-red-600"
              />
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center overflow-hidden">
                <img src="https://sandbox.vnpayment.vn/paymentv2/images/logo/vnpay_logo.png" className="w-10 h-auto object-contain" alt="VNPAY" />
              </div>
              <div>
                <div className="font-black text-gray-900 text-base uppercase tracking-tight">Thanh toán qua VNPay</div>
                <div className="text-xs text-gray-500 font-medium mb-2">Thanh toán trực tuyến bảo mật qua QR hoặc tài khoản ngân hàng nội địa/quốc tế.</div>
              </div>
            </div>
          </label>
        </div>
        {errors.paymentMethod && <p className="mt-2 text-xs font-bold text-red-600 uppercase tracking-wider">{errors.paymentMethod.message}</p>}
      </div>

      <button 
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-6 bg-red-600 text-white text-xl font-black rounded-3xl shadow-2xl shadow-red-200 transition-all transform hover:-translate-y-1 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
        }`}
      >
        {isSubmitting ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG'}
      </button>
    </form>
  );
};

export default CheckoutForm;
