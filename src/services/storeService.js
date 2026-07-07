// src/services/storeService.js

import api from './api';

class StoreService {
  
  async getAllStores(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/stores?${queryString}`);
  }

  async getStore(id) {
    return await api.get(`/stores/${id}`);
  }

  async getStoreProducts(id, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/stores/${id}/products?${queryString}`);
  }

  async getMyStore() {
    return await api.get('/stores/my/store');
  }

  async createStore(storeData) {
    return await api.post('/stores', storeData);
  }

  async updateStore(id, storeData) {
    return await api.put(`/stores/${id}`, storeData);
  }

  async uploadLogo(id, formData) {
    return await api.put(`/stores/${id}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async uploadBanner(id, formData) {
    return await api.put(`/stores/${id}/banner`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}

export default new StoreService();