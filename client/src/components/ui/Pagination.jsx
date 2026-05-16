export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = [...Array(totalPages).keys()];

    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            <button
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-2 rounded-xl border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                        currentPage === p 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    {p + 1}
                </button>
            ))}

            <button
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-2 rounded-xl border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
}
