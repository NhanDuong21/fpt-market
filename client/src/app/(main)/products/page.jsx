'use client';

import { useState, useEffect } from 'react';
import productService from '@/services/productService';
import categoryService from '@/services/categoryService';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilter from '@/components/product/ProductFilter';
import ProductSort from '@/components/product/ProductSort';
import Pagination from '@/components/ui/Pagination';

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
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <ProductFilter 
                        categories={categories} 
                        filters={filters} 
                        onFilterChange={handleFilterChange} 
                    />
                </aside>

                {/* Main Content */}
                <main className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Explore Products</h1>
                            <p className="text-gray-500 mt-1">Discover the best deals from FPT students</p>
                        </div>
                        <ProductSort sort={sort} onSortChange={setSort} />
                    </div>

                    <ProductGrid products={products} loading={loading} />
                    
                    <Pagination 
                        currentPage={pagination.page} 
                        totalPages={pagination.totalPages} 
                        onPageChange={handlePageChange} 
                    />
                </main>
            </div>
        </div>
    );
}
