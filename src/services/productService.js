// src/services/productService.js

import api from './api';

class ProductService {
  
  async getAllProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/products?${queryString}`);
  }

  async getProduct(id) {
    return await api.get(`/products/${id}`);
  }

  async getVendorProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/products/vendor/my-products?${queryString}`);
  }

  async createProduct(formData) {
    return await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async updateProduct(id, formData) {
    return await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async deleteProduct(id) {
    return await api.delete(`/products/${id}`);
  }

  async searchProducts(query) {
    return await api.get(`/products?search=${encodeURIComponent(query)}`);
  }
}

export default new ProductService();