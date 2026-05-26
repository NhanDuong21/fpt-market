'use client';

import Header from '@/components/layout/Header';
import MainNavigation from '@/components/layout/MainNavigation';
import Footer from '@/components/layout/Footer';
import { usePathname } from 'next/navigation';

export default function MainLayout({ children }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    if (isAdminRoute) {
        return (
            <main className="flex-grow flex flex-col min-h-screen">
                {children}
            </main>
        );
    }

    return (
        <>
            <Header />
            <MainNavigation />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </>
    );
}
