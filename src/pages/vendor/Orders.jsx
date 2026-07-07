// src/pages/vendor/Orders.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [filter, setFilter] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getVendorOrders({ status: filter });
      setOrders(response.data.orders);
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    const confirmMsg = status === 'processing'
      ? 'Mark this order as being processed?'
      : status === 'shipped'
      ? 'Mark this order as shipped? The buyer will need to confirm delivery.'
      : 'Update order status?';

    if (!window.confirm(confirmMsg)) return;

    try {
      setUpdatingId(orderId);
      await orderService.updateOrderStatus(orderId, status);
      setAlert({ type: 'success', message: `Order marked as ${status}` });
      fetchOrders();
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || error.message 
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage orders — buyers confirm delivery after receiving items
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-indigo-600">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>{order.buyerId?.fullname}</div>
                      <div className="text-xs text-gray-500">{order.buyerId?.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(order.vendorSubtotal || order.totalAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col gap-2">
                        {/* View Details Link */}
                        <Link
                          to={`/vendor/orders/${order._id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-xs"
                        >
                          View Details →
                        </Link>

                        {/* Action Buttons */}
                        {order.orderStatus === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'processing')}
                            disabled={updatingId === order._id}
                            className="text-blue-600 hover:text-blue-900 text-xs font-medium disabled:opacity-50"
                          >
                            {updatingId === order._id ? '...' : 'Start Processing'}
                          </button>
                        )}
                        {order.orderStatus === 'processing' && (
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'shipped')}
                            disabled={updatingId === order._id}
                            className="text-indigo-600 hover:text-indigo-900 text-xs font-medium disabled:opacity-50"
                          >
                            {updatingId === order._id ? '...' : 'Mark as Shipped'}
                          </button>
                        )}
                        {order.orderStatus === 'shipped' && (
                          <span className="text-xs text-yellow-600 italic">
                            Awaiting buyer confirmation
                          </span>
                        )}
                        {order.orderStatus === 'delivered' && (
                          <span className="text-xs text-green-600">
                            ✓ Completed
                          </span>
                        )}
                        {order.orderStatus === 'cancelled' && (
                          <span className="text-xs text-red-600">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorOrders;