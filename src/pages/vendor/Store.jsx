// src/pages/vendor/Store.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import storeService from '../../services/storeService';
import uploadService from '../../services/uploadServices';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';

const Store = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      setLoading(true);
      const response = await storeService.getMyStore();
      const storeData = response.data.store;
      setStore(storeData);

      // Set form values
      setValue('storeName', storeData.storeName);
      setValue('description', storeData.description);
      setValue('category', storeData.category);
      setValue('contactEmail', storeData.contactEmail);
      setValue('contactPhone', storeData.contactPhone);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (store) {
        await storeService.updateStore(store._id, data);
        setAlert({ type: 'success', message: 'Store updated successfully' });
      } else {
        await storeService.createStore(data);
        setAlert({ type: 'success', message: 'Store created successfully' });
      }
      fetchStore();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('logo', file);
      await storeService.uploadLogo(store._id, formData);
      setAlert({ type: 'success', message: 'Logo uploaded' });
      fetchStore();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('banner', file);
      await storeService.uploadBanner(store._id, formData);
      setAlert({ type: 'success', message: 'Banner uploaded' });
      fetchStore();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Store</h2>
        {store && (
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            store.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {store.isApproved ? 'Approved' : 'Pending Approval'}
          </span>
        )}
      </div>

      {/* Store Preview */}
      {store && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Banner */}
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative group">
            {store.banner && (
              <img src={store.banner} alt="Banner" className="w-full h-full object-cover" />
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-white font-semibold">
                {uploading ? 'Uploading...' : 'Change Banner'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Logo */}
          <div className="px-6 pb-6">
            <div className="flex justify-center -mt-16 mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden relative group">
                {store.logo ? (
                  <img src={store.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600">
                    {store.storeName.charAt(0)}
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <span className="text-white text-sm">
                    {uploading ? 'Uploading...' : 'Change'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold">{store.storeName}</h3>
              <p className="text-gray-500">{store.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* Store Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
              <input
                {...register('storeName', { required: 'Store name is required' })}
                disabled={store?.isApproved}
                className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100"
              />
              {errors.storeName && <p className="text-red-500 text-sm">{errors.storeName.message}</p>}
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
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows="4"
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                {...register('contactEmail')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input
                {...register('contactPhone')}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
          >
            {store ? 'Update Store' : 'Create Store'}
          </button>
        </form>
      </div>

      {store && !store.isApproved && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
          <p className="text-yellow-800">
            Your store is pending approval by SUG. You'll be notified once approved.
          </p>
        </div>
      )}
    </div>
  );
};

export default Store;