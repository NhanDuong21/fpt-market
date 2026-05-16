'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import productService from '@/services/productService';
import categoryService from '@/services/categoryService';
import ProductForm from '@/components/product/ProductForm';
import { toast } from 'react-toastify';
import PageContainer from '@/components/layout/PageContainer';
import Button from '@/components/common/Button';

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
            toast.success('Đăng sản phẩm thành công! Vui lòng chờ quản trị viên phê duyệt.');
            router.push('/my-products');
        } catch (error) {
            console.error('Failed to create product', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer 
            title="Đăng sản phẩm" 
            description="Cung cấp đầy đủ thông tin để sản phẩm sớm được phê duyệt"
            className="max-w-4xl"
        >
            <ProductForm 
                categories={categories} 
                onSubmit={handleSubmit} 
                loading={loading} 
            />
        </PageContainer>
    );
}
