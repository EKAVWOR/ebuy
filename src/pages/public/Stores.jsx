// src/pages/public/Stores.jsx

import React, { useState, useEffect } from 'react';
import storeService from '../../services/storeService';
import StoreCard from '../../components/cards/StoreCard';
import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchStores();
  }, [currentPage, category]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await storeService.getAllStores({
        page: currentPage,
        limit: 12,
        category
      });
      setStores(response.data.stores);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Stores</h1>

      {/* Filter */}
      <div className="mb-8">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Categories</option>
          <option value="Fashion">Fashion</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Food">Food</option>
          <option value="Services">Services</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard key={store._id} store={store} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={pagination.pages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default Stores;