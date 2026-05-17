'use client';

import React, { Suspense } from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
    return (
        <AuthLayout>
            <Suspense fallback={
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
                </div>
            }>
                <LoginForm />
            </Suspense>
        </AuthLayout>
    );
}
