// src/pages/student/PaymentVerify.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Loader from '../../components/common/Loader';
import paymentService from '../../services/paymentService';
import { formatCurrency } from '../../utils/formatters';

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (reference) {
      verifyPayment(reference);
    } else {
      setStatus('error');
    }
  }, [searchParams]);

  const verifyPayment = async (reference) => {
    try {
      const response = await paymentService.verifyPayment(reference);
      setOrder(response.data.order);
      setStatus('success');
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('failed');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {status === 'success' ? (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
            {order && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-600">Order Number: <span className="font-semibold">{order.orderNumber}</span></p>
                <p className="text-sm text-gray-600">Amount: <span className="font-semibold">{formatCurrency(order.totalAmount)}</span></p>
              </div>
            )}
            <div className="space-y-3">
              <Link to="/student/orders" className="block w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">
                View Orders
              </Link>
              <Link to="/products" className="block w-full bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300">
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">Something went wrong with your payment.</p>
            <Link to="/student/cart" className="block w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700">
              Back to Cart
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerify;