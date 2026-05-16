'use client';

import Link from 'next/link';

export default function HeroBanner() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px] lg:h-[450px]">
                {/* Main Banner */}
                <div className="lg:col-span-2 relative overflow-hidden rounded-3xl group bg-gradient-to-br from-red-500 to-red-700 shadow-xl shadow-red-100">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000')] bg-cover bg-center opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
                    <div className="relative h-full flex flex-col justify-center p-12 text-white">
                        <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-white/30">
                            FPT University Exclusive
                        </span>
                        <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-[1.1]">
                            Mua bán nội bộ <br />
                            <span className="text-red-100">Dễ dàng & An toàn</span>
                        </h1>
                        <p className="text-lg text-red-50 text-medium mb-8 max-w-md">
                            Dành riêng cho sinh viên FPT. Thanh lý đồ dùng, giáo trình cũ và tìm kiếm dịch vụ tiện ích.
                        </p>
                        <div className="flex gap-4">
                            <Link 
                                href="/products"
                                className="px-8 py-4 bg-white text-red-600 font-black rounded-2xl shadow-lg hover:bg-red-50 transition-all active:scale-95"
                            >
                                Khám phá ngay
                            </Link>
                            <Link 
                                href="/my-products/new"
                                className="px-8 py-4 bg-red-800 text-white font-black rounded-2xl shadow-lg hover:bg-red-900 transition-all active:scale-95 border border-red-400/30"
                            >
                                Đăng bán tin
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Side Banners */}
                <div className="flex flex-col gap-4">
                    <div className="flex-1 relative overflow-hidden rounded-3xl bg-gray-900 shadow-lg group">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=500')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative h-full flex flex-col justify-center p-8 text-white">
                            <h3 className="text-xl font-black mb-2">Đồ công nghệ</h3>
                            <p className="text-sm text-gray-300 mb-4">Laptop, chuột, bàn phím cũ giá hời</p>
                            <Link href="/products?categoryId=2" className="text-xs font-bold underline hover:text-red-400">Xem ngay</Link>
                        </div>
                    </div>
                    <div className="flex-1 relative overflow-hidden rounded-3xl bg-red-100 shadow-lg group">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=500')] bg-cover bg-center opacity-20 group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative h-full flex flex-col justify-center p-8 text-red-600">
                            <h3 className="text-xl font-black mb-2 text-red-700">Giáo trình cũ</h3>
                            <p className="text-sm text-red-600/70 mb-4">Tiết kiệm 50-70% chi phí học tập</p>
                            <Link href="/products?categoryId=1" className="text-xs font-bold underline hover:text-red-800">Săn ngay</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
