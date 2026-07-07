// src/services/paymentService.js

import api from './api';

class PaymentService {
  
  async initializePayment(orderId) {
    return await api.post('/payments/initialize', { orderId });
  }

  async verifyPayment(reference) {
    return await api.get(`/payments/verify/${reference}`);
  }

  async getPayment(reference) {
    return await api.get(`/payments/${reference}`);
  }

  async getMyPayments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/payments/my-payments?${queryString}`);
  }

  async getAllPayments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/payments/admin/all?${queryString}`);
  }
}

export default new PaymentService();