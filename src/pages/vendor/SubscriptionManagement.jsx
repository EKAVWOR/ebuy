// src/pages/vendor/SubscriptionManagement.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import subscriptionService from '../../services/subscriptionService';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { formatCurrency, formatDate } from '../../utils/formatters';

const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renewing, setRenewing] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const getErrorMessage = (error) => {
    const errorData = error?.response?.data;
    if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      return errorData.errors.map(e => e.message).join(' • ');
    }
    return errorData?.message || error?.message || 'Something went wrong';
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subRes, histRes] = await Promise.all([
        subscriptionService.getMySubscription(),
        subscriptionService.getSubscriptionHistory()
      ]);

      // Handle multiple response shapes
      setSubscription(
        subRes.data?.data?.subscription || subRes.data?.subscription || null
      );
      setHistory(
        histRes.data?.data?.subscriptions || histRes.data?.subscriptions || []
      );
    } catch (error) {
      console.error('Fetch subscription error:', error);
      setAlert({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async () => {
    try {
      setRenewing(true);
      setAlert(null);

      const response = await subscriptionService.renewSubscription();
      const authUrl = 
        response.data?.data?.authorizationUrl || 
        response.data?.authorizationUrl;
      
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        setAlert({ type: 'error', message: 'Payment URL not received from server' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: getErrorMessage(error) });
      setRenewing(false);
    }
  };

  const handleUpgrade = () => {
    navigate('/vendor/subscription/plans');
  };

  const getDaysRemaining = () => {
    if (!subscription?.expiryDate) return 0;
    const now = new Date();
    const expiry = new Date(subscription.expiryDate);
    const diff = expiry - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining();
  const isExpired = subscription?.status === 'expired' || daysRemaining < 0;
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;

  if (loading) return <Loader />;

  if (!subscription) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No Active Subscription</h3>
          <p className="text-gray-600 mb-6">Subscribe to a plan to create and manage your store</p>
          <button
            onClick={handleUpgrade}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold"
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <h2 className="text-2xl font-bold text-gray-800">Subscription Management</h2>

      {/* Current Subscription Card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className={`p-6 ${
          subscription.plan === 'premium' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' :
          subscription.plan === 'standard' ? 'bg-indigo-600' : 'bg-gray-900'
        } text-white`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold capitalize">{subscription.plan} Plan</h3>
              <p className="text-sm opacity-90 mt-1">{formatCurrency(subscription.amount)}/month</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              subscription.status === 'active' ? 'bg-green-500' :
              subscription.status === 'expired' ? 'bg-red-500' : 'bg-yellow-500'
            }`}>
              {subscription.status}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Expiry Info */}
          <div className={`p-4 rounded-lg ${
            isExpired ? 'bg-red-50 border border-red-200' :
            isExpiringSoon ? 'bg-yellow-50 border border-yellow-200' :
            'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">
                  {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Valid Until'}
                </p>
                <p className="text-sm text-gray-600">{formatDate(subscription.expiryDate)}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {isExpired ? (
                    <span className="text-red-600">Expired</span>
                  ) : (
                    <span className={isExpiringSoon ? 'text-yellow-600' : 'text-green-600'}>
                      {daysRemaining} days
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500">remaining</p>
              </div>
            </div>
          </div>

          {/* Plan Features */}
          {subscription.features && (
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600">Products Limit</p>
                <p className="text-xl font-bold">
                  {subscription.features.maxProducts === -1 ? 'Unlimited' : subscription.features.maxProducts}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600">Images per Product</p>
                <p className="text-xl font-bold">{subscription.features.maxImages}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600">Analytics</p>
                <p className="text-xl font-bold">{subscription.features.analytics ? '✓' : '✗'}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-gray-600">Priority Support</p>
                <p className="text-xl font-bold">{subscription.features.prioritySupport ? '✓' : '✗'}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4 pt-4">
            {(isExpired || isExpiringSoon) && (
              <button
                onClick={handleRenew}
                disabled={renewing}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400"
              >
                {renewing ? 'Processing...' : 'Renew Subscription'}
              </button>
            )}
            {subscription.plan !== 'premium' && (
              <button
                onClick={handleUpgrade}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
              >
                Upgrade Plan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No payment history yet
                  </td>
                </tr>
              ) : (
                history.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(sub.createdAt)}</td>
                    <td className="px-6 py-4 text-sm font-medium capitalize">{sub.plan}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(sub.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sub.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        sub.paymentStatus === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sub.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(sub.expiryDate)}</td>
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

export default SubscriptionManagement;