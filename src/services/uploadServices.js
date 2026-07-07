// src/services/uploadService.js

import api from './api';

class UploadService {
  
  /**
   * Upload a single image
   * @param {File} file - Image file
   * @param {String} folder - Cloudinary folder name (e.g. 'profiles', 'products')
   */
  async uploadImage(file, folder = 'general') {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    return await api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  /**
   * Upload multiple images
   * @param {File[]} files - Array of image files
   * @param {String} folder - Cloudinary folder name
   */
  async uploadMultipleImages(files, folder = 'general') {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    return await api.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  /**
   * Delete an uploaded image
   * @param {String} publicId - Cloudinary public ID or image URL
   */
  async deleteImage(publicId) {
    return await api.delete('/upload/image', {
      data: { publicId }
    });
  }

  /**
   * Upload a file (CSV, PDF, etc.)
   * @param {File} file - File to upload
   * @param {String} endpoint - Custom endpoint
   */
  async uploadFile(file, endpoint) {
    const formData = new FormData();
    formData.append('file', file);

    return await api.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  /**
   * Validate image file before upload
   * @param {File} file - Image file to validate
   * @param {Object} options - Validation options
   */
  validateImage(file, options = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    } = options;

    if (!file) {
      return { valid: false, error: 'No file selected' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: `Invalid file type. Allowed: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}` 
      };
    }

    if (file.size > maxSize) {
      const maxMB = (maxSize / (1024 * 1024)).toFixed(1);
      return { valid: false, error: `File too large. Maximum size: ${maxMB}MB` };
    }

    return { valid: true };
  }
}

export default new UploadService();