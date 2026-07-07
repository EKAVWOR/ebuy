import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SugStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [counts, setCounts] = useState({ pending: 0, active: 0, suspended: 0, total: 0 });
  const [processingId, setProcessingId] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');

  const fetchStores = async (page = 1) => {
    try {
      setLoading(true);

      let queryParams = `?page=${page}&limit=10`;
      if (filter === 'pending') {
        queryParams += '&isApproved=false&status=pending';
      } else if (filter === 'active') {
        queryParams += '&isApproved=true&status=active';
      } else if (filter === 'suspended') {
        queryParams += '&status=suspended';
      }
      if (searchTerm) queryParams += `&search=${encodeURIComponent(searchTerm)}`;

      const response = await axios.get(`${API_URL}/sug/stores${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStores(response.data.data.stores);
      setPagination(response.data.data.pagination);
      setCounts(response.data.data.counts || counts);
    } catch (error) {
      console.error('Fetch stores error:', error);
      toast.error(error.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores(1);
  };

  const handleApprove = async (storeId) => {
    if (!window.confirm('Approve this store? The vendor will be able to add products.')) return;

    try {
      setProcessingId(storeId);
      await axios.put(
        `${API_URL}/sug/stores/${storeId}/approve`,
        { approved: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('✅ Store approved successfully');
      setSelectedStore(null);
      fetchStores(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve store');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (storeId) => {
    if (!window.confirm('Reject this store?')) return;

    try {
      setProcessingId(storeId);
      await axios.put(
        `${API_URL}/sug/stores/${storeId}/approve`,
        { approved: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Store rejected');
      setSelectedStore(null);
      fetchStores(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject store');
    } finally {
      setProcessingId(null);
    }
  };

  const handleSuspend = async (storeId) => {
    if (!window.confirm('Suspend this store?')) return;

    try {
      setProcessingId(storeId);
      await axios.put(
        `${API_URL}/sug/stores/${storeId}/status`,
        { status: 'suspended' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Store suspended');
      fetchStores(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to suspend store');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReactivate = async (storeId) => {
    try {
      setProcessingId(storeId);
      await axios.put(
        `${API_URL}/sug/stores/${storeId}/status`,
        { status: 'active' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Store reactivated');
      fetchStores(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reactivate store');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (store) => {
    if (!store.isApproved && store.status === 'pending') {
      return (
        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          Pending Approval
        </span>
      );
    }
    if (store.status === 'active' && store.isApproved) {
      return (
        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Active
        </span>
      );
    }
    if (store.status === 'suspended') {
      return (
        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          Suspended
        </span>
      );
    }
    if (store.status === 'subscription_expired') {
      return (
        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
          Subscription Expired
        </span>
      );
    }
    return (
      <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
        {store.status}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Store Management</h1>
        <p className="text-gray-600">Approve, reject, and manage vendor stores</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 border-l-4 border-l-yellow-500">
          <div className="text-3xl font-bold text-gray-900">{counts.pending}</div>
          <div className="text-sm text-gray-600 mt-1">Pending Approval</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 border-l-4 border-l-green-500">
          <div className="text-3xl font-bold text-gray-900">{counts.active}</div>
          <div className="text-sm text-gray-600 mt-1">Active Stores</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 border-l-4 border-l-red-500">
          <div className="text-3xl font-bold text-gray-900">{counts.suspended}</div>
          <div className="text-sm text-gray-600 mt-1">Suspended</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 border-l-4 border-l-blue-500">
          <div className="text-3xl font-bold text-gray-900">{counts.total}</div>
          <div className="text-sm text-gray-600 mt-1">Total Stores</div>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search stores by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
        >
          Search
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b-2 border-gray-200 overflow-x-auto">
        {[
          { key: 'pending', label: `Pending (${counts.pending})` },
          { key: 'active', label: 'Active' },
          { key: 'suspended', label: 'Suspended' },
          { key: 'all', label: 'All Stores' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-5 py-3 font-medium whitespace-nowrap border-b-[3px] transition-colors ${
              filter === tab.key
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 border-transparent hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">
          <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-3"></div>
          <p>Loading stores...</p>
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
          <p className="text-lg">No stores found in this category.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stores.map((store) => (
              <div
                key={store._id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Card Header */}
                <div className="flex gap-4 p-5 border-b border-gray-100">
                  {store.logo ? (
                    <img
                      src={store.logo}
                      alt={store.storeName}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                      {store.storeName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {store.storeName}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{store.category}</p>
                    {getStatusBadge(store)}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {store.description}
                  </p>

                  <div className="bg-gray-50 p-3 rounded-lg space-y-1.5 text-sm">
                    <div className="text-gray-700">
                      <span className="font-semibold text-gray-900">Owner:</span>{' '}
                      {store.owner?.fullname || 'N/A'}
                    </div>
                    <div className="text-gray-700 truncate">
                      <span className="font-semibold text-gray-900">Email:</span>{' '}
                      {store.owner?.email || 'N/A'}
                    </div>
                    <div className="text-gray-700">
                      <span className="font-semibold text-gray-900">Phone:</span>{' '}
                      {store.owner?.phone || 'N/A'}
                    </div>
                    <div className="text-gray-700">
                      <span className="font-semibold text-gray-900">Created:</span>{' '}
                      {new Date(store.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedStore(store)}
                    className="flex-1 min-w-[100px] px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors"
                  >
                    View Details
                  </button>

                  {!store.isApproved && store.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(store._id)}
                        disabled={processingId === store._id}
                        className="flex-1 min-w-[100px] px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {processingId === store._id ? '...' : '✓ Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(store._id)}
                        disabled={processingId === store._id}
                        className="flex-1 min-w-[100px] px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        ✕ Reject
                      </button>
                    </>
                  )}

                  {store.status === 'active' && store.isApproved && (
                    <button
                      onClick={() => handleSuspend(store._id)}
                      disabled={processingId === store._id}
                      className="flex-1 min-w-[100px] px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm font-medium transition-colors disabled:opacity-60"
                    >
                      Suspend
                    </button>
                  )}

                  {store.status === 'suspended' && (
                    <button
                      onClick={() => handleReactivate(store._id)}
                      disabled={processingId === store._id}
                      className="flex-1 min-w-[100px] px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors disabled:opacity-60"
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                disabled={pagination.page === 1}
                onClick={() => fetchStores(pagination.page - 1)}
                className="px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Previous
              </button>
              <span className="text-gray-600 text-sm">
                Page {pagination.page} of {pagination.pages} ({pagination.total} stores)
              </span>
              <button
                disabled={pagination.page === pagination.pages}
                onClick={() => fetchStores(pagination.page + 1)}
                className="px-4 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Store Details Modal */}
      {selectedStore && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedStore(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">{selectedStore.storeName}</h2>
              <button
                onClick={() => setSelectedStore(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              {selectedStore.banner && (
                <img
                  src={selectedStore.banner}
                  alt="Banner"
                  className="w-full h-48 object-cover rounded-lg mb-5"
                />
              )}

              <div className="mb-5 pb-5 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Store Info</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Category:</span>{' '}
                    {selectedStore.category}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">Status:</span>
                    {getStatusBadge(selectedStore)}
                  </div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Description:</span>{' '}
                    {selectedStore.description}
                  </p>
                </div>
              </div>

              <div className="mb-5 pb-5 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Owner Details</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Name:</span>{' '}
                    {selectedStore.owner?.fullname}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Email:</span>{' '}
                    {selectedStore.owner?.email}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Phone:</span>{' '}
                    {selectedStore.owner?.phone}
                  </p>
                  {selectedStore.owner?.businessName && (
                    <p className="text-gray-600">
                      <span className="font-semibold text-gray-900">Business:</span>{' '}
                      {selectedStore.owner.businessName}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-5 pb-5 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Contact Info</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Email:</span>{' '}
                    {selectedStore.contactEmail || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">Phone:</span>{' '}
                    {selectedStore.contactPhone || 'N/A'}
                  </p>
                </div>
              </div>

              {selectedStore.socialMedia && (
                <div className="mb-5">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">Social Media</h3>
                  <div className="space-y-2 text-sm">
                    {selectedStore.socialMedia.instagram && (
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-900">Instagram:</span>{' '}
                        {selectedStore.socialMedia.instagram}
                      </p>
                    )}
                    {selectedStore.socialMedia.twitter && (
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-900">Twitter:</span>{' '}
                        {selectedStore.socialMedia.twitter}
                      </p>
                    )}
                    {selectedStore.socialMedia.facebook && (
                      <p className="text-gray-600">
                        <span className="font-semibold text-gray-900">Facebook:</span>{' '}
                        {selectedStore.socialMedia.facebook}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!selectedStore.isApproved && selectedStore.status === 'pending' && (
              <div className="flex gap-3 p-5 border-t border-gray-200 sticky bottom-0 bg-white">
                <button
                  onClick={() => handleReject(selectedStore._id)}
                  disabled={processingId === selectedStore._id}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-60"
                >
                  ✕ Reject Store
                </button>
                <button
                  onClick={() => handleApprove(selectedStore._id)}
                  disabled={processingId === selectedStore._id}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-60"
                >
                  ✓ Approve Store
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SugStores;