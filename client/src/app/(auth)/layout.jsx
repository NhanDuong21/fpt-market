'use client';

import AuthHeader from '@/components/auth/AuthHeader';

export default function AuthLayout({ children }) {
    return (
        <>
            <AuthHeader />
            <main className="flex-grow flex flex-col">
                {children}
            </main>
        </>
    );
}
