import api from "./api";

class StoreService {
  getAllStores(params = {}) {
    return api.get("/stores", { params });
  }

  getStore(id) {
    return api.get(`/stores/${id}`);
  }

  getStoreProducts(id, params = {}) {
    return api.get(`/stores/${id}/products`, { params });
  }

  getMyStore() {
    return api.get("/stores/my/store");
  }

  createStore(storeData) {
    return api.post("/stores", storeData);
  }

  updateStore(id, storeData) {
    return api.put(`/stores/${id}`, storeData);
  }

  uploadLogo(id, formData) {
    // ✅ let axios set boundary
    return api.put(`/stores/${id}/logo`, formData);
  }

  uploadBanner(id, formData) {
    return api.put(`/stores/${id}/banner`, formData);
  }
}

export default new StoreService();