import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import orderService from '../../services/orderService';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatters';

const StudentOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
      navigate('/student/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    try {
      setConfirming(true);
      await orderService.confirmDelivery(id);
      toast.success('✅ Delivery confirmed! Thank you for shopping.');
      setShowConfirmModal(false);
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm delivery');
    } finally {
      setConfirming(false);
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

  if (loading) return <Loader />;
  if (!order) return null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            to="/student/orders"
            className="text-indigo-600 hover:text-indigo-800 text-sm mb-2 inline-block"
          >
            ← Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(order.createdAt).toLocaleDateString('en-NG', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
        <div>{getStatusBadge(order.orderStatus)}</div>
      </div>

      {/* Delivery Confirmation Banner */}
      {order.orderStatus === 'shipped' && (
        <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-orange-900 mb-1">
                📦 Your order has been shipped!
              </h3>
              <p className="text-sm text-orange-800">
                Once you receive and inspect the item, please confirm delivery to release payment to the vendor.
              </p>
            </div>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="ml-4 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium whitespace-nowrap"
            >
              ✓ Confirm Delivery
            </button>
          </div>
        </div>
      )}

      {order.orderStatus === 'delivered' && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-800">
            ✅ <strong>Delivery Confirmed</strong> — Thank you for shopping with us!
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Items</h2>
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName}
                      className="w-20 h-20 rounded-lg object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                      📦
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-sm text-gray-500">
                      From: {item.storeId?.storeName}
                    </p>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-600">
                        {formatCurrency(item.price)} × {item.quantity}
                      </span>
                      <span className="font-semibold">{formatCurrency(item.subtotal)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.platformFee > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee:</span>
                  <span>{formatCurrency(order.platformFee)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span className="text-indigo-600">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {order.statusHistory?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Order Progress</h2>
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
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">{entry.status}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {entry.note && <p className="text-sm text-gray-600 mt-1">{entry.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{order.shippingAddress?.fullname}</p>
              <p className="text-gray-600">{order.shippingAddress?.phone}</p>
              <p className="text-gray-600 mt-2">{order.shippingAddress?.address}</p>
              <p className="text-gray-600">
                {order.shippingAddress?.city}, {order.shippingAddress?.state}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Payment</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="font-medium capitalize">{order.paymentStatus}</span>
              </div>
              {order.paymentReference && (
                <div>
                  <span className="text-gray-500 block">Reference:</span>
                  <span className="font-mono text-xs break-all">
                    {order.paymentReference}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delivery Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowConfirmModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">Confirm Delivery</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you've received your order and everything is in good condition?
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Once confirmed, payment will be released to the vendor. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelivery}
                disabled={confirming}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-60"
              >
                {confirming ? 'Confirming...' : '✓ Yes, Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentOrderDetails;