import api from './api';

const productService = {
    getProducts: async (params) => {
        const response = await api.get('/api/products', { params });
        return response.data;
    },

    getProductBySlug: async (slug) => {
        const response = await api.get(`/api/products/${slug}`);
        return response.data;
    },

    getProductById: async (id) => {
        const response = await api.get(`/api/products/id/${id}`);
        return response.data;
    },

    createProduct: async (formData) => {
        const response = await api.post('/api/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateProduct: async (id, formData) => {
        const response = await api.put(`/api/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await api.delete(`/api/products/${id}`);
        return response.data;
    },

    getMyProducts: async (params) => {
        const response = await api.get('/api/products/me', { params });
        return response.data;
    }
};

export default productService;
