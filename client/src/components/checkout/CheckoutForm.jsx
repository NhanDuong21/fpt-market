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
});

const CheckoutForm = () => {
  const router = useRouter();
  const { cart, refreshCart, setCart } = useCart();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      const response = await orderService.createOrder(data);
      toast.success('Đặt hàng thành công!');
      setCart(null); // Instant local cart zeroing
      await refreshCart();
      router.push(`/my-orders/${response.data.id}`);
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
        
        <div className="p-6 border-2 border-red-600 bg-red-50 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div className="font-black text-gray-900 text-lg uppercase tracking-tight">Thanh toán khi nhận hàng (COD)</div>
              <div className="text-sm text-gray-500 font-medium">Nhận hàng rồi mới trả tiền. An toàn 100%.</div>
            </div>
          </div>
          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
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
