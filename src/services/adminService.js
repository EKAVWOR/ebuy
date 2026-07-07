// src/services/adminService.js

import api from './api';

class AdminService {
  
  async getDashboardStats() {
    return await api.get('/admin/dashboard');
  }

  async getAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/admin/analytics?${queryString}`);
  }

  async getAllUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/admin/users?${queryString}`);
  }

  async updateUserStatus(userId, status, notes = '') {
    return await api.put(`/admin/users/${userId}/status`, { status, notes });
  }

  async getAllStores(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/admin/stores?${queryString}`);
  }

  async updateStoreStatus(storeId, status, isApproved) {
    return await api.put(`/admin/stores/${storeId}/status`, { status, isApproved });
  }

  async getCommissionSettings() {
    return await api.get('/admin/commission-settings');
  }

  async updateCommissionSettings(settings) {
    return await api.put('/admin/commission-settings', settings);
  }

  async getPlatformRevenue(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/admin/revenue?${queryString}`);
  }
}

export default new AdminService();