import api from './api';

const categoryService = {
    getAllCategories: async () => {
        const response = await api.get('/api/categories');
        return response.data;
    },

    getCategoryBySlug: async (slug) => {
        const response = await api.get(`/api/categories/${slug}`);
        return response.data;
    }
};

export default categoryService;
