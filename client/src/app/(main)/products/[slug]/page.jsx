'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import productService from '@/services/productService';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

export default function ProductDetailsPage() {
    const { slug } = useParams();
    const router = useRouter();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [slug]);

    const fetchProduct = async () => {
        try {
            const data = await productService.getProductBySlug(slug);
            setProduct(data.data);
            if (data.data.images && data.data.images.length > 0) {
                setActiveImage(data.data.images[0]);
            }
        } catch (error) {
            console.error('Failed to fetch product', error);
            toast.error('Product not found');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            toast.info('Please login to continue');
            router.push('/login');
            return;
        }

        if (user.id === product.user?.id) {
            toast.error('You cannot buy your own product');
            return;
        }

        setAdding(true);
        const success = await addToCart(product.id, quantity);
        setAdding(false);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );
    
    if (!product) return (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Sản phẩm không tồn tại</h2>
            <button onClick={() => router.push('/')} className="mt-4 text-red-600 font-semibold hover:underline">
                Quay lại trang chủ
            </button>
        </div>
    );

    const isOutOfStock = product.quantity === 0;
    const isSeller = user?.id === product.user?.id;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                        <img 
                            src={activeImage || 'https://via.placeholder.com/800x800?text=No+Image'} 
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {product.images?.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(img)}
                                className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                                    activeImage === img ? 'border-red-600 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                            >
                                <img src={img} className="w-full h-full object-cover" alt="" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details */}
                <div className="flex flex-col">
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                {product.category?.name}
                            </span>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                                product.conditionType === 'NEW' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                            }`}>
                                {product.conditionType === 'NEW' ? 'Mới' : 'Đã sử dụng'}
                            </span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
                        <div className="text-3xl font-black text-red-600">{product.price.toLocaleString()}đ</div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Mô tả sản phẩm</h3>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{product.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                            <div className="text-xs text-gray-400 font-bold uppercase mb-1">Người bán</div>
                            <div className="font-semibold text-gray-900">{product.user?.fullName}</div>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                            <div className="text-xs text-gray-400 font-bold uppercase mb-1">Kho hàng</div>
                            <div className="font-semibold text-gray-900">{product.quantity} sản phẩm có sẵn</div>
                        </div>
                    </div>

                    {!isSeller && !isOutOfStock && (
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center border border-gray-200 rounded-xl">
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-4 py-2 hover:bg-gray-50 text-gray-600 font-bold"
                                >-</button>
                                <span className="px-4 py-2 font-bold text-gray-900 w-12 text-center">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                                    className="px-4 py-2 hover:bg-gray-50 text-gray-600 font-bold"
                                >+</button>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button 
                            onClick={handleAddToCart}
                            disabled={adding || isOutOfStock || isSeller}
                            className={`flex-1 py-5 font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 ${
                                isOutOfStock || isSeller
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {isOutOfStock ? 'Hết hàng' : isSeller ? 'Sản phẩm của bạn' : 'Thêm vào giỏ hàng'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
