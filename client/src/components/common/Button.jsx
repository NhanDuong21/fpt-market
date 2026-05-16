'use client';

export default function Button({ 
    children, 
    type = 'button', 
    variant = 'primary', 
    loading = false, 
    disabled = false, 
    fullWidth = true,
    className = '',
    ...props 
}) {
    const variants = {
        primary: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200',
        outline: 'bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-50',
        secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
        social: 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm'
    };

    return (
        <button
            type={type}
            disabled={loading || disabled}
            className={`
                flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100
                ${variants[variant]}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
            {...props}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
                children
            )}
        </button>
    );
}
