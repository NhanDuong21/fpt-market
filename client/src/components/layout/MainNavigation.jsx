'use client';

import Link from 'next/link';

export default function MainNavigation() {
    const navItems = [
        { label: 'Danh mục', href: '/categories' },
        { label: 'Sản phẩm', href: '/products' },
        { label: 'Giáo trình', href: '/products?categoryId=1' }, // Placeholder IDs
        { label: 'Công nghệ', href: '/products?categoryId=2' },
        { label: 'Phụ kiện', href: '/products?categoryId=3' },
        { label: 'Đồ sinh hoạt', href: '/products?categoryId=4' },
        { label: 'Dịch vụ sinh viên', href: '/services' },
    ];

    return (
        <nav className="bg-white border-b border-gray-100 hidden md:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ul className="flex items-center gap-8 h-12 overflow-x-auto no-scrollbar">
                    {navItems.map((item) => (
                        <li key={item.label} className="flex-shrink-0">
                            <Link 
                                href={item.href}
                                className="text-sm font-bold text-gray-600 hover:text-red-600 transition-all uppercase tracking-wider"
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
