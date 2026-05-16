'use client';

export default function ProductSort({ sort, onSortChange }) {
    const options = [
        { label: 'Newest First', value: 'id,desc' },
        { label: 'Oldest First', value: 'id,asc' },
        { label: 'Price: Low to High', value: 'price,asc' },
        { label: 'Price: High to Low', value: 'price,desc' },
    ];

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Sort by:</span>
            <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-sm font-semibold text-gray-900 outline-none cursor-pointer hover:text-blue-600 transition-colors"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}
