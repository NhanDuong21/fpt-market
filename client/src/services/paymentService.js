import api from './api';

const paymentService = {
  vnpayCallback: async (queryString) => {
    // Both api routes are supported. Let's call /api/payments/vnpay/callback
    const response = await api.get(`/api/payments/vnpay/callback?${queryString}`);
    return response.data;
  },

  getPaymentByOrderId: async (orderId) => {
    const response = await api.get(`/api/payments/order/${orderId}`);
    return response.data;
  }
};

export default paymentService;
