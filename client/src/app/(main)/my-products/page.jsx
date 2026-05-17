'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import productService from '@/services/productService';
import Badge from '@/components/common/Badge';
import { toast } from 'react-toastify';
import PageContainer from '@/components/layout/PageContainer';
import Button from '@/components/common/Button';

import EmptyState from '@/components/common/EmptyState';
import SafeImage from '@/components/common/SafeImage';

export default function MyProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        try {
            const data = await productService.getMyProducts();
            setProducts(data.data.content);
        } catch (error) {
            console.error('Failed to fetch my products', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
        
        try {
            await productService.deleteProduct(id);
            toast.success('Xóa sản phẩm thành công');
            fetchMyProducts();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <PageContainer 
            title="Sản phẩm của tôi" 
            description="Quản lý danh sách sản phẩm bạn đang đăng bán"
            actions={
                <Link href="/my-products/new">
                    <Button variant="primary" className="gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Đăng sản phẩm mới
                    </Button>
                </Link>
            }
        >
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                </div>
            ) : products.length === 0 ? (
                <EmptyState
                    title="Bạn chưa đăng sản phẩm nào"
                    description="Hãy bắt đầu kinh doanh các sản phẩm chất lượng trên FPT-Market ngay hôm nay!"
                    buttonText="Đăng sản phẩm đầu tiên"
                    buttonLink="/my-products/new"
                />
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Sản phẩm</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Danh mục</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Giá bán</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                                    <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map((product) => (
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
                                                    <Link 
                                                        href={`/products/${product.slug}`}
                                                        className="font-black text-gray-900 line-clamp-1 text-lg hover:text-red-600 transition-colors"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    <div className="text-xs text-gray-400 font-bold uppercase mt-1 tracking-tighter">ID: #{product.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-lg uppercase tracking-wider border border-gray-200">
                                                {product.category?.name}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="font-black text-gray-900 text-lg">{product.price.toLocaleString()}đ</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase">Số lượng: {product.quantity}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <Badge status={product.status} />
                                            {product.status === 'REJECTED' && product.rejectReason && (
                                                <div className="mt-2 p-3 bg-red-50 rounded-xl border border-red-100 text-[10px] text-red-600 font-bold italic max-w-[200px]">
                                                    Lý do: {product.rejectReason}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link 
                                                    href={`/my-products/${product.id}/edit`}
                                                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Chỉnh sửa"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Xóa"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </PageContainer>
    );
}
