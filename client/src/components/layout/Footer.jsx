'use client';

import Link from 'next/link';
import Logo from '@/components/common/Logo';

export default function Footer() {
    return (
        <footer className="bg-white border-t-4 border-red-600 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div>
                        <Logo className="text-red-600 mb-6 block" />
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Nền tảng mua bán nội bộ dành cho sinh viên FPT. Tiết kiệm hơn, an tâm hơn.
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Giới thiệu</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-gray-500 hover:text-red-600 transition-all text-sm">Về chúng tôi</Link></li>
                            <li><Link href="/blog" className="text-gray-500 hover:text-red-600 transition-all text-sm">Tin tức</Link></li>
                            <li><Link href="/careers" className="text-gray-500 hover:text-red-600 transition-all text-sm">Tuyển dụng</Link></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Hỗ trợ</h4>
                        <ul className="space-y-4">
                            <li><Link href="/faq" className="text-gray-500 hover:text-red-600 transition-all text-sm">Hướng dẫn mua hàng</Link></li>
                            <li><Link href="/selling-guide" className="text-gray-500 hover:text-red-600 transition-all text-sm">Hướng dẫn đăng tin</Link></li>
                            <li><Link href="/safety" className="text-gray-500 hover:text-red-600 transition-all text-sm">An toàn mua bán</Link></li>
                        </ul>
                    </div>

                    {/* Links 3 */}
                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Liên hệ</h4>
                        <ul className="space-y-4">
                            <li className="text-gray-500 text-sm">Hotline: 1900 xxxx</li>
                            <li className="text-gray-500 text-sm">Email: support@fptmarket.vn</li>
                            <li className="text-gray-500 text-sm">Địa chỉ: Khu CNC Hòa Lạc, Thạch Thất, Hà Nội</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 text-center">
                    <p className="text-gray-400 text-xs">
                        © {new Date().getFullYear()} FPT-Market. All rights reserved. Designed for FPT Students.
                    </p>
                </div>
            </div>
        </footer>
    );
}
