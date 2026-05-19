'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import SearchBar from '@/components/common/SearchBar';
import Logo from '@/components/common/Logo';
import { ShoppingCart, User, LogOut, PlusCircle, LayoutDashboard, Settings } from 'lucide-react';

export default function Header() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Tài khoản</p>
                                            <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                                        </div>
                                        {user.role === 'ADMIN' ? (
                                            <>
                                                <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-all">
                                                    <LayoutDashboard className="w-4 h-4" /> Dashboard
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
                                            <LogOut className="w-4 h-4" /> Đăng xuất
                                        </button>
                                    </div>
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
                    </div>
                </div>
            </div>
            
            {/* Mobile Search Bar */}
            <div className="md:hidden px-4 pb-3">
                <SearchBar />
            </div>
        </header>
    );
}
