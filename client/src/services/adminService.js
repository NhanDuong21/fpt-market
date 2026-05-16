import api from './api';

const adminService = {
    // Categories
    createCategory: async (data) => {
        const response = await api.post('/admin/categories', data);
        return response.data;
    },

    updateCategory: async (id, data) => {
        const response = await api.put(`/admin/categories/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/admin/categories/${id}`);
        return response.data;
    },

    // Products
    getAllProducts: async (params) => {
        const response = await api.get('/admin/products', { params });
        return response.data;
    },

    approveProduct: async (id) => {
        const response = await api.put(`/admin/products/${id}/approve`);
        return response.data;
    },

    rejectProduct: async (id, data) => {
        const response = await api.put(`/admin/products/${id}/reject`, data);
        return response.data;
    },

    hideProduct: async (id) => {
        const response = await api.put(`/admin/products/${id}/hide`);
        return response.data;
    }
};

export default adminService;
