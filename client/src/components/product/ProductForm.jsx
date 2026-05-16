'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';

const productSchema = z.object({
    name: z.string().min(3, "Must be at least 3 characters"),
    description: z.string().min(10, "Must be at least 10 characters"),
    price: z.preprocess((val) => Number(val), z.number().positive("Price must be positive")),
    quantity: z.preprocess((val) => Number(val), z.number().min(1, "Quantity must be at least 1")),
    conditionType: z.enum(['NEW', 'USED']),
    categoryId: z.string().min(1, "Category is required"),
});

export default function ProductForm({ categories, initialData, onSubmit, loading }) {
    const [selectedImages, setSelectedImages] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: initialData || {
            conditionType: 'NEW',
        },
    });

    const handleImageChange = (e) => {
        if (e.target.files) {
            setSelectedImages(Array.from(e.target.files));
        }
    };

    const onFormSubmit = (data) => {
        const formData = new FormData();
        formData.append('product', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        
        selectedImages.forEach((image) => {
            formData.append('images', image);
        });

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                    <input
                        {...register('name')}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                        {...register('categoryId')}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.categoryId ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none`}
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.categoryId && <p className="mt-1 text-xs text-red-500">{errors.categoryId.message}</p>}
                </div>

                {/* Condition */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                    <select
                        {...register('conditionType')}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.conditionType ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none`}
                    >
                        <option value="NEW">New</option>
                        <option value="USED">Used</option>
                    </select>
                    {errors.conditionType && <p className="mt-1 text-xs text-red-500">{errors.conditionType.message}</p>}
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register('price')}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.price ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    />
                    {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
                </div>

                {/* Quantity */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                    <input
                        type="number"
                        {...register('quantity')}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.quantity ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    />
                    {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity.message}</p>}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                        rows="4"
                        {...register('description')}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                    ></textarea>
                    {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
                </div>

                {/* Images */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                        {selectedImages.map((img, i) => (
                            <div key={i} className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                                {img.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            >
                {loading ? 'Processing...' : initialData ? 'Update Product' : 'Create Product'}
            </button>
        </form>
    );
}
