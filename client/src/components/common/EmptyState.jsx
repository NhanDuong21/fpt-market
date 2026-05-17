import React from 'react';
import Link from 'next/link';
import Button from './Button';

const EmptyState = ({ title, description, buttonText, buttonLink, icon }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto my-8">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6 animate-pulse">
        {icon ? (
          icon
        ) : (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )}
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-gray-500 font-medium max-w-md mb-8 leading-relaxed">{description}</p>
      {buttonText && buttonLink && (
        <Link href={buttonLink}>
          <Button variant="primary" size="lg" className="px-8 py-3.5 uppercase tracking-widest font-black text-xs">
            {buttonText}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
