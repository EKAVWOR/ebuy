// src/services/cartService.js

import api from './api';

class CartService {
  
  async getCart() {
    return await api.get('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return await api.post('/cart/add', { productId, quantity });
  }

  async updateCartItem(itemId, quantity) {
    return await api.put(`/cart/update/${itemId}`, { quantity });
  }

  async removeFromCart(itemId) {
    return await api.delete(`/cart/remove/${itemId}`);
  }

  async clearCart() {
    return await api.delete('/cart/clear');
  }

  // Local storage backup for cart
  getLocalCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  saveLocalCart(cartItems) {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }

  clearLocalCart() {
    localStorage.removeItem('cart');
  }
}

export default new CartService();