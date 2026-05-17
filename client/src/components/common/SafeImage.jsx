import React, { useState, useEffect } from 'react';

const SafeImage = ({ src, alt, className = '', ...props }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset error state if src changes
    setHasError(false);
  }, [src]);

  const fallbackPlaceholder = (
    <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-red-600 to-red-800 text-white font-black uppercase tracking-widest text-center select-none ${className}`}>
      <span className="text-sm">FPT-Market</span>
      <span className="text-[10px] opacity-75 font-medium mt-1">No Image</span>
    </div>
  );

  if (hasError || !src) {
    return fallbackPlaceholder;
  }

  return (
    <img
      src={src}
      alt={alt || 'Product Image'}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

export default SafeImage;
