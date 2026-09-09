// src/services/sugService.js
import api from "./api";

class SugService {
  // DASHBOARD
  getDashboardStats() {
    return api.get("/sug/dashboard");
  }

  // USERS
  getUsers(params = {}) {
    return api.get("/sug/users", { params });
  }

  getPendingVendors() {
    return api.get("/sug/pending-vendors");
  }

  approveVendor(userId, approved, notes = "") {
    return api.put(`/sug/approve-vendor/${userId}`, { approved, notes });
  }

  verifyStudent(userId, verified, notes = "") {
    return api.put(`/sug/verify-student/${userId}`, { verified, notes });
  }

  // STUDENT REGISTRY
  getStudentRegistry(params = {}) {
    return api.get("/sug/student-registry", { params });
  }

  addStudentToRegistry(data) {
    return api.post("/sug/student-registry", data);
  }

  bulkUploadStudents(file) {
    const formData = new FormData();
    formData.append("file", file);

    // ✅ correct backend route
    // ✅ do NOT set Content-Type manually
    return api.post("/sug/student-registry/upload", formData);
  }

  bulkUpdateRegistryStatus(data) {
    return api.put("/sug/student-registry/bulk-update", data);
  }

  updateStudentRecord(id, data) {
    return api.put(`/sug/student-registry/${id}`, data);
  }

  deleteStudentRecord(id) {
    return api.delete(`/sug/student-registry/${id}`);
  }

  getRegistryStats() {
    // ✅ correct backend route
    return api.get("/sug/student-registry/statistics");
  }

  // File downloads
  downloadRegistryTemplate() {
    return api.get("/sug/student-registry/template", { responseType: "blob" });
  }

  exportRegistry(params = {}) {
    return api.get("/sug/student-registry/export", {
      params,
      responseType: "blob",
    });
  }
}

export default new SugService();