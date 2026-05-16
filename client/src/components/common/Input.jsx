'use client';

export default function Input({ 
    label, 
    type = 'text', 
    error, 
    register, 
    name, 
    placeholder, 
    icon: Icon,
    rightIcon: RightIcon,
    onRightIconClick,
    ...props 
}) {
    return (
        <div className="w-full mb-4">
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    {...(register ? register(name) : {})}
                    className={`w-full px-4 py-3 bg-white border ${
                        error ? 'border-red-500' : 'border-gray-200'
                    } rounded-lg outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all text-gray-900 text-sm ${
                        Icon ? 'pl-11' : ''
                    } ${RightIcon ? 'pr-11' : ''}`}
                    {...props}
                />
                {RightIcon && (
                    <button
                        type="button"
                        onClick={onRightIconClick}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <RightIcon className="w-5 h-5" />
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-1.5 text-xs text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                    {error.message}
                </p>
            )}
        </div>
    );
}
