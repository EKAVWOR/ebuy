// src/pages/sug/VendorApproval.jsx

import React, { useState, useEffect } from 'react';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import sugService from '../../services/sugService';
import { formatDate } from '../../utils/formatters';

const VendorApproval = () => {
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [alert, setAlert] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  const fetchPendingVendors = async () => {
    try {
      setLoading(true);
      const response = await sugService.getPendingVendors();
      const data = response.data?.data || response.data || {};
      
      // Support both new (vendors) and old (stores) response formats
      setVendors(data.vendors || data.stores || []);
    } catch (error) {
      console.error('Fetch pending vendors error:', error);
      setAlert({ 
        type: 'error', 
        message: error?.response?.data?.message || error.message || 'Failed to load pending vendors' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, approved) => {
    try {
      setProcessing(userId);
      await sugService.approveVendor(userId, approved);
      setAlert({ 
        type: 'success', 
        message: `Vendor ${approved ? 'approved successfully! They can now login.' : 'rejected.'}` 
      });
      fetchPendingVendors();
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error?.response?.data?.message || error.message || 'Action failed' 
      });
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Pending Vendor Approvals</h2>
        <div className="text-sm text-gray-600">
          Pending: <span className="font-bold text-amber-600">{vendors.length}</span>
        </div>
      </div>

      {vendors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-lg font-medium">No pending vendor approvals</p>
          <p className="text-gray-400 text-sm mt-2">All vendors have been processed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600">
                  {(vendor.businessName || vendor.fullname || 'V').charAt(0).toUpperCase()}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold">
                    {vendor.businessName || vendor.fullname}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {vendor.businessName ? vendor.fullname : 'Vendor'}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                  Pending
                </span>
              </div>

              <div className="border-t pt-4 mb-4 space-y-1">
                <p className="text-sm"><strong>Email:</strong> {vendor.email}</p>
                <p className="text-sm"><strong>Phone:</strong> {vendor.phone || 'N/A'}</p>
                <p className="text-sm"><strong>Matric:</strong> {vendor.matricNumber || 'N/A'}</p>
                <p className="text-sm"><strong>Department:</strong> {vendor.department || 'N/A'}</p>
                <p className="text-sm"><strong>Faculty:</strong> {vendor.faculty || 'N/A'}</p>
                <p className="text-sm"><strong>Level:</strong> {vendor.level || 'N/A'}</p>
                <p className="text-sm"><strong>Registered:</strong> {formatDate(vendor.createdAt)}</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleApprove(vendor._id, true)}
                  disabled={processing === vendor._id}
                  className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing === vendor._id ? 'Processing...' : '✓ Approve'}
                </button>
                <button
                  onClick={() => handleApprove(vendor._id, false)}
                  disabled={processing === vendor._id}
                  className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing === vendor._id ? 'Processing...' : '✗ Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorApproval;