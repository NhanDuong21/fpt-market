'use client';

import { ShoppingBag, Store, ShieldCheck, Zap } from 'lucide-react';

export default function AuthBrandPanel() {
    return (
        <div className="hidden md:flex flex-col justify-center items-center text-white text-center pr-12 lg:pr-24">
            <div className="mb-12 relative">
                <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full"></div>
                <ShoppingBag className="w-48 h-48 lg:w-64 lg:h-64 relative opacity-90 drop-shadow-2xl" />
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight drop-shadow-md">
                FPT-Market
            </h2>
            <p className="text-xl lg:text-2xl font-bold opacity-90 leading-relaxed mb-12">
                Chợ sinh viên FPT <br />
                <span className="text-red-100/80">mua bán nhanh, an toàn, tiện lợi</span>
            </p>

            <div className="grid grid-cols-2 gap-6 max-w-sm">
                <div className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                    <Zap className="w-6 h-6 text-yellow-300" />
                    <span className="text-xs font-bold uppercase tracking-widest">Đăng tin nhanh</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                    <ShieldCheck className="w-6 h-6 text-green-300" />
                    <span className="text-xs font-bold uppercase tracking-widest">Duyệt bài an toàn</span>
                </div>
            </div>
        </div>
    );
}
