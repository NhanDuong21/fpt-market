'use client';

import { useState, useEffect } from 'react';
import adminService from '@/services/adminService';
import Badge from '@/components/common/Badge';
import { toast } from 'react-toastify';
import RejectProductModal from '@/components/admin/RejectProductModal';
import PageContainer from '@/components/layout/PageContainer';
import Button from '@/components/common/Button';

import SafeImage from '@/components/common/SafeImage';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [statusFilter]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = { status: statusFilter || undefined };
            const data = await adminService.getAllProducts(params);
            setProducts(data.data.content);
        } catch (error) {
            console.error('Failed to fetch products', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await adminService.approveProduct(id);
            toast.success('Đã duyệt sản phẩm');
            fetchProducts();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleReject = async () => {
        if (!rejectReason) return toast.warning('Vui lòng nhập lý do từ chối');
        try {
            await adminService.rejectProduct(rejectingId, { rejectReason });
            toast.success('Đã từ chối sản phẩm');
            setRejectingId(null);
            setRejectReason('');
            fetchProducts();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const filterButtons = [
        { label: 'Tất cả', value: '' },
        { label: 'Chờ duyệt', value: 'PENDING' },
        { label: 'Đang bán', value: 'APPROVED' },
        { label: 'Đã từ chối', value: 'REJECTED' }
    ];

    return (
        <PageContainer 
            title="Quản lý Sản phẩm" 
            description="Kiểm duyệt và quản lý danh sách sản phẩm đăng bán"
            actions={
                <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                    {filterButtons.map((s) => (
                        <button
                            key={s.value}
                            onClick={() => setStatusFilter(s.value)}
                            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${
                                statusFilter === s.value 
                                ? 'bg-red-600 text-white shadow-lg shadow-red-100' 
                                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            }
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
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Sản phẩm</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Người bán</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-8 py-20 text-center text-gray-400 font-bold italic">
                                            Không có sản phẩm nào phù hợp
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.id} className="hover:bg-red-50/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center">
                                                        <SafeImage 
                                                            src={product.images?.[0]} 
                                                            alt="" 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-gray-900 line-clamp-1 text-lg">{product.name}</div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md uppercase">{product.category?.name}</span>
                                                            <span className="text-sm font-bold text-gray-400">{product.price.toLocaleString()}đ</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-sm font-black text-gray-900">{product.user?.fullName}</div>
                                                <div className="text-xs text-gray-400 font-medium">{product.user?.email}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <Badge status={product.status} />
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                {product.status === 'PENDING' && (
                                                    <div className="flex justify-end gap-3">
                                                        <button 
                                                            onClick={() => handleApprove(product.id)}
                                                            className="px-4 py-2 bg-green-50 text-green-600 text-xs font-black rounded-xl hover:bg-green-600 hover:text-white transition-all border border-green-100 uppercase tracking-wider"
                                                        >
                                                            Duyệt
                                                        </button>
                                                        <button 
                                                            onClick={() => setRejectingId(product.id)}
                                                            className="px-4 py-2 bg-red-50 text-red-600 text-xs font-black rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100 uppercase tracking-wider"
                                                        >
                                                            Từ chối
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectingId && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-6 overflow-y-auto">
                    <div className="w-full max-w-lg animate-in fade-in zoom-in duration-300">
                        <RejectProductModal 
                            rejectReason={rejectReason}
                            setRejectReason={setRejectReason}
                            onConfirm={handleReject}
                            onCancel={() => setRejectingId(null)}
                        />
                    </div>
                </div>
            )}
        </PageContainer>
    );
}
