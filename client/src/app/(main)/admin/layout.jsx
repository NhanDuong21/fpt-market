'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Logo from '@/components/common/Logo';
import { 
    LayoutDashboard, 
    Layers, 
    Package, 
    ShoppingCart, 
    Home, 
    LogOut, 
    Menu, 
    X,
    User
} from 'lucide-react';

export default function AdminLayout({ children }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isAdmin = user?.role === 'ADMIN' || 
                    user?.role === 'ROLE_ADMIN' || 
                    user?.roles?.includes('ADMIN') || 
                    user?.roles?.includes('ROLE_ADMIN');

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace('/login?redirect=/admin');
            } else if (!isAdmin) {
                router.replace('/unauthorized');
            }
        }
    }, [user, loading, isAdmin, router]);

    // Close mobile sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                    <p className="text-gray-500 font-bold text-sm">Đang tải thông tin quản trị...</p>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return null;
    }

    const menuItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Quản lý danh mục', href: '/admin/categories', icon: Layers },
        { name: 'Quản lý sản phẩm', href: '/admin/products', icon: Package },
        { name: 'Quản lý đơn hàng', href: '/admin/orders', icon: ShoppingCart },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-red-600 text-white">
            {/* Header logo */}
            <div className="p-6 border-b border-red-500">
                <Logo className="text-white" />
            </div>

            {/* Nav Menu */}
            <nav className="flex-grow px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                                isActive
                                    ? 'bg-white text-red-600 shadow-lg shadow-red-700/20'
                                    : 'hover:bg-red-700 text-red-100 hover:text-white'
                            }`}
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-red-500 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-100 hover:bg-red-700 hover:text-white transition-all duration-200"
                >
                    <Home size={20} />
                    <span>Về trang chủ</span>
                </Link>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-100 hover:bg-red-700 hover:text-white transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar (Fixed 260px) */}
            <aside className="hidden md:block w-64 flex-shrink-0 border-r border-gray-100 shadow-md">
                <div className="fixed top-0 bottom-0 left-0 w-64">
                    <SidebarContent />
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-grow flex flex-col min-w-0">
                {/* Mobile Top Navbar */}
                <header className="md:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition"
                    >
                        <Menu size={24} />
                    </button>
                    <Logo className="text-red-600 scale-90" />
                    <div className="w-10"></div> {/* spacer */}
                </header>

                {/* Mobile Drawer Backdrop */}
                {isSidebarOpen && (
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
                    />
                )}

                {/* Mobile Sidebar Drawer */}
                <aside
                    className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transition-transform duration-300 transform md:hidden ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="h-full relative">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute top-4 right-4 p-2 text-white hover:bg-red-700 rounded-full transition"
                        >
                            <X size={20} />
                        </button>
                        <SidebarContent />
                    </div>
                </aside>

                {/* Core Admin Page Content */}
                <main className="flex-grow p-6 md:p-8 lg:p-10 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
