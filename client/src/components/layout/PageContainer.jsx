import React from 'react';

const PageContainer = ({ children, title, description, actions, className = '' }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${className}`}>
      {(title || description || actions) && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            {title && <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">{title}</h1>}
            {description && <p className="text-gray-500 font-medium text-lg">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-4">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default PageContainer;
