// src/services/walletService.js

import api from './api';

class WalletService {
  
  async getWallet() {
    return await api.get('/wallet');
  }

  async getWalletBalance() {
    return await api.get('/wallet/balance');
  }

  async getTransactions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/wallet/transactions?${queryString}`);
  }

  async updateBankDetails(bankDetails) {
    return await api.put('/wallet/bank-details', bankDetails);
  }

  async requestWithdrawal(withdrawalData) {
    return await api.post('/wallet/withdraw', withdrawalData);
  }

  async getWithdrawals(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/wallet/withdrawals?${queryString}`);
  }

  async getAllWithdrawals(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/withdrawals?${queryString}`);
  }

  async processWithdrawal(id, data) {
    return await api.put(`/withdrawals/${id}/process`, data);
  }

  async rejectWithdrawal(id, reason) {
    return await api.put(`/withdrawals/${id}/reject`, { reason });
  }
}

export default new WalletService();