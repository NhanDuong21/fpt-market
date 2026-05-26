import api from './api';

const adminService = {
    // Categories
    createCategory: async (data) => {
        const response = await api.post('/api/admin/categories', data);
        return response.data;
    },

    updateCategory: async (id, data) => {
        const response = await api.put(`/api/admin/categories/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/api/admin/categories/${id}`);
        return response.data;
    },

    // Products
    getAllProducts: async (params) => {
        const response = await api.get('/api/admin/products', { params });
        return response.data;
    },

    approveProduct: async (id) => {
        const response = await api.put(`/api/admin/products/${id}/approve`);
        return response.data;
    },

    rejectProduct: async (id, data) => {
        const response = await api.put(`/api/admin/products/${id}/reject`, data);
        return response.data;
    },

    hideProduct: async (id) => {
        const response = await api.put(`/api/admin/products/${id}/hide`);
        return response.data;
    },

    // Orders
    getAllOrders: async (params) => {
        const response = await api.get('/api/admin/orders', { params });
        return response.data;
    },

    // Dashboard Stats
    getDashboardStats: async () => {
        const response = await api.get('/api/v1/admin/dashboard');
        return response.data;
    }
};

export default adminService;
