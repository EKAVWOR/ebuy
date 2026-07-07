// src/services/sugService.js

import api from './api';

class SugService {
  
  // ==================== DASHBOARD ====================
  
  /**
   * Get SUG dashboard statistics
   */
  async getDashboardStats() {
    return await api.get('/sug/dashboard');
  }

  // ==================== USER MANAGEMENT ====================

  /**
   * Get all users (students & vendors) with filters
   * @param {Object} params - { page, limit, role, status, verified, search }
   */
  async getUsers(params = {}) {
    return await api.get('/sug/users', { params });
  }

  /**
   * Get all pending vendors awaiting SUG approval
   */
  async getPendingVendors() {
    return await api.get('/sug/pending-vendors');
  }

  /**
   * Approve or reject a vendor
   * @param {String} userId - The vendor's user ID
   * @param {Boolean} approved - true to approve, false to reject
   * @param {String} notes - Optional notes
   */
  async approveVendor(userId, approved, notes = '') {
    return await api.put(`/sug/approve-vendor/${userId}`, { approved, notes });
  }

  /**
   * Verify or unverify a student
   * @param {String} userId - The student's user ID
   * @param {Boolean} verified - true to verify, false to unverify
   * @param {String} notes - Optional notes
   */
  async verifyStudent(userId, verified, notes = '') {
    return await api.put(`/sug/verify-student/${userId}`, { verified, notes });
  }

  // ==================== STUDENT REGISTRY ====================

  /**
   * Get all students from registry with pagination & filters
   */
  async getStudentRegistry(params = {}) {
    return await api.get('/sug/student-registry', { params });
  }

  /**
   * Add single student to registry
   */
  async addStudentToRegistry(data) {
    return await api.post('/sug/student-registry', data);
  }

  /**
   * Bulk upload students via CSV
   */
  async bulkUploadStudents(file) {
    const formData = new FormData();
    formData.append('file', file);
    return await api.post('/sug/student-registry/bulk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  /**
   * Get single student record
   */
  async getStudentRecord(id) {
    return await api.get(`/sug/student-registry/${id}`);
  }

  /**
   * Update student record
   */
  async updateStudentRecord(id, data) {
    return await api.put(`/sug/student-registry/${id}`, data);
  }

  /**
   * Delete student record
   */
  async deleteStudentRecord(id) {
    return await api.delete(`/sug/student-registry/${id}`);
  }

  /**
   * Get registry statistics
   */
  async getRegistryStats() {
    return await api.get('/sug/student-registry/stats');
  }

  // ==================== REPORTS ====================

  /**
   * Get commission earnings with optional date filters
   */
  async getCommissionEarnings(params = {}) {
    return await api.get('/sug/commission-earnings', { params });
  }

  /**
   * Get transaction reports with pagination
   */
  async getTransactionReports(params = {}) {
    return await api.get('/sug/transaction-reports', { params });
  }
}

export default new SugService();