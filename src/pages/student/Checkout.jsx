// src/pages/student/Checkout.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import cartService from '../../services/cartService';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import { formatCurrency } from '../../utils/formatters';

const Checkout = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [summary, setSummary] = useState({});
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      if (!response.data.cart.items.length) {
        navigate('/student/cart');
        return;
      }
      setSummary(response.data.summary);
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setProcessing(true);

      // Create order
      const orderResponse = await orderService.createOrder({
        shippingAddress: data,
        notes: data.notes
      });

      const orderId = orderResponse.data.order._id;

      // Initialize payment
      const paymentResponse = await paymentService.initializePayment(orderId);

      // Redirect to Paystack
      window.location.href = paymentResponse.data.authorizationUrl;

    } catch (error) {
      setAlert({ type: 'error', message: error.message });
      setProcessing(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <h2 className="text-2xl font-bold text-gray-800">Checkout</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipping Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  {...register('fullname', { required: 'Name is required' })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  {...register('phone', { required: 'Phone is required' })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  {...register('address', { required: 'Address is required' })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  {...register('city', { required: 'City is required' })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  {...register('state', { required: 'State is required' })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
                <textarea
                  {...register('notes')}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform Fee</span>
                <span>{formatCurrency(summary.platformFee)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-indigo-600">{formatCurrency(summary.total)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 font-semibold disabled:bg-gray-400"
            >
              {processing ? 'Processing...' : 'Pay with Paystack'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;