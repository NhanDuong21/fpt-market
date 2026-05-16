import api from './api';

const productService = {
    getProducts: async (params) => {
        const response = await api.get('/products', { params });
        return response.data;
    },

    getProductBySlug: async (slug) => {
        const response = await api.get(`/products/${slug}`);
        return response.data;
    },

    createProduct: async (formData) => {
        const response = await api.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateProduct: async (id, formData) => {
        const response = await api.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

    getMyProducts: async (params) => {
        const response = await api.get('/products/me', { params });
        return response.data;
    }
};

export default productService;
