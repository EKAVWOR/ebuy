// src/pages/admin/Analytics.jsx

import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatters';

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAnalytics({ period: 30 });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Platform Analytics</h2>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
        <div className="space-y-4">
          {analytics.topProducts?.map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-300 mr-4">#{index + 1}</span>
                <div>
                  <p className="font-medium">{item.product?.name}</p>
                  <p className="text-sm text-gray-500">{item.totalSold} sold</p>
                </div>
              </div>
              <p className="font-semibold text-green-600">{formatCurrency(item.totalRevenue)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Vendors */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Top Vendors</h3>
        <div className="space-y-4">
          {analytics.topVendors?.map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-300 mr-4">#{index + 1}</span>
                <div>
                  <p className="font-medium">{item.vendor?.fullname}</p>
                  <p className="text-sm text-gray-500">{item.totalOrders} orders</p>
                </div>
              </div>
              <p className="font-semibold text-indigo-600">{formatCurrency(item.totalRevenue)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;