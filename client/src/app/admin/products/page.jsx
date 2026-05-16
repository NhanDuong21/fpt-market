'use client';

import { useState, useEffect } from 'react';
import adminService from '@/services/adminService';
import ProductStatusBadge from '@/components/product/ProductStatusBadge';
import { toast } from 'react-toastify';
import RejectProductModal from '@/components/admin/RejectProductModal';

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
            toast.success('Product approved');
            fetchProducts();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleReject = async () => {
        if (!rejectReason) return toast.warning('Please provide a reason');
        try {
            await adminService.rejectProduct(rejectingId, { rejectReason });
            toast.success('Product rejected');
            setRejectingId(null);
            setRejectReason('');
            fetchProducts();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-gray-500 mt-1">Review and manage student listings</p>
                </div>
                <div className="flex gap-2">
                    {['', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                statusFilter === s 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                        >
                            {s || 'ALL'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Seller</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                <img 
                                                    src={product.images?.[0] || 'https://via.placeholder.com/100'} 
                                                    alt="" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 line-clamp-1">{product.name}</div>
                                                <div className="text-xs text-gray-400">{product.category?.name} • ${product.price}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{product.user?.fullName}</div>
                                        <div className="text-xs text-gray-400">{product.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <ProductStatusBadge status={product.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {product.status === 'PENDING' && (
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleApprove(product.id)}
                                                    className="px-3 py-1.5 bg-green-50 text-green-600 text-xs font-bold rounded-lg hover:bg-green-100 transition-all"
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => setRejectingId(product.id)}
                                                    className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Reject Modal */}
            {rejectingId && (
                <RejectProductModal 
                    rejectReason={rejectReason}
                    setRejectReason={setRejectReason}
                    onConfirm={handleReject}
                    onCancel={() => setRejectingId(null)}
                />
            )}
        </div>
    );
}
