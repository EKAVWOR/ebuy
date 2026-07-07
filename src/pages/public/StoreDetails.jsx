// src/pages/public/StoreDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import storeService from '../../services/storeService';
import ProductCard from '../../components/cards/ProductCard';
import Loader from '../../components/common/Loader';
import { useDispatch } from 'react-redux';
import cartService from '../../services/cartService';
import { setCart } from '../../store/slices/cartSlice';

const StoreDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreDetails();
  }, [id]);

  const fetchStoreDetails = async () => {
    try {
      setLoading(true);
      const [storeRes, productsRes] = await Promise.all([
        storeService.getStore(id),
        storeService.getStoreProducts(id)
      ]);
      setStore(storeRes.data.store);
      setProducts(productsRes.data.products);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await cartService.addToCart(product._id, 1);
      dispatch(setCart(response.data));
      alert('Added to cart!');
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <Loader />;
  if (!store) return <div>Store not found</div>;

  return (
    <div>
      {/* Store Header */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-indigo-500 to-purple-600">
          {store.banner && (
            <img src={store.banner} alt={store.storeName} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end -mt-20">
            <div className="w-40 h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
              {store.logo ? (
                <img src={store.logo} alt={store.storeName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-5xl font-bold text-indigo-600">
                  {store.storeName.charAt(0)}
                </div>
              )}
            </div>
            <div className="ml-6 pb-4">
              <h1 className="text-4xl font-bold text-white">{store.storeName}</h1>
              <p className="text-indigo-100">{store.category}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700">{store.description}</p>
          <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
            <div>
              <span className="font-semibold text-gray-800">{store.metrics?.totalProducts || 0}</span> Products
            </div>
            <div>
              <span className="font-semibold text-gray-800">{store.metrics?.totalOrders || 0}</span> Sales
            </div>
          </div>
        </div>

        {/* Products */}
        <h2 className="text-2xl font-bold mb-6">Products from this store</h2>
        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No products available</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetails;