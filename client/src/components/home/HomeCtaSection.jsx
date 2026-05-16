'use client';

import Link from 'next/link';
import { ArrowRight, PlusCircle } from 'lucide-react';

export default function HomeCtaSection() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="relative rounded-[40px] bg-red-600 overflow-hidden shadow-2xl shadow-red-200">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="relative flex flex-col items-center text-center p-12 lg:p-20">
                    <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 leading-tight">
                        Bạn có đồ không dùng nữa? <br />
                        <span className="text-red-200">Đăng bán ngay trên FPT-Market</span>
                    </h2>
                    <p className="text-red-100 text-lg mb-10 max-w-2xl font-medium">
                        Giúp đỡ cộng đồng sinh viên FPT bằng cách sang nhượng lại giáo trình, đồ dùng cũ với mức giá hợp lý nhất.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link 
                            href="/my-products/new"
                            className="px-10 py-5 bg-white text-red-600 font-black rounded-2xl shadow-xl hover:bg-gray-100 transition-all active:scale-95 flex items-center gap-3"
                        >
                            <PlusCircle className="w-6 h-6" />
                            Đăng bán ngay
                        </Link>
                        <Link 
                            href="/products"
                            className="px-10 py-5 bg-red-800 text-white font-black rounded-2xl shadow-xl hover:bg-red-900 transition-all active:scale-95 flex items-center gap-3 border border-red-400/30"
                        >
                            Khám phá sản phẩm
                            <ArrowRight className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
