import api from './api';

const cartService = {
  getCart: async () => {
    const response = await api.get('/v1/cart');
    return response.data;
  },

  addItem: async (productId, quantity) => {
    const response = await api.post('/v1/cart/items', { productId, quantity });
    return response.data;
  },

  updateItem: async (itemId, quantity) => {
    const response = await api.put(`/v1/cart/items/${itemId}?quantity=${quantity}`);
    return response.data;
  },

  removeItem: async (itemId) => {
    const response = await api.delete(`/v1/cart/items/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/v1/cart/clear');
    return response.data;
  }
};

export default cartService;
