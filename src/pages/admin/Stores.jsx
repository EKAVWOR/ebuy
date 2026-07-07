// src/pages/admin/Stores.jsx

import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { getStatusColor } from '../../utils/formatters';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllStores();
      setStores(response.data.stores);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (storeId, status, isApproved) => {
    try {
      await adminService.updateStoreStatus(storeId, status, isApproved);
      setAlert({ type: 'success', message: 'Store status updated' });
      fetchStores();
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <h2 className="text-2xl font-bold text-gray-800">Manage Stores</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div key={store._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
              {store.banner && <img src={store.banner} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl font-bold text-indigo-600 -mt-12">
                  {store.storeName.charAt(0)}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{store.storeName}</h3>
              <p className="text-sm text-gray-600 mb-4">{store.category}</p>
              <p className="text-xs text-gray-500 mb-4">Owner: {store.owner?.fullname}</p>
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(store.status)}`}>
                  {store.status}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  store.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {store.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>
              <div className="flex space-x-2">
                {!store.isApproved && (
                  <button
                    onClick={() => handleStatusChange(store._id, 'active', true)}
                    className="flex-1 bg-green-600 text-white text-sm py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
                {store.status === 'active' && (
                  <button
                    onClick={() => handleStatusChange(store._id, 'suspended', store.isApproved)}
                    className="flex-1 bg-red-600 text-white text-sm py-2 rounded hover:bg-red-700"
                  >
                    Suspend
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminStores;