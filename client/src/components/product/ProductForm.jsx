'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';

const productSchema = z.object({
    name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
    description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
    price: z.preprocess((val) => Number(val), z.number().positive("Giá phải lớn hơn 0")),
    quantity: z.preprocess((val) => Number(val), z.number().min(1, "Số lượng ít nhất là 1")),
    conditionType: z.enum(['NEW', 'USED']),
    categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
});

export default function ProductForm({ categories, initialData, onSubmit, loading }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (initialData?.images) {
            setPreviews(initialData.images);
        }
    }, [initialData]);

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

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
            if (!isValidSize) alert(`File ${file.name} quá lớn (tối đa 10MB)`);
            return isValidSize;
        });

        const isFirstUpload = selectedFiles.length === 0;
        
        setSelectedFiles(prev => {
            if (isFirstUpload && initialData?.images) {
                return validFiles;
            }
            return [...prev, ...validFiles];
        });

        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setPreviews(prev => {
            if (isFirstUpload && initialData?.images) {
                return newPreviews;
            }
            return [...prev, ...newPreviews];
        });
    };

    const removeFile = (index) => {
        // If it's a blob url, revoke it to avoid memory leak
        if (previews[index]?.startsWith('blob:')) {
            URL.revokeObjectURL(previews[index]);
        }
        
        const isFromFiles = selectedFiles.length > 0;
        if (isFromFiles) {
            // Find index inside selectedFiles. Since previews could have started from initialData.images, 
            // the index inside selectedFiles matches index if overwritten, or we can just filter
            setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        }
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const onFormSubmit = (data) => {
        if (!initialData && selectedFiles.length === 0) {
            alert('Vui lòng chọn ít nhất một hình ảnh');
            return;
        }

        const formData = new FormData();
        // The backend expects @RequestPart("request") as application/json
        const requestBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        formData.append('request', requestBlob);
        
        selectedFiles.forEach((file) => {
            formData.append('images', file);
        });

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Tên sản phẩm</label>
                        <input
                            {...register('name')}
                            placeholder="Ví dụ: Laptop Dell XPS 13"
                            className={`w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none ${
                                errors.name ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50 focus:border-red-600 focus:bg-white'
                            }`}
                        />
                        {errors.name && <p className="mt-2 text-xs font-bold text-red-600 uppercase tracking-wider">{errors.name.message}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Danh mục</label>
                        <select
                            {...register('categoryId')}
                            className={`w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none appearance-none ${
                                errors.categoryId ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50 focus:border-red-600 focus:bg-white'
                            }`}
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="mt-2 text-xs font-bold text-red-600 uppercase tracking-wider">{errors.categoryId.message}</p>}
                    </div>

                    {/* Condition */}
                    <div>
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Tình trạng</label>
                        <select
                            {...register('conditionType')}
                            className="w-full px-6 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:border-red-600 focus:bg-white transition-all outline-none appearance-none"
                        >
                            <option value="NEW">Mới</option>
                            <option value="USED">Đã sử dụng</option>
                        </select>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Giá bán (đ)</label>
                        <input
                            type="number"
                            {...register('price')}
                            placeholder="0"
                            className={`w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none ${
                                errors.price ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50 focus:border-red-600 focus:bg-white'
                            }`}
                        />
                        {errors.price && <p className="mt-2 text-xs font-bold text-red-600 uppercase tracking-wider">{errors.price.message}</p>}
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Số lượng</label>
                        <input
                            type="number"
                            {...register('quantity')}
                            placeholder="1"
                            className={`w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none ${
                                errors.quantity ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50 focus:border-red-600 focus:bg-white'
                            }`}
                        />
                        {errors.quantity && <p className="mt-2 text-xs font-bold text-red-600 uppercase tracking-wider">{errors.quantity.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Mô tả chi tiết</label>
                        <textarea
                            rows="5"
                            {...register('description')}
                            placeholder="Mô tả kỹ về tình trạng, cấu hình, thời gian đã sử dụng..."
                            className={`w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none resize-none ${
                                errors.description ? 'border-red-200 bg-red-50' : 'border-gray-50 bg-gray-50 focus:border-red-600 focus:bg-white'
                            }`}
                        ></textarea>
                        {errors.description && <p className="mt-2 text-xs font-bold text-red-600 uppercase tracking-wider">{errors.description.message}</p>}
                    </div>
                </div>
            </div>

            {/* Image Upload Area */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Hình ảnh sản phẩm</label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative aspect-square group rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-50">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                    
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-2xl hover:border-red-600 hover:bg-red-50 transition-all text-gray-400 hover:text-red-600 group"
                    >
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">Thêm ảnh</span>
                    </button>
                </div>
                
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
                
                <p className="mt-6 text-xs text-gray-400 font-medium">
                    * Hỗ trợ JPG, PNG, WEBP. Tối đa 10MB/file. Chọn ít nhất 1 ảnh.
                </p>
            </div>

            <Button
                type="submit"
                variant="primary"
                size="xl"
                loading={loading}
                className="w-full py-6 text-xl rounded-3xl"
            >
                {initialData ? 'Cập nhật sản phẩm' : 'Đăng bán ngay'}
            </Button>
        </form>
    );
}
