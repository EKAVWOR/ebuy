// src/services/authService.js

import api from './api';

class AuthService {
  
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.success && response.data.token) {
      this.setAuthData(response.data);
    }
    return response;
  }

  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.success && response.data.token) {
      this.setAuthData(response.data);
    }
    return response;
  }

  async verifyMatric(matricNumber) {
    return await api.post('/auth/verify-matric', { matricNumber });
  }

  async getProfile() {
    return await api.get('/auth/me');
  }

  async updateProfile(data) {
    return await api.put('/auth/profile', data);
  }

  async changePassword(passwords) {
    return await api.put('/auth/change-password', passwords);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  setAuthData(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  hasRole(role) {
    const user = this.getUser();
    return user?.role === role;
  }
}

export default new AuthService();