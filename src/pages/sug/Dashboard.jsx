// src/pages/sug/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import StatCard from '../../components/cards/StatCard';
import Loader from '../../components/common/Loader';
import sugService from '../../services/sugService';
import { formatCurrency, formatDate } from '../../utils/formatters';

const SugDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await sugService.getDashboardStats();
      setStats(response.data.statistics);
      setTransactions(response.data.recentTransactions);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Earnings Banner */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg shadow-lg p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-green-200 text-sm">Total Commission Earned</p>
            <h2 className="text-4xl font-bold">{formatCurrency(stats.totalEarnings)}</h2>
          </div>
          <div>
            <p className="text-green-200 text-sm">This Month</p>
            <h2 className="text-4xl font-bold">{formatCurrency(stats.monthlyEarnings)}</h2>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.totalStudents || 0} color="indigo"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /></svg>} />
        <StatCard title="Total Vendors" value={stats.totalVendors || 0} color="blue"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} />
        <StatCard title="Pending Approvals" value={stats.pendingVendors || 0} color="yellow"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" /></svg>} />
        <StatCard title="Total Orders" value={stats.totalOrders || 0} color="purple"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>} />
      </div>

      {/* Recent Commissions */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Recent Commission Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{tx.orderId?.orderNumber}</td>
                  <td className="px-6 py-4 text-sm">{formatCurrency(tx.orderAmount)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">{formatCurrency(tx.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(tx.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SugDashboard;