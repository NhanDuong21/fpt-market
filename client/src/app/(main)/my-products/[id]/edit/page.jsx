'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import productService from '@/services/productService';
import categoryService from '@/services/categoryService';
import ProductForm from '@/components/product/ProductForm';
import { toast } from 'react-toastify';
import PageContainer from '@/components/layout/PageContainer';

export default function EditProductPage() {
    const router = useRouter();
    const { id } = useParams();
    const [categories, setCategories] = useState([]);
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [catData, prodData] = await Promise.all([
                categoryService.getAllCategories(),
                productService.getProductById(id)
            ]);
            setCategories(catData.data);
            
            const product = prodData.data;
            setInitialData({
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                conditionType: product.conditionType,
                categoryId: product.category?.id.toString(),
            });
        } catch (error) {
            console.error('Failed to fetch data', error);
            toast.error('Không thể tải thông tin sản phẩm');
            router.push('/my-products');
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (formData) => {
        setSubmitting(true);
        try {
            await productService.updateProduct(id, formData);
            toast.success('Cập nhật sản phẩm thành công! Đang chờ phê duyệt lại.');
            router.push('/my-products');
        } catch (error) {
            console.error('Failed to update product', error);
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageContainer 
            title="Chỉnh sửa sản phẩm" 
            description="Lưu ý: Sản phẩm sẽ được gửi lại để phê duyệt sau khi chỉnh sửa"
            className="max-w-4xl"
        >
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                </div>
            ) : (
                <ProductForm 
                    categories={categories} 
                    initialData={initialData}
                    onSubmit={handleSubmit} 
                    loading={submitting} 
                />
            )}
        </PageContainer>
    );
}
