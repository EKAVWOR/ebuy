import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import orderService from '../../services/orderService';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatters';

const VendorOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderDetails(id);
      setOrder(response.data.order);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load order');
      navigate('/vendor/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    const confirmMsg = newStatus === 'processing' 
      ? 'Mark this order as being processed?'
      : newStatus === 'shipped'
      ? 'Mark this order as shipped? The buyer will need to confirm delivery.'
      : 'Update order status?';

    if (!window.confirm(confirmMsg)) return;

    try {
      setUpdating(true);
      await orderService.updateOrderStatus(id, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.toUpperCase()}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${styles[status]}`}>
        {status?.toUpperCase()}
      </span>
    );
  };

  if (loading) return <Loader />;
  if (!order) return null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link 
            to="/vendor/orders" 
            className="text-indigo-600 hover:text-indigo-800 text-sm mb-2 inline-block"
          >
            ← Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-NG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {getStatusBadge(order.orderStatus)}
          {getPaymentBadge(order.paymentStatus)}
        </div>
      </div>

      {/* Alert for delivered orders */}
      {order.orderStatus === 'delivered' && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-800">
            ✅ <strong>Order Delivered</strong> — Buyer confirmed delivery on{' '}
            {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      )}

      {order.orderStatus === 'shipped' && (
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-blue-800">
            📦 <strong>Awaiting Buyer Confirmation</strong> — The buyer will mark the order as delivered upon receipt.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  {item.productImage ? (
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                      📦
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.productName}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Store: {item.storeId?.storeName || 'N/A'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">
                        {formatCurrency(item.price)} × {item.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(item.subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Your Items Subtotal:</span>
                <span className="font-semibold">
                  {formatCurrency(order.vendorSubtotal || order.subtotal)}
                </span>
              </div>
              {order.platformFee > 0 && (
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Platform Fee (buyer paid):</span>
                  <span>{formatCurrency(order.platformFee)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Timeline */}
          {order.statusHistory?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
              <div className="space-y-4">
                {order.statusHistory.map((entry, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-indigo-600 mt-1.5"></div>
                      {idx < order.statusHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{entry.status}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                      )}
                      {entry.updatedBy && (
                        <p className="text-xs text-gray-500 mt-1">
                          Updated by: {entry.updatedBy.fullname} ({entry.updatedBy.role})
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Customer & Actions */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Customer</h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>
                <p className="font-medium">{order.buyerId?.fullname || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>
                <p className="font-medium">{order.buyerId?.email || 'N/A'}</p>
              </div>
              <div>
                <span className="text-gray-500">Phone:</span>
                <p className="font-medium">{order.buyerId?.phone || 'N/A'}</p>
              </div>
              {order.buyerId?.matricNumber && (
                <div>
                  <span className="text-gray-500">Matric:</span>
                  <p className="font-medium">{order.buyerId.matricNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{order.shippingAddress?.fullname}</p>
              <p className="text-gray-600">{order.shippingAddress?.phone}</p>
              <p className="text-gray-600 mt-2">{order.shippingAddress?.address}</p>
              <p className="text-gray-600">
                {order.shippingAddress?.city}, {order.shippingAddress?.state}
              </p>
              <p className="text-gray-600">{order.shippingAddress?.country || 'Nigeria'}</p>
            </div>
            {order.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Order Notes:</p>
                <p className="text-sm text-gray-700 italic">"{order.notes}"</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {order.paymentStatus === 'paid' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Actions</h2>
              
              {order.orderStatus === 'pending' && (
                <button
                  onClick={() => handleStatusUpdate('processing')}
                  disabled={updating}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-60"
                >
                  {updating ? 'Updating...' : '📋 Start Processing'}
                </button>
              )}

              {order.orderStatus === 'processing' && (
                <button
                  onClick={() => handleStatusUpdate('shipped')}
                  disabled={updating}
                  className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-60"
                >
                  {updating ? 'Updating...' : '📦 Mark as Shipped'}
                </button>
              )}

              {order.orderStatus === 'shipped' && (
                <div className="text-center py-3 px-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⏳ Waiting for buyer to confirm delivery
                  </p>
                </div>
              )}

              {order.orderStatus === 'delivered' && (
                <div className="text-center py-3 px-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✅ Order completed
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorOrderDetails;