'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import productService from '@/services/productService';
import ProductGrid from '@/components/product/ProductGrid';
import { ChevronRight } from 'lucide-react';

export default function HomeProductSection({ title, subtitle, params }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getProducts(params);
                setProducts(data.data.content);
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [params]);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
                    <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
                </div>
                <Link 
                    href="/products" 
                    className="group flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all text-xs"
                >
                    Xem tất cả <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-gray-100 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium italic">Hiện chưa có sản phẩm nào trong mục này</p>
                </div>
            ) : (
                <ProductGrid products={products} loading={false} />
            )}
        </section>
    );
}
