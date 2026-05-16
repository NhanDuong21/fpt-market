'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import categoryService from '@/services/categoryService';
import { Book, Monitor, Smartphone, Sofa, Coffee, User, ChevronRight } from 'lucide-react';

const iconMap = {
    'giao-trinh': Book,
    'cong-nghe': Monitor,
    'phu-kien': Smartphone,
    'do-sinh-hoat': Sofa,
    'dich-vu': Coffee,
    'default': User
};

export default function CategoryShortcutGrid() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data.data.slice(0, 6)); // Show first 6
            } catch (error) {
                console.error('Failed to fetch categories', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-3xl animate-pulse"></div>
                ))}
            </div>
        </section>
    );

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Danh mục phổ biến</h2>
                    <p className="text-gray-500 text-sm mt-1">Tìm kiếm nhanh theo nhu cầu của bạn</p>
                </div>
                <Link href="/categories" className="text-red-600 font-bold text-sm flex items-center gap-1 hover:underline">
                    Tất cả danh mục <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat) => {
                    const Icon = iconMap[cat.slug] || iconMap['default'];
                    return (
                        <Link 
                            key={cat.id} 
                            href={`/products?categoryId=${cat.id}`}
                            className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-red-50 hover:border-red-100 transition-all text-center flex flex-col items-center gap-4"
                        >
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center group-hover:bg-red-600 transition-all duration-300">
                                <Icon className="w-8 h-8 text-red-600 group-hover:text-white transition-all duration-300" />
                            </div>
                            <span className="font-bold text-gray-700 group-hover:text-red-600 transition-colors text-sm">
                                {cat.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
