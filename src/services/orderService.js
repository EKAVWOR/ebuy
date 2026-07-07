// src/services/orderService.js

import api from './api';

class OrderService {
  
  /**
   * Create new order from cart (Student)
   */
  async createOrder(orderData) {
    return await api.post('/orders', orderData);
  }

  /**
   * Get student's own orders (list)
   */
  async getMyOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/orders/my-orders?${queryString}`);
  }

  /**
   * Get single order (basic info)
   */
  async getOrder(id) {
    return await api.get(`/orders/${id}`);
  }

  /**
   * ✅ NEW - Get full order details with populated fields
   * Used by both vendor and buyer detail pages
   */
  async getOrderDetails(id) {
    return await api.get(`/orders/${id}/details`);
  }

  /**
   * Get vendor's orders (only their items)
   */
  async getVendorOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/orders/vendor/my-orders?${queryString}`);
  }

  /**
   * Update order status (Vendor: processing/shipped only, Admin: any)
   */
  async updateOrderStatus(id, status, note = '') {
    return await api.put(`/orders/${id}/status`, { status, note });
  }

  /**
   * ✅ NEW - Confirm delivery (Buyer only)
   * Releases payment to vendor
   */
  async confirmDelivery(id, note = '') {
    return await api.put(`/orders/${id}/confirm-delivery`, { note });
  }

  /**
   * Cancel order
   */
  async cancelOrder(id, reason) {
    return await api.put(`/orders/${id}/cancel`, { reason });
  }

  /**
   * Get order statistics (Vendor/Admin)
   */
  async getOrderStatistics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/orders/statistics?${queryString}`);
  }

  /**
   * Get all orders (Admin only)
   */
  async getAllOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/orders/admin/all?${queryString}`);
  }
}

export default new OrderService();