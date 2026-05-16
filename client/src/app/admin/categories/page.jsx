'use client';

import { useState, useEffect } from 'react';
import adminService from '@/services/adminService';
import categoryService from '@/services/categoryService';
import { toast } from 'react-toastify';
import CategoryForm from '@/components/admin/CategoryForm';
import PageContainer from '@/components/layout/PageContainer';
import Button from '@/components/common/Button';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data.data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await adminService.updateCategory(editingCategory.id, formData);
                toast.success('Cập nhật danh mục thành công');
            } else {
                await adminService.createCategory(formData);
                toast.success('Tạo danh mục thành công');
            }
            setIsModalOpen(false);
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
            fetchCategories();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleEdit = (cat) => {
        setEditingCategory(cat);
        setFormData({ name: cat.name, description: cat.description || '' });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này? Thao tác này có thể thất bại nếu có sản phẩm đang thuộc danh mục này.')) return;
        try {
            await adminService.deleteCategory(id);
            toast.success('Xóa danh mục thành công');
            fetchCategories();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <PageContainer 
            title="Quản lý Danh mục" 
            description="Quản lý các danh mục sản phẩm trong hệ thống"
            actions={
                <Button 
                    onClick={() => {
                        setEditingCategory(null);
                        setFormData({ name: '', description: '' });
                        setIsModalOpen(true);
                    }}
                    variant="primary"
                    className="gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm danh mục
                </Button>
            }
        >
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl hover:shadow-red-50 transition-all transform hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleEdit(cat)}
                                        className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                        title="Chỉnh sửa"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(cat.id)}
                                        className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                        title="Xóa"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-3">{cat.name}</h3>
                            <p className="text-gray-500 font-medium line-clamp-2 mb-6 leading-relaxed">
                                {cat.description || 'Chưa có mô tả cho danh mục này.'}
                            </p>
                            <div className="mt-auto flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                    {cat.slug}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-6 overflow-y-auto">
                    <div className="w-full max-w-lg animate-in fade-in zoom-in duration-300">
                        <CategoryForm 
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
                            onCancel={() => setIsModalOpen(false)}
                            isEditing={!!editingCategory}
                        />
                    </div>
                </div>
            )}
        </PageContainer>
    );
}
