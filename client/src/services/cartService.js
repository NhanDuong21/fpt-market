import api from './api';

const cartService = {
  getCart: async () => {
    const response = await api.get('/api/cart');
    return response.data.data;
  },

  addItem: async (productId, quantity) => {
    const response = await api.post('/api/cart/items', { productId, quantity });
    return response.data.data;
  },
  addToCart: async (productId, quantity) => {
    return cartService.addItem(productId, quantity);
  },

  updateItem: async (itemId, quantity) => {
    const response = await api.put(`/api/cart/items/${itemId}?quantity=${quantity}`);
    return response.data.data;
  },
  updateCartItem: async (itemId, quantity) => {
    return cartService.updateItem(itemId, quantity);
  },

  removeItem: async (itemId) => {
    const response = await api.delete(`/api/cart/items/${itemId}`);
    return response.data.data;
  },
  removeCartItem: async (itemId) => {
    return cartService.removeItem(itemId);
  },

  clearCart: async () => {
    const response = await api.delete('/api/cart/clear');
    return response.data.data;
  }
};

export default cartService;
