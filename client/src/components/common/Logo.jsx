"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Logo({ className = "" }) {
    const [imgError, setImgError] = useState(false);

    return (
        <Link href="/" className={`flex items-center ${className}`}>
            {!imgError ? (
                <img 
                    src="/brand/logo-group.png" 
                    alt="FPT-Market" 
                    className="h-8 md:h-10 w-auto object-contain" 
                    onError={() => setImgError(true)} 
                />
            ) : (
                <span className="text-xl md:text-2xl font-bold tracking-tight text-inherit">FPT-MARKET</span>
            )}
        </Link>
    );
}
