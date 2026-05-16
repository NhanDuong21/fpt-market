'use client';

import AuthHeader from './AuthHeader';
import AuthBrandPanel from './AuthBrandPanel';

export default function AuthLayout({ children, title }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <AuthHeader title={title} />
            
            <main className="flex-grow relative flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-600 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col md:flex-row items-center justify-center">
                    <AuthBrandPanel />
                    
                    <div className="w-full max-w-[420px] animate-in fade-in zoom-in duration-500">
                        {children}
                    </div>
                </div>
            </main>
            
            <footer className="bg-white py-12 text-center border-t border-gray-100">
                <p className="text-gray-400 text-xs">
                    © {new Date().getFullYear()} FPT-Market. Chăm sóc bởi sinh viên, dành cho sinh viên.
                </p>
            </footer>
        </div>
    );
}
