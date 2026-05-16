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
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    
    const redirectUrl = searchParams.get('redirect') || '/';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        const success = await login(data.email, data.password);
        if (success) {
            router.push(redirectUrl);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Đăng nhập</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Mật khẩu"
                    placeholder="Mật khẩu của bạn"
                    register={register}
                    error={errors.password}
                    icon={Lock}
                    rightIcon={showPassword ? EyeOff : Eye}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                />

                <div className="flex justify-end mb-6">
                    <Link href="/forgot-password" virtual className="text-xs text-blue-600 hover:underline">
                        Quên mật khẩu?
                    </Link>
                </div>

                <Button type="submit" loading={isSubmitting}>
                    ĐĂNG NHẬP
                </Button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">HOẶC</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="social" className="text-xs">
                        <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4 mr-2" alt="" /> Google
                    </Button>
                    <Button variant="social" className="text-xs">
                        <img src="https://www.svgrepo.com/show/157818/facebook.svg" className="w-4 h-4 mr-2" alt="" /> Facebook
                    </Button>
                </div>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Bạn mới biết đến FPT-Market?{' '}
                    <Link href="/register" className="text-red-600 font-bold hover:underline">
                        Đăng ký
                    </Link>
                </p>
            </form>
        </div>
    );
}
