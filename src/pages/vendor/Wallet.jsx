// src/pages/vendor/Wallet.jsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import StatCard from '../../components/cards/StatCard';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/Modal';
import walletService from '../../services/walletService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

const Wallet = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [walletRes, transRes] = await Promise.all([
        walletService.getWalletBalance(),
        walletService.getTransactions({ limit: 20 })
      ]);
      setWallet(walletRes.data);
      setTransactions(transRes.data.transactions);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (data) => {
    try {
      await walletService.requestWithdrawal({
        amount: parseFloat(data.amount),
        bankDetails: {
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          accountName: data.accountName
        }
      });
      setAlert({ type: 'success', message: 'Withdrawal request submitted' });
      setShowWithdrawModal(false);
      reset();
      fetchWalletData();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Wallet</h2>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Request Withdrawal
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Available" value={formatCurrency(wallet.balance)} color="green"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2" /></svg>} />
        <StatCard title="Pending" value={formatCurrency(wallet.pendingBalance)} color="yellow"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" /></svg>} />
        <StatCard title="Total Earnings" value={formatCurrency(wallet.totalEarnings)} color="indigo"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2" /></svg>} />
        <StatCard title="Withdrawn" value={formatCurrency(wallet.totalWithdrawals)} color="purple"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>} />
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      tx.type === 'credit' ? 'bg-green-100 text-green-800' :
                      tx.type === 'debit' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{tx.description}</td>
                  <td className={`px-6 py-4 text-sm font-semibold ${
                    tx.type === 'debit' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {tx.type === 'debit' ? '-' : '+'}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDateTime(tx.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <Modal title="Request Withdrawal" onClose={() => setShowWithdrawModal(false)}>
          <form onSubmit={handleSubmit(handleWithdraw)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                {...register('amount', { required: 'Amount required', min: { value: 1000, message: 'Minimum ₦1,000' } })}
                className="w-full px-3 py-2 border rounded-md"
              />
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input {...register('bankName', { required: true })} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input {...register('accountNumber', { required: true })} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
              <input {...register('accountName', { required: true })} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
              Submit Request
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Wallet;