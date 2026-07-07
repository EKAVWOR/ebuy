// src/pages/admin/CommissionSettings.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import adminService from '../../services/adminService';

const CommissionSettings = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const vendor = watch('vendorPercentage', 0);
  const sug = watch('sugPercentage', 0);
  const platform = watch('platformPercentage', 0);
  const total = Number(vendor) + Number(sug) + Number(platform);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await adminService.getCommissionSettings();
      const { settings } = response.data;
      setValue('vendorPercentage', settings.vendorPercentage);
      setValue('sugPercentage', settings.sugPercentage);
      setValue('platformPercentage', settings.platformPercentage);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (total !== 100) {
      setAlert({ type: 'error', message: 'Total must equal 100%' });
      return;
    }
    try {
      await adminService.updateCommissionSettings({
        vendorPercentage: Number(data.vendorPercentage),
        sugPercentage: Number(data.sugPercentage),
        platformPercentage: Number(data.platformPercentage)
      });
      setAlert({ type: 'success', message: 'Settings updated successfully' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <h2 className="text-2xl font-bold text-gray-800">Commission Settings</h2>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vendor Percentage (%)
            </label>
            <input
              type="number"
              step="0.1"
              {...register('vendorPercentage', { required: true, min: 0, max: 100 })}
              className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SUG Percentage (%)
            </label>
            <input
              type="number"
              step="0.1"
              {...register('sugPercentage', { required: true, min: 0, max: 100 })}
              className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Percentage (%)
            </label>
            <input
              type="number"
              step="0.1"
              {...register('platformPercentage', { required: true, min: 0, max: 100 })}
              className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500"
            />
          </div>

          <div className={`p-4 rounded-md ${total === 100 ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className={`font-semibold ${total === 100 ? 'text-green-800' : 'text-red-800'}`}>
              Total: {total}% {total === 100 ? '✓' : '(Must equal 100%)'}
            </p>
          </div>

          <button
            type="submit"
            disabled={total !== 100}
            className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommissionSettings;