import api from './api';

const sellerOrderService = {
  getSellerOrders: async (page = 0, size = 10) => {
    const response = await api.get(`/api/seller/orders?page=${page}&size=${size}`);
    return response.data;
  },

  getSellerOrderById: async (id) => {
    const response = await api.get(`/api/seller/orders/${id}`);
    return response.data;
  },

  confirmOrder: async (id) => {
    const response = await api.put(`/api/seller/orders/${id}/confirm`);
    return response.data;
  },

  shipOrder: async (id) => {
    const response = await api.put(`/api/seller/orders/${id}/ship`);
    return response.data;
  },

  completeOrder: async (id) => {
    const response = await api.put(`/api/seller/orders/${id}/complete`);
    return response.data;
  }
};

export default sellerOrderService;
