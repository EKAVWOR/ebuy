// src/pages/vendor/SubscriptionVerify.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import subscriptionService from '../../services/subscriptionService';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/formatters';

const SubscriptionVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [subscription, setSubscription] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (reference) {
      verifySubscription(reference);
    } else {
      setStatus('error');
      setErrorMessage('No payment reference found in URL');
    }
  }, [searchParams]);

  const verifySubscription = async (reference) => {
    try {
      const response = await subscriptionService.verifySubscription(reference);
      const subData = 
        response.data?.data?.subscription || 
        response.data?.subscription;
      
      setSubscription(subData);
      setStatus('success');
    } catch (error) {
      console.error('Verification error:', error);
      const errorData = error?.response?.data;
      const message = 
        errorData?.message || 
        error?.message || 
        'Payment verification failed. Please contact support if amount was deducted.';
      setErrorMessage(message);
      setStatus('failed');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Verifying your subscription...</p>
          <p className="mt-2 text-sm text-gray-500">Please do not close this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        {status === 'success' ? (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Subscription Activated!</h2>
            <p className="text-gray-600 mb-4">Your {subscription?.plan} plan is now active</p>
            {subscription && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-600">
                  Plan: <span className="font-semibold capitalize">{subscription.plan}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Amount: <span className="font-semibold">{formatCurrency(subscription.amount)}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Valid for: <span className="font-semibold">30 days</span>
                </p>
              </div>
            )}
            <div className="space-y-3">
              <Link 
                to="/vendor/dashboard" 
                className="block w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 font-semibold"
              >
                Go to Dashboard
              </Link>
              <Link 
                to="/vendor/store" 
                className="block w-full bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 font-semibold"
              >
                Create Your Store
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Subscription Failed</h2>
            <p className="text-gray-600 mb-2">Unable to activate your subscription</p>
            {errorMessage && (
              <p className="text-sm text-red-600 mb-6 bg-red-50 p-3 rounded">
                {errorMessage}
              </p>
            )}
            <div className="space-y-3">
              <Link 
                to="/vendor/subscription/plans" 
                className="block w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 font-semibold"
              >
                Try Again
              </Link>
              <Link 
                to="/vendor/dashboard" 
                className="block w-full bg-gray-200 text-gray-700 py-3 rounded-md hover:bg-gray-300 font-semibold"
              >
                Back to Dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionVerify;