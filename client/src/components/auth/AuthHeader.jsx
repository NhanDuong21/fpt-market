'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/common/Logo';

export default function AuthHeader({ title }) {
    const pathname = usePathname();
    const displayTitle = title || (pathname === '/login' ? 'Đăng nhập' : 'Đăng ký');

    return (
        <header className="bg-white border-b border-gray-100 relative z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 md:h-24">
                    <div className="flex items-center gap-4">
                        <Logo className="text-red-600 font-black tracking-tighter" />
                        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 hidden sm:block">
                            {displayTitle}
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
