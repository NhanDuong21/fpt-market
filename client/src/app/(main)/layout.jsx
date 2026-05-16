'use client';

import Header from '@/components/layout/Header';
import MainNavigation from '@/components/layout/MainNavigation';
import Footer from '@/components/layout/Footer';

export default function MainLayout({ children }) {
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
