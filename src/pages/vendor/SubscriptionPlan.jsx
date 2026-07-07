// src/pages/vendor/SubscriptionPlans.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import subscriptionService from '../../services/subscriptionService';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import { formatCurrency } from '../../utils/formatters';

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const getErrorMessage = (error) => {
    const errorData = error?.response?.data;
    if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      return errorData.errors.map(e => e.message).join(' • ');
    }
    return errorData?.message || error?.message || 'Something went wrong';
  };

  const fetchPlans = async () => {
    try {
      const response = await subscriptionService.getPlans();
      // Handle multiple response shapes
      const plansData = 
        response.data?.data?.plans || 
        response.data?.plans || 
        {};
      setPlans(plansData);
    } catch (error) {
      console.error('Fetch plans error:', error);
      setAlert({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planName) => {
    try {
      setSubscribing(true);
      setSelectedPlan(planName);
      setAlert(null);

      const response = await subscriptionService.initializeSubscription(planName);
      const authUrl = 
        response.data?.data?.authorizationUrl || 
        response.data?.authorizationUrl;

      if (authUrl) {
        // Redirect to Paystack payment
        window.location.href = authUrl;
      } else {
        setAlert({ type: 'error', message: 'Payment URL not received from server' });
        setSubscribing(false);
        setSelectedPlan(null);
      }
    } catch (error) {
      setAlert({ type: 'error', message: getErrorMessage(error) });
      setSubscribing(false);
      setSelectedPlan(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">Select the perfect plan for your store</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-8">
              <h3 className="text-2xl font-bold text-gray-900">Basic</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">{formatCurrency(plans.basic?.price || 0)}</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>
            <div className="px-6 py-8">
              <ul className="space-y-4">
                {plans.basic?.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe('basic')}
                disabled={subscribing}
                className="w-full mt-8 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 font-semibold disabled:bg-gray-400"
              >
                {subscribing && selectedPlan === 'basic' ? 'Processing...' : 'Get Started'}
              </button>
            </div>
          </div>

          {/* Standard Plan - POPULAR */}
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden border-4 border-indigo-600 transform scale-105">
            <div className="bg-indigo-600 px-6 py-8 relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white">Standard</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">{formatCurrency(plans.standard?.price || 0)}</span>
                <span className="text-indigo-200">/month</span>
              </div>
            </div>
            <div className="px-6 py-8">
              <ul className="space-y-4">
                {plans.standard?.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe('standard')}
                disabled={subscribing}
                className="w-full mt-8 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-gray-400"
              >
                {subscribing && selectedPlan === 'standard' ? 'Processing...' : 'Get Started'}
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
              <h3 className="text-2xl font-bold text-white">Premium</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">{formatCurrency(plans.premium?.price || 0)}</span>
                <span className="text-purple-200">/month</span>
              </div>
            </div>
            <div className="px-6 py-8">
              <ul className="space-y-4">
                {plans.premium?.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe('premium')}
                disabled={subscribing}
                className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 font-semibold disabled:bg-gray-400"
              >
                {subscribing && selectedPlan === 'premium' ? 'Processing...' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p>All plans include 30 days access. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;