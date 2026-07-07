// src/pages/admin/Revenue.jsx

import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import StatCard from '../../components/cards/StatCard';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatters';

const Revenue = () => {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState({});

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPlatformRevenue();
      setRevenue(response.data.revenue);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Platform Revenue</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(revenue.totalRevenue)}
          color="purple"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          title="Total Orders"
          value={revenue.totalOrders || 0}
          color="indigo"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>}
        />
        <StatCard
          title="Commission Revenue"
          value={formatCurrency(revenue.breakdown?.commission?.totalRevenue)}
          color="green"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart visualization (use Recharts or similar)
        </div>
      </div>
    </div>
  );
};

export default Revenue;