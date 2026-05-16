'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBar() {
    const [keyword, setKeyword] = useState('');
    const router = useRouter();

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim().length >= 2) {
            router.push(`/products?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-xl">
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm giáo trình, thiết bị..."
                className="w-full px-6 py-2.5 pl-12 bg-white text-gray-900 rounded-full border-none focus:ring-2 focus:ring-red-400 outline-none shadow-sm transition-all text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded-full hover:bg-red-700 transition-all"
            >
                Tìm
            </button>
        </form>
    );
}
