'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const isAdmin = user?.role === 'ADMIN' || 
                    user?.role === 'ROLE_ADMIN' || 
                    user?.roles?.includes('ADMIN') || 
                    user?.roles?.includes('ROLE_ADMIN');

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (!isAdmin) {
                router.push('/unauthorized');
            }
        }
    }, [user, loading, isAdmin, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* You can add a specific Admin Sidebar/Navbar here later */}
            <main>{children}</main>
        </div>
    );
}
