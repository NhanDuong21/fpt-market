import api from './api';

const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/api/orders', orderData);
    return response.data;
  },

  getMyOrders: async (page = 0, size = 10) => {
    const response = await api.get(`/api/orders/my?page=${page}&size=${size}`);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/api/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await api.put(`/api/orders/${id}/cancel`);
    return response.data;
  }
};

export default orderService;
