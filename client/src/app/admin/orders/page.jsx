'use client';

import { useState, useEffect } from 'react';
import adminService from '@/services/adminService';
import Badge from '@/components/common/Badge';
import { toast } from 'react-toastify';
import PageContainer from '@/components/layout/PageContainer';
import PaymentStatusBadge from '@/components/order/PaymentStatusBadge';
import { getPaymentMethodLabel } from '@/utils/paymentStatus';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Need to implement getAllOrders in adminService
            const data = await adminService.getAllOrders();
            setOrders(data.data.content);
        } catch (error) {
            console.error('Failed to fetch orders', error);
            // toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer 
            title="Quản lý Đơn hàng" 
            description="Theo dõi toàn bộ đơn hàng trong hệ thống"
        >
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Đơn hàng</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Người mua</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Tổng tiền</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Thanh toán</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Ngày đặt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center text-gray-400 font-bold italic">
                                            Chưa có đơn hàng nào
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-red-50/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="font-black text-gray-900 text-lg">#{order.id}</div>
                                                <div className="text-xs text-gray-400 font-medium uppercase tracking-tighter">{getPaymentMethodLabel(order.paymentMethod)}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-sm font-black text-gray-900">{order.fullName}</div>
                                                <div className="text-xs text-gray-400 font-medium">{order.phone}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="font-black text-red-600">{order.totalAmount.toLocaleString()}đ</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase">{order.items?.length} sản phẩm</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <Badge status={order.status} />
                                            </td>
                                            <td className="px-8 py-5">
                                                <PaymentStatusBadge method={order.paymentMethod} status={order.paymentDetails?.paymentStatus} />
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="text-sm font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                                                <div className="text-xs text-gray-400 font-medium">{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </PageContainer>
    );
}
