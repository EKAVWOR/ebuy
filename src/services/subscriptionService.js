// src/services/subscriptionService.js

import api from './api';

class SubscriptionService {
  
  // ==================== PLANS ====================
  
  /**
   * Get all available subscription plans
   */
  async getPlans() {
    return await api.get('/subscriptions/plans');
  }

  // ==================== VENDOR ACTIONS ====================

  /**
   * Initialize a new subscription (returns Paystack URL)
   * @param {String} plan - 'basic' | 'standard' | 'premium'
   */
  async initializeSubscription(plan) {
    return await api.post('/subscriptions/initialize', { plan });
  }

  /**
   * Verify subscription payment after Paystack callback
   * @param {String} reference - Paystack reference code
   */
  async verifySubscription(reference) {
    return await api.get(`/subscriptions/verify/${reference}`);
  }

  /**
   * Get current vendor's active subscription
   */
  async getMySubscription() {
    return await api.get('/subscriptions/my-subscription');
  }

  /**
   * Get vendor's subscription history
   */
  async getSubscriptionHistory() {
    return await api.get('/subscriptions/history');
  }

  /**
   * Renew existing subscription
   */
  async renewSubscription() {
    return await api.post('/subscriptions/renew');
  }

  // ==================== ADMIN ACTIONS ====================

  async getAllSubscriptions(params = {}) {
    return await api.get('/subscriptions/admin/all', { params });
  }

  async getSubscriptionStats(params = {}) {
    return await api.get('/subscriptions/admin/stats', { params });
  }
}

export default new SubscriptionService();