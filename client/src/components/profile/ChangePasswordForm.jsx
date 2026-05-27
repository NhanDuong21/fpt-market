import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { userService } from '@/services/userService';
import { Lock, Eye, EyeOff, Loader, ShieldAlert } from 'lucide-react';

export default function ChangePasswordForm() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Password visibility states
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!oldPassword) {
            toast.error('Vui lòng nhập mật khẩu hiện tại');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không trùng khớp');
            return;
        }

        if (oldPassword === newPassword) {
            toast.error('Mật khẩu mới không được trùng với mật khẩu hiện tại');
            return;
        }

        setLoading(true);
        try {
            await userService.changePassword({
                oldPassword,
                newPassword,
                confirmPassword
            });
            toast.success('Đổi mật khẩu thành công');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Failed to change password:', error);
            toast.error(error.message || 'Thay đổi mật khẩu thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-600" /> Đổi mật khẩu
                </h3>
                <p className="text-sm text-gray-500 mb-6">Hãy sử dụng mật khẩu mạnh để bảo mật tài khoản của bạn.</p>
            </div>

            <div className="space-y-4">
                {/* Old Password */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mật khẩu hiện tại</label>
                    <div className="relative">
                        <input
                            type={showOld ? 'text' : 'password'}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            disabled={loading}
                            className="w-full pl-11 pr-12 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-red-500 focus:bg-white transition-all text-sm font-semibold text-gray-900 outline-none"
                            placeholder="Nhập mật khẩu hiện tại"
                            required
                        />
                        <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                        <button
                            type="button"
                            onClick={() => setShowOld(!showOld)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mật khẩu mới</label>
                    <div className="relative">
                        <input
                            type={showNew ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={loading}
                            className="w-full pl-11 pr-12 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-red-500 focus:bg-white transition-all text-sm font-semibold text-gray-900 outline-none"
                            placeholder="Ít nhất 6 ký tự"
                            required
                        />
                        <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Xác nhận mật khẩu mới</label>
                    <div className="relative">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                            className="w-full pl-11 pr-12 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-red-500 focus:bg-white transition-all text-sm font-semibold text-gray-900 outline-none"
                            placeholder="Nhập lại mật khẩu mới"
                            required
                        />
                        <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
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
                        'Đổi mật khẩu'
                    )}
                </button>
            </div>
        </form>
    );
}
