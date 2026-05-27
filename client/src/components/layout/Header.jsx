'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import SearchBar from '@/components/common/SearchBar';
import Logo from '@/components/common/Logo';
import { ShoppingCart, User, LogOut, PlusCircle, LayoutDashboard, Settings, Menu, X } from 'lucide-react';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <header className="sticky top-0 z-50 bg-red-600 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Logo className="text-white font-black tracking-tighter" />
                    </div>

                    {/* Search Bar - Hidden on mobile, but let's keep it responsive */}
                    <div className="hidden md:flex flex-grow justify-center max-w-2xl">
                        <SearchBar />
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Cart Link with Badge UI */}
                        <Link
                            href={user ? "/cart" : "/login?redirect=/cart"}
                            className="relative flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:bg-white/15"
                            aria-label="Giỏ hàng"
                        >
                            <ShoppingCart size={28} strokeWidth={2.5} />
                            {mounted && Number(totalItems) > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-red-500 bg-white px-1 text-xs font-bold text-red-600">
                                    {totalItems > 99 ? "99+" : totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Sell Button */}
                        <Link 
                            href={user ? "/my-products/new" : `/login?redirect=${encodeURIComponent('/my-products/new')}`}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white text-red-600 font-bold rounded-xl shadow-sm hover:bg-gray-100 transition-all text-sm"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Đăng bán
                        </Link>

                        {/* Auth Block */}
                        {user ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-2 p-1 pl-3 bg-red-700 text-white rounded-full hover:bg-red-800 transition-all border border-red-500"
                                >
                                    <span className="hidden lg:block text-xs font-semibold">{user.fullName}</span>
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-red-600">
                                        <User className="w-5 h-5" />
                                    </div>
                                </button>

                                {isMenuOpen && (
                                    <>
                                        {/* Backdrop to close the user menu when clicked outside */}
                                        <div 
                                            className="fixed inset-0 z-40 bg-transparent" 
                                            onClick={() => setIsMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-4 py-3 border-b border-gray-50">
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Tài khoản</p>
                                                <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                                            </div>
                                            {user.role === 'ADMIN' ? (
                                                <>
                                                    <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-all">
                                                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                                                    </Link>
                                                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-all">
                                                        <User className="w-4 h-4" /> Hồ sơ
                                                    </Link>
                                                    <Link href="/admin/categories" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-all">
                                                        <Settings className="w-4 h-4" /> Quản lý danh mục
                                                    </Link>
                                                    <Link href="/admin/products" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-all">
                                                        <PlusCircle className="w-4 h-4" /> Quản lý sản phẩm
                                                    </Link>
                                                    <Link href="/admin/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-all">
                                                        <ShoppingCart className="w-4 h-4" /> Quản lý đơn hàng
                                                    </Link>
                                                </>
                                            ) : (
                                                <>
                                                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-all">
                                                        <User className="w-4 h-4" /> Hồ sơ
                                                    </Link>
                                                    <Link href="/my-products/new" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-all">
                                                        <PlusCircle className="w-4 h-4" /> Đăng bán
                                                    </Link>
                                                    <Link href="/my-products" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-all">
                                                        <LayoutDashboard className="w-4 h-4" /> Sản phẩm của tôi
                                                    </Link>
                                                    <Link href="/my-orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-all">
                                                        <ShoppingCart className="w-4 h-4" /> Đơn mua
                                                    </Link>
                                                    <Link href="/seller/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-all">
                                                        <Settings className="w-4 h-4" /> Đơn bán
                                                    </Link>
                                                </>
                                            )}
                                            <button 
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all border-t border-gray-50 mt-1"
                                            >
                                                <LogOut className="w-4 h-4" /> Đăng xuấtt
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="px-4 py-2 text-white font-bold text-sm hover:text-red-100 transition-all">
                                    Đăng nhập
                                </Link>
                                <Link 
                                    href="/register" 
                                    className="px-4 py-2 bg-red-700 text-white font-bold rounded-xl border border-red-500 hover:bg-red-800 transition-all text-sm"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Hamburger */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Mobile Search Bar */}
            <div className="md:hidden px-4 pb-3">
                <SearchBar />
            </div>

            {/* Mobile Menu Drawer & Backdrop */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    
                    {/* Drawer Content */}
                    <div className="fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-300">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <Logo className="text-gray-900 font-black tracking-tighter" />
                                <button 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <nav className="flex flex-col gap-4">
                                <Link href="/" className="text-sm font-bold text-gray-700 hover:text-red-600 py-2 border-b border-gray-50 transition-all">
                                    Trang chủ
                                </Link>
                                <Link href="/products" className="text-sm font-bold text-gray-700 hover:text-red-600 py-2 border-b border-gray-50 transition-all">
                                    Sản phẩm
                                </Link>
                                <Link href={user ? "/my-products/new" : `/login?redirect=${encodeURIComponent('/my-products/new')}`} className="text-sm font-bold text-gray-700 hover:text-red-600 py-2 border-b border-gray-50 transition-all">
                                    Đăng bán
                                </Link>
                                {user && (
                                    <>
                                        <Link href="/profile" className="text-sm font-bold text-gray-700 hover:text-red-600 py-2 border-b border-gray-50 transition-all">
                                            Hồ sơ của tôi
                                        </Link>
                                        <Link href="/my-products" className="text-sm font-bold text-gray-700 hover:text-red-600 py-2 border-b border-gray-50 transition-all">
                                            Sản phẩm của tôi
                                        </Link>
                                        <Link href="/my-orders" className="text-sm font-bold text-gray-700 hover:text-red-600 py-2 border-b border-gray-50 transition-all">
                                            Đơn mua
                                        </Link>
                                        <Link href="/seller/orders" className="text-sm font-bold text-gray-700 hover:text-red-600 py-2 border-b border-gray-50 transition-all">
                                            Đơn bán
                                        </Link>
                                        {user.role === 'ADMIN' && (
                                            <Link href="/admin" className="text-sm font-bold text-gray-700 hover:text-red-600 py-2 border-b border-gray-50 transition-all">
                                                Admin Dashboard
                                            </Link>
                                        )}
                                    </>
                                )}
                            </nav>
                        </div>
                        
                        <div className="pt-6 border-t border-gray-100">
                            {user ? (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-gray-900 truncate">{user.fullName}</p>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            logout();
                                        }}
                                        className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" /> Đăng xuất
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link 
                                        href="/login" 
                                        className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all text-center text-sm"
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link 
                                        href="/register" 
                                        className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all text-center text-sm"
                                    >
                                        Đăng ký
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}
