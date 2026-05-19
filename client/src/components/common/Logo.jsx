"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Logo({ className = "" }) {
    const [imgError, setImgError] = useState(false);

    return (
        <Link href="/" className={`flex items-center gap-2 group transition-opacity hover:opacity-90 ${className}`}>
            {/* The Badge Container */}
            <div className="flex items-center justify-center bg-white rounded-full shadow-sm flex-shrink-0 w-9 h-9 md:w-11 md:h-11">
                {!imgError ? (
                    <img 
                        src="/brand/logo-icon.png" 
                        alt="FPT-Market Icon" 
                        className="object-contain w-5 h-5 md:w-7 md:h-7" 
                        onError={() => setImgError(true)} 
                    />
                ) : (
                    <span className="text-red-600 font-bold text-lg">F</span>
                )}
            </div>
            
            {/* Brand Text */}
            <span className="font-bold tracking-tight text-[18px] md:text-[24px] text-inherit">
                FPT-MARKET
            </span>
        </Link>
    );
}
