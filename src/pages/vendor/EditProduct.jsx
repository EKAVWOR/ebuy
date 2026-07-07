// src/pages/vendor/EditProduct.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import productService from '../../services/productService';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);
  const [product, setProduct] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProduct(id);
      const prod = response.data.product;
      setProduct(prod);

      // Set form values
      setValue('name', prod.name);
      setValue('description', prod.description);
      setValue('category', prod.category);
      setValue('price', prod.price);
      setValue('comparePrice', prod.comparePrice);
      setValue('stock', prod.stock);
      setValue('sku', prod.sku);
      setValue('tags', prod.tags?.join(', '));
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const formData = new FormData();

      // Append new images if any
      newImages.forEach(image => {
        formData.append('images', image);
      });

      // Append other fields
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });

      await productService.updateProduct(id, formData);
      setAlert({ type: 'success', message: 'Product updated successfully' });
      setTimeout(() => navigate('/vendor/products'), 1500);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
        <button
          onClick={() => navigate('/vendor/products')}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Current Images */}
          {product?.images?.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Product ${index}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Images (Optional)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-md"
            />
            {previewImages.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-4">
                {previewImages.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`New Preview ${index}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                {...register('name', { required: 'Product name is required' })}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Category</option>
                <option value="Fashion">Fashion</option>
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Food">Food</option>
                <option value="Services">Services</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦) *</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { required: 'Price is required' })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price (₦)</label>
              <input
                type="number"
                step="0.01"
                {...register('comparePrice')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input
                type="number"
                {...register('stock', { required: 'Stock is required' })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select {...register('status')} className="w-full px-3 py-2 border rounded-md">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows="5"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
            >
              {submitting ? 'Updating...' : 'Update Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/vendor/products')}
              className="px-6 py-3 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;