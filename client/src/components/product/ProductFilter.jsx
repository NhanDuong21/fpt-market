'use client';

export default function ProductFilter({ categories, filters, onFilterChange }) {
    const conditions = ['NEW', 'USED'];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>
            
            {/* Search */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Keyword..."
                        value={filters.keyword || ''}
                        onChange={(e) => onFilterChange('keyword', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 transition-all outline-none"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Category */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                    value={filters.categoryId || ''}
                    onChange={(e) => onFilterChange('categoryId', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice || ''}
                        onChange={(e) => onFilterChange('minPrice', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 transition-all outline-none"
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice || ''}
                        onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 transition-all outline-none"
                    />
                </div>
            </div>

            {/* Condition */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                <div className="flex flex-wrap gap-2">
                    {conditions.map((cond) => (
                        <button
                            key={cond}
                            onClick={() => onFilterChange('condition', filters.condition === cond ? '' : cond)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                filters.condition === cond 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {cond}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={() => {
                    onFilterChange('keyword', '');
                    onFilterChange('categoryId', '');
                    onFilterChange('minPrice', '');
                    onFilterChange('maxPrice', '');
                    onFilterChange('condition', '');
                }}
                className="w-full py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
                Reset All
            </button>
        </div>
    );
}
