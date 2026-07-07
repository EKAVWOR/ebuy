// src/pages/admin/Withdrawals.jsx

import React, { useState, useEffect } from 'react';
import walletService from '../../services/walletService';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/Modal';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await walletService.getAllWithdrawals();
      setWithdrawals(response.data.withdrawals);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (id, reference) => {
    try {
      await walletService.processWithdrawal(id, { transferReference: reference });
      setAlert({ type: 'success', message: 'Withdrawal processed' });
      setShowModal(false);
      fetchWithdrawals();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  const handleReject = async (id, reason) => {
    try {
      await walletService.rejectWithdrawal(id, reason);
      setAlert({ type: 'success', message: 'Withdrawal rejected' });
      fetchWithdrawals();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <h2 className="text-2xl font-bold text-gray-800">Withdrawal Requests</h2>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {withdrawals.map((withdrawal) => (
              <tr key={withdrawal._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{withdrawal.vendorId?.fullname}</td>
                <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(withdrawal.amount)}</td>
                <td className="px-6 py-4 text-sm">{withdrawal.bankDetails.bankName}</td>
                <td className="px-6 py-4 text-sm">{withdrawal.bankDetails.accountNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(withdrawal.createdAt)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(withdrawal.status)}`}>
                    {withdrawal.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {withdrawal.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedWithdrawal(withdrawal);
                          setShowModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        Process
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Rejection reason:');
                          if (reason) handleReject(withdrawal._id, reason);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedWithdrawal && (
        <Modal title="Process Withdrawal" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Vendor: {selectedWithdrawal.vendorId?.fullname}</p>
              <p className="text-sm text-gray-600">Amount: {formatCurrency(selectedWithdrawal.amount)}</p>
              <p className="text-sm text-gray-600">Bank: {selectedWithdrawal.bankDetails.bankName}</p>
              <p className="text-sm text-gray-600">Account: {selectedWithdrawal.bankDetails.accountNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Transfer Reference</label>
              <input
                id="transfer-ref"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter transfer reference"
              />
            </div>
            <button
              onClick={() => {
                const ref = document.getElementById('transfer-ref').value;
                if (ref) handleProcess(selectedWithdrawal._id, ref);
              }}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
            >
              Confirm Transfer
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminWithdrawals;