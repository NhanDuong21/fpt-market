'use client';

import { useState, useEffect } from 'react';
import adminService from '@/services/adminService';
import { toast } from 'react-toastify';
import { 
    DollarSign, 
    Package, 
    ShoppingCart, 
    Users, 
    Layers,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await adminService.getDashboardStats();
            // Unwrap APIResponse wrapper
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            toast.error('Không thể tải dữ liệu thống kê');
        } finally {
            setLoading(false);
        }
    };

    const formatVND = (value) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(value || 0);
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div>
                    <div className="h-8 bg-gray-200 rounded-lg w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-44 bg-white rounded-3xl border border-gray-100 p-8 space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="h-8 bg-gray-200 rounded-lg w-2/3"></div>
                            <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 p-12">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
                <p className="text-gray-500 mb-6">Đã xảy ra lỗi trong quá trình tải dữ liệu thống kê.</p>
                <button
                    onClick={fetchStats}
                    className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all"
                >
                    Tải lại dữ liệu
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Title */}
            <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Tổng quan hệ thống</h1>
                <p className="text-gray-500 font-medium">Báo cáo tóm tắt tình trạng hoạt động của FPT-Market.</p>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric 1: Revenue */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl hover:shadow-red-50 transition-all transform hover:-translate-y-1">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Tổng doanh thu</span>
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2 truncate">
                        {formatVND(stats.totalRevenue)}
                    </h2>
                    <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Doanh thu từ thanh toán thành công
                    </p>
                </div>

                {/* Metric 2: Products */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl hover:shadow-red-50 transition-all transform hover:-translate-y-1">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Hàng hóa</span>
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">
                        {stats.totalProducts} <span className="text-sm font-medium text-gray-400">sản phẩm</span>
                    </h2>
                    <div className="flex items-center gap-4 text-xs font-bold mt-2">
                        <span className="text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {stats.pendingProducts} Đang duyệt
                        </span>
                        <span className="text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> {stats.approvedProducts} Đã duyệt
                        </span>
                    </div>
                </div>

                {/* Metric 3: Orders */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl hover:shadow-red-50 transition-all transform hover:-translate-y-1">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Giao dịch</span>
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <ShoppingCart className="w-6 h-6" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">
                        {stats.totalOrders} <span className="text-sm font-medium text-gray-400">đơn hàng</span>
                    </h2>
                    <div className="flex items-center gap-4 text-xs font-bold mt-2">
                        <span className="text-blue-500 bg-blue-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {stats.pendingOrders} Chờ duyệt
                        </span>
                        <span className="text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> {stats.completedOrders} Hoàn thành
                        </span>
                    </div>
                </div>
            </div>

            {/* Sub-Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Users Metric */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center gap-6 shadow-sm">
                    <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 flex-shrink-0">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Thành viên hệ thống</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalUsers} người dùng</h3>
                    </div>
                </div>

                {/* Categories Metric */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 flex items-center gap-6 shadow-sm">
                    <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 flex-shrink-0">
                        <Layers className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Danh mục hàng hóa</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalCategories} danh mục</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
