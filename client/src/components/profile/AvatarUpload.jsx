import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { userService } from '@/services/userService';
import { Camera, Loader, User } from 'lucide-react';

export default function AvatarUpload({ avatarUrl, onAvatarUpdated }) {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation: Must be image
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file hình ảnh hợp lệ (png, jpg, jpeg)');
            return;
        }

        // Limit size: e.g. 5MB
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước ảnh tối đa là 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const updatedProfile = await userService.uploadAvatar(formData);
            toast.success('Cập nhật ảnh đại diện thành công');
            if (onAvatarUpdated) {
                onAvatarUpdated(updatedProfile.avatarUrl);
            }
        } catch (error) {
            console.error('Failed to upload avatar:', error);
            toast.error(error.message || 'Tải ảnh đại diện lên thất bại');
        } finally {
            setUploading(false);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-red-50 bg-gray-50 flex items-center justify-center shadow-inner">
                {avatarUrl ? (
                    <img 
                        src={avatarUrl} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <User className="w-16 h-16 text-gray-300" />
                )}

                {/* Hover overlay */}
                <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={uploading}
                    className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer disabled:cursor-not-allowed"
                >
                    {uploading ? (
                        <Loader className="w-6 h-6 animate-spin text-white" />
                    ) : (
                        <>
                            <Camera className="w-6 h-6 mb-1 text-white" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white">Thay đổi</span>
                        </>
                    )}
                </button>
            </div>

            {/* Hidden Input file */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />

            <button
                type="button"
                onClick={triggerFileInput}
                disabled={uploading}
                className="px-4 py-2 border border-gray-200 hover:border-red-600 text-gray-700 hover:text-red-600 font-bold text-xs rounded-xl transition-all shadow-sm"
            >
                {uploading ? 'Đang tải lên...' : 'Chọn ảnh mới'}
            </button>
            
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-tighter">
                Định dạng: JPG, PNG, JPEG. Tối đa 5MB.
            </p>
        </div>
    );
}
