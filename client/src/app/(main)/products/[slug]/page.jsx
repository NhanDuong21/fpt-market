'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import productService from '@/services/productService';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import Button from '@/components/common/Button';
import ProductImageGallery from '@/components/product/ProductImageGallery';

export default function ProductDetailsPage() {
    const { slug } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [slug]);

    const fetchProduct = async () => {
        try {
            const data = await productService.getProductBySlug(slug);
            setProduct(data.data);
        } catch (error) {
            console.error('Failed to fetch product', error);
            toast.error('Không tìm thấy sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
            router.push(`/login?redirect=${encodeURIComponent(`/products/${slug}`)}`);
            return;
        }

        if (user.id === product.user?.id) {
            toast.error('Bạn không thể mua sản phẩm của chính mình');
            return;
        }

        setAdding(true);
        await addToCart(product.id, quantity);
        setAdding(false);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );
    
    if (!product) return (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Sản phẩm không tồn tại</h2>
            <Button onClick={() => router.push('/')} variant="primary">
                Quay lại trang chủ
            </Button>
        </div>
    );

    const isOutOfStock = product.quantity === 0;
    const isSeller = user?.id === product.user?.id;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Left: Image Gallery */}
                <div className="relative">
                    <ProductImageGallery images={product.images} productName={product.name} />
                    {isOutOfStock && (
                        <div className="absolute top-0 left-0 w-full aspect-square rounded-[2.5rem] bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-none z-10">
                            <span className="bg-white text-gray-900 px-8 py-3 rounded-2xl font-black text-2xl uppercase tracking-widest shadow-2xl">Hết hàng</span>
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div className="flex flex-col">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-4 py-1.5 bg-red-600 text-white text-xs font-black rounded-xl uppercase tracking-widest shadow-lg shadow-red-100">
                                {product.category?.name}
                            </span>
                            <span className={`px-4 py-1.5 text-xs font-black rounded-xl uppercase tracking-widest border-2 ${
                                product.conditionType === 'NEW' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                            }`}>
                                {product.conditionType === 'NEW' ? 'Mới' : 'Đã sử dụng'}
                            </span>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tighter">{product.name}</h1>
                        <div className="text-4xl font-black text-red-600 tracking-tighter">{product.price.toLocaleString()}đ</div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 mb-10 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-[5rem] -mr-16 -mt-16 opacity-50"></div>
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 relative z-10">Mô tả sản phẩm</h3>
                        <p className="text-gray-600 font-medium whitespace-pre-wrap leading-relaxed relative z-10 text-lg">{product.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-10">
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                            <div className="text-xs text-gray-400 font-black uppercase tracking-widest mb-2">Người bán</div>
                            <div className="font-black text-gray-900 text-lg">{product.user?.fullName}</div>
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                            <div className="text-xs text-gray-400 font-black uppercase tracking-widest mb-2">Kho hàng</div>
                            <div className="font-black text-gray-900 text-lg">{product.quantity} <span className="text-sm text-gray-400 font-bold uppercase ml-1">Sẵn có</span></div>
                        </div>
                    </div>

                    {isSeller ? (
                        <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-8 mb-8">
                            <div className="flex items-center gap-4 text-red-600 mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="font-black text-lg">Đây là sản phẩm của bạn. Bạn không thể mua sản phẩm do chính mình đăng.</p>
                            </div>
                            <div className="flex gap-4">
                                <Link href="/my-products" className="flex-1">
                                    <Button variant="secondary" className="w-full py-4 text-lg">Quản lý sản phẩm</Button>
                                </Link>
                                <Link href={`/my-products/${product.id}/edit`} className="flex-1">
                                    <Button variant="primary" className="w-full py-4 text-lg">Chỉnh sửa</Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            {!isOutOfStock && (
                                <div className="flex items-center gap-6 mb-10">
                                    <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Số lượng</span>
                                    <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                                        <button 
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-900 font-black hover:text-red-600 transition-colors"
                                        >-</button>
                                        <span className="w-16 text-center font-black text-gray-900 text-xl">{quantity}</span>
                                        <button 
                                            onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                                            className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-gray-900 font-black hover:text-red-600 transition-colors"
                                        >+</button>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <Button 
                                    onClick={handleAddToCart}
                                    variant="primary"
                                    size="xl"
                                    disabled={adding || isOutOfStock}
                                    className="flex-1 group overflow-hidden"
                                >
                                    <div className="flex items-center gap-3 group-hover:scale-105 transition-transform">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="text-xl uppercase tracking-widest">
                                            {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                                        </span>
                                    </div>
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
