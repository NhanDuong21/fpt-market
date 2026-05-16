'use client';

import { useState, useEffect } from 'react';
import productService from '@/services/productService';
import categoryService from '@/services/categoryService';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilter from '@/components/product/ProductFilter';
import ProductSort from '@/components/product/ProductSort';
import Pagination from '@/components/ui/Pagination';
import PageContainer from '@/components/layout/PageContainer';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 0, totalPages: 0 });
    const [sort, setSort] = useState('id,desc');
    const [filters, setFilters] = useState({
        keyword: '',
        categoryId: '',
        minPrice: '',
        maxPrice: '',
        condition: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filters, sort, pagination.page]);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data.data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                ...filters,
                sort,
                page: pagination.page,
                size: 12,
            };
            const data = await productService.getProducts(params);
            setProducts(data.data.content);
            setPagination(prev => ({ ...prev, totalPages: data.data.totalPages }));
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 0 }));
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <PageContainer>
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Filter */}
                <aside className="w-full lg:w-72 flex-shrink-0">
                    <div className="sticky top-24">
                        <ProductFilter 
                            categories={categories} 
                            filters={filters} 
                            onFilterChange={handleFilterChange} 
                        />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Khám phá sản phẩm</h1>
                            <p className="text-gray-500 font-medium text-lg">Tìm kiếm những món đồ hời nhất từ sinh viên FPT</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sắp xếp:</span>
                            <ProductSort sort={sort} onSortChange={setSort} />
                        </div>
                    </div>

                    <ProductGrid products={products} loading={loading} />
                    
                    {!loading && products.length > 0 && (
                        <div className="mt-16">
                            <Pagination 
                                currentPage={pagination.page} 
                                totalPages={pagination.totalPages} 
                                onPageChange={handlePageChange} 
                            />
                        </div>
                    )}
                </main>
            </div>
        </PageContainer>
    );
}
