'use client';

import Link from 'next/link';

export default function AuthHeader({ title }) {
    return (
        <header className="bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 md:h-24">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xl">
                                F
                            </div>
                            <span className="text-2xl font-black text-red-600 tracking-tighter">FPT-MARKET</span>
                        </Link>
                        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 hidden sm:block">
                            {title}
                        </h1>
                    </div>
                    
                    <Link href="/help" className="text-sm font-medium text-red-600 hover:underline">
                        Bạn cần giúp đỡ?
                    </Link>
                </div>
            </div>
        </header>
    );
}
