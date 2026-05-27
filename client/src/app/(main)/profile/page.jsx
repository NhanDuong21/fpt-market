'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import ProfileForm from '@/components/profile/ProfileForm';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import AvatarUpload from '@/components/profile/AvatarUpload';
import PageContainer from '@/components/layout/PageContainer';
import { toast } from 'react-toastify';
import { Calendar, Loader } from 'lucide-react';

export default function ProfilePage() {
    const { user, loading: authLoading, updateUser } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.replace('/login?redirect=/profile');
            } else {
                fetchProfile();
            }
        }
    }, [user, authLoading, router]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const data = await userService.getProfile();
            setProfile(data);
        } catch (error) {
            console.error('Failed to fetch profile details:', error);
            toast.error('Không thể tải thông tin tài khoản');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdated = (updatedProfile) => {
        setProfile(updatedProfile);
        // Sync context user
        updateUser({
            ...user,
            fullName: updatedProfile.fullName,
            phone: updatedProfile.phone,
            avatarUrl: updatedProfile.avatarUrl
        });
    };

    const handleAvatarUpdated = (newAvatarUrl) => {
        setProfile(prev => prev ? { ...prev, avatarUrl: newAvatarUrl } : null);
        // Sync context user
        updateUser({
            ...user,
            avatarUrl: newAvatarUrl
        });
    };

    if (authLoading || (loading && !profile)) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl p-12">
                <Loader className="w-12 h-12 text-red-600 animate-spin mb-4" />
                <p className="text-gray-500 font-bold text-sm">Đang tải thông tin cá nhân...</p>
            </div>
        );
    }

    if (!user) {
        return null; // Redirecting
    }

    return (
        <PageContainer 
            title="Quản lý tài khoản" 
            description="Cập nhật thông tin cá nhân, ảnh đại diện và mật khẩu bảo mật của bạn"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Overview */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center flex flex-col items-center">
                        <AvatarUpload 
                            avatarUrl={profile?.avatarUrl} 
                            onAvatarUpdated={handleAvatarUpdated} 
                        />
                        <h2 className="text-xl font-black text-gray-900 mt-6">{profile?.fullName}</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">{profile?.role}</p>

                        <div className="w-full border-t border-gray-100 my-6 pt-6 space-y-3 text-left">
                            <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                                <span>Thành viên từ:</span>
                                <span className="text-gray-900 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                                <span>Trạng thái:</span>
                                <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
                                    {profile?.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Profile details & Security forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Form 1: General Info */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <ProfileForm 
                            profile={profile} 
                            onProfileUpdated={handleProfileUpdated} 
                        />
                    </div>

                    {/* Form 2: Password change */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                        <ChangePasswordForm />
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
