// src/pages/admin/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import StatCard from '../../components/cards/StatCard';
import Loader from '../../components/common/Loader';
import adminService from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/formatters';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const { statistics = {}, recentActivities = {} } = data;

  return (
    <div className="space-y-6">
      {/* Revenue Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-purple-200 text-sm">Total Revenue</p>
            <h2 className="text-3xl font-bold">{formatCurrency(statistics.revenue?.total)}</h2>
          </div>
          <div>
            <p className="text-purple-200 text-sm">Platform Revenue</p>
            <h2 className="text-3xl font-bold">{formatCurrency(statistics.revenue?.platformRevenue)}</h2>
          </div>
          <div>
            <p className="text-purple-200 text-sm">Transactions</p>
            <h2 className="text-3xl font-bold">{statistics.revenue?.transactions || 0}</h2>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={statistics.users?.total || 0} color="indigo"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} />
        <StatCard title="Total Vendors" value={statistics.users?.vendors || 0} color="blue"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} />
        <StatCard title="Total Products" value={statistics.products?.total || 0} color="green"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} />
        <StatCard title="Total Orders" value={statistics.orders?.total || 0} color="purple"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>} />
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Recent Orders</h3>
          </div>
          <div className="p-6 space-y-4">
            {recentActivities.orders?.map((order) => (
              <div key={order._id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.buyerId?.fullname}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Recent Users</h3>
          </div>
          <div className="p-6 space-y-4">
            {recentActivities.users?.map((user) => (
              <div key={user._id} className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {user.fullname?.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{user.fullname}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 capitalize">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;