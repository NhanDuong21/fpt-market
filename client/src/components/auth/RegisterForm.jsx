'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

const registerSchema = z.object({
    fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().optional().refine(val => !val || val.length >= 10, {
        message: 'Số điện thoại không hợp lệ'
    }),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

export default function RegisterForm() {
    const { register: registerUser } = useAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        const success = await registerUser(data);
        if (success) {
            router.push('/login');
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Đăng ký</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    name="fullName"
                    label="Họ và tên"
                    placeholder="Nguyễn Văn A"
                    register={register}
                    error={errors.fullName}
                    icon={User}
                />

                <Input
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="Email của bạn"
                    register={register}
                    error={errors.email}
                    icon={Mail}
                />

                <Input
                    name="phone"
                    label="Số điện thoại"
                    placeholder="09xx xxx xxx"
                    register={register}
                    error={errors.phone}
                    icon={Phone}
                />
                
                <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Mật khẩu"
                    placeholder="Tối thiểu 6 ký tự"
                    register={register}
                    error={errors.password}
                    icon={Lock}
                    rightIcon={showPassword ? EyeOff : Eye}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                />

                <Input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    label="Xác nhận mật khẩu"
                    placeholder="Nhập lại mật khẩu"
                    register={register}
                    error={errors.confirmPassword}
                    icon={Lock}
                />

                <Button type="submit" loading={isSubmitting} className="mt-6">
                    ĐĂNG KÝ
                </Button>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Bạn đã có tài khoản?{' '}
                    <Link href="/login" className="text-red-600 font-bold hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </form>
        </div>
    );
}
