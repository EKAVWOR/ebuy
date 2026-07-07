// src/pages/sug/Reports.jsx

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import sugService from '../../services/sugService';
import Loader from '../../components/common/Loader';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Reports = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await sugService.getTransactionReports(data);
      setReports(response.data.transactions);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Transaction Reports</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-end space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input type="date" {...register('startDate')} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input type="date" {...register('endDate')} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
            Generate Report
          </button>
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : reports.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="px-6 py-4 text-sm">{report.orderId?.orderNumber}</td>
                  <td className="px-6 py-4 text-sm">{formatCurrency(report.orderAmount)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">{formatCurrency(report.amount)}</td>
                  <td className="px-6 py-4 text-sm">{formatDate(report.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default Reports;