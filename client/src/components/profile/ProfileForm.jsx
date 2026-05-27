import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { userService } from '@/services/userService';
import { User, Mail, Phone, Shield, Info, Loader } from 'lucide-react';

export default function ProfileForm({ profile, onProfileUpdated }) {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (profile) {
            setFullName(profile.fullName || '');
            setPhone(profile.phone || '');
        }
    }, [profile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fullName.trim()) {
            toast.error('Họ và tên không được để trống');
            return;
        }

        setLoading(true);
        try {
            const updatedProfile = await userService.updateProfile({
                fullName: fullName.trim(),
                phone: phone.trim()
            });
            toast.success('Cập nhật thông tin cá nhân thành công');
            if (onProfileUpdated) {
                onProfileUpdated(updatedProfile);
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error(error.message || 'Cập nhật thông tin thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-red-600" /> Thông tin cá nhân
                </h3>
                <p className="text-sm text-gray-500 mb-6">Cập nhật họ tên và số điện thoại liên lạc của bạn.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Họ và tên</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={loading}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-red-500 focus:bg-white transition-all text-sm font-semibold text-gray-900 outline-none"
                            placeholder="Nhập họ tên"
                            required
                        />
                        <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Số điện thoại</label>
                    <div className="relative">
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={loading}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-red-500 focus:bg-white transition-all text-sm font-semibold text-gray-900 outline-none"
                            placeholder="Nhập số điện thoại"
                        />
                        <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    </div>
                </div>
            </div>

            {/* Read-only system configurations */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-gray-400" /> Thông tin hệ thống (Không thể thay đổi)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Email */}
                    <div>
                        <span className="block text-xs font-medium text-gray-400 mb-1">Địa chỉ Email</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="truncate">{profile?.email}</span>
                        </div>
                    </div>

                    {/* Role */}
                    <div>
                        <span className="block text-xs font-medium text-gray-400 mb-1">Vai trò</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                            <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="bg-red-50 text-red-600 px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider">
                                {profile?.role}
                            </span>
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <span className="block text-xs font-medium text-gray-400 mb-1">Trạng thái tài khoản</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-green-600 uppercase tracking-wider text-xs font-black">
                                {profile?.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:bg-red-400 transition-all cursor-pointer shadow-sm hover:shadow-red-100"
                >
                    {loading ? (
                        <>
                            <Loader className="w-4 h-4 animate-spin" /> Đang cập nhật...
                        </>
                    ) : (
                        'Lưu thay đổi'
                    )}
                </button>
            </div>
        </form>
    );
}
