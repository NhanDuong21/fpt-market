import api from './api';

const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/v1/orders', orderData);
    return response.data;
  },

  getMyOrders: async (page = 0, size = 10) => {
    const response = await api.get(`/v1/orders/my?page=${page}&size=${size}`);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/v1/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await api.put(`/v1/orders/${id}/cancel`);
    return response.data;
  }
};

export default orderService;
