'use client';

import { ShieldCheck, Zap, Users, Search } from 'lucide-react';

export default function TrustStrip() {
    const highlights = [
        { icon: Users, title: 'Nội bộ FPT', desc: 'Chỉ dành cho sinh viên' },
        { icon: Zap, title: 'Đăng tin nhanh', desc: 'Duyệt bài trong 15p' },
        { icon: ShieldCheck, title: 'Duyệt an toàn', desc: 'Kiểm duyệt 100%' },
        { icon: Search, title: 'Tìm kiếm dễ', desc: 'Lọc theo cơ sở FPT' },
    ];

    return (
        <section className="bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {highlights.map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
