'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import productService from '@/services/productService';

export default function ProductDetailsPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');

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
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Loading...</div>;
    if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">Product not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 border border-gray-100">
                        <img 
                            src={activeImage || 'https://via.placeholder.com/800x600?text=No+Image'} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {product.images?.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(img)}
                                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                    activeImage === img ? 'border-blue-600 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
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
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-widest">
                                {product.category?.name}
                            </span>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-widest ${
                                product.conditionType === 'NEW' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                            }`}>
                                {product.conditionType}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                        <div className="text-3xl font-bold text-blue-600">${product.price.toLocaleString()}</div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Description</h3>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{product.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                            <div className="text-xs text-gray-400 font-bold uppercase mb-1">Seller</div>
                            <div className="font-semibold text-gray-900">{product.user?.fullName}</div>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                            <div className="text-xs text-gray-400 font-bold uppercase mb-1">Stock</div>
                            <div className="font-semibold text-gray-900">{product.quantity} units available</div>
                        </div>
                    </div>

                    <button className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Contact Seller
                    </button>
                </div>
            </div>
        </div>
    );
}
