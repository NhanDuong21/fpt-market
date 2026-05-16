'use client';

import React, { useState } from 'react';

const ProductImageGallery = ({ images, productName }) => {
  const [activeImage, setActiveImage] = useState(images && images.length > 0 ? images[0] : '');

  const fallbackImage = 'https://via.placeholder.com/800x800?text=Image+Not+Found';

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = fallbackImage;
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
        <img src={fallbackImage} alt="No images available" className="w-1/2 opacity-20" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-white border-4 border-white shadow-2xl shadow-gray-200 relative group">
        <img 
          src={activeImage || fallbackImage} 
          alt={productName}
          onError={handleImageError}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(img)}
            className={`flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden border-4 transition-all duration-300 ${
              activeImage === img ? 'border-red-600 shadow-xl scale-95' : 'border-white shadow-sm opacity-60 hover:opacity-100 hover:scale-105'
            }`}
          >
            <img 
              src={img} 
              alt={`${productName} view ${i + 1}`} 
              onError={handleImageError}
              className="w-full h-full object-cover" 
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
