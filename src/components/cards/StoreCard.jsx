// src/components/cards/StoreCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const StoreCard = ({ store }) => {
  if (!store) return null;

  return (
    <Link
      to={`/stores/${store._id}`}
      className="block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Banner */}
      <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
        {store.banner ? (
          <img
            src={store.banner}
            alt={`${store.storeName} banner`}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>

      {/* Store info */}
      <div className="p-5 relative">
        {/* Logo */}
        <div className="absolute -top-8 left-5">
          {store.logo ? (
            <img
              src={store.logo}
              alt={store.storeName}
              className="w-16 h-16 rounded-xl object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md">
              {store.storeName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {store.storeName}
          </h3>
          <p className="text-xs text-gray-500 mb-3">{store.category}</p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {store.description}
          </p>

          {/* Metrics */}
          <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
            <span>📦 {store.metrics?.totalProducts || 0} products</span>
            {store.metrics?.rating > 0 && (
              <span>⭐ {store.metrics.rating.toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoreCard; // ✅ This is what was missing