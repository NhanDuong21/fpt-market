'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import productService from '@/services/productService';
import categoryService from '@/services/categoryService';
import ProductForm from '@/components/product/ProductForm';
import { toast } from 'react-toastify';

export default function NewProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data.data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            await productService.createProduct(formData);
            toast.success('Product submitted successfully! Waiting for admin approval.');
            router.push('/my-products');
        } catch (error) {
            console.error('Failed to create product', error);
            toast.error(error.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900">Post New Product</h1>
                <p className="text-gray-500 mt-1">Fill in the details to list your product for sale</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <ProductForm 
                    categories={categories} 
                    onSubmit={handleSubmit} 
                    loading={loading} 
                />
            </div>
        </div>
    );
}
