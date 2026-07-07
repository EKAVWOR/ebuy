// src/pages/public/Login.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import authService from '../../services/authService';
import Alert from '../../components/common/Alert';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Show message if redirected from expired session
  useEffect(() => {
    if (searchParams.get('session') === 'expired') {
      setAlert({ 
        type: 'warning', 
        message: '⏱️ Your session has expired. Please login again.' 
      });
    } else if (searchParams.get('registered') === 'true') {
      setAlert({ 
        type: 'success', 
        message: '✅ Registration successful! Please login to continue.' 
      });
    } else if (searchParams.get('approved') === 'true') {
      setAlert({ 
        type: 'success', 
        message: '🎉 Your vendor account has been approved! You can now login.' 
      });
    }
  }, [searchParams]);

  // Extract user-friendly error message
  const getErrorMessage = (error) => {
    const errorData = error?.response?.data;
    const statusCode = error?.response?.status;

    // Handle validation errors array
    if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      return errorData.errors.map(e => e.message).join(' • ');
    }

    // Use backend message if available
    if (errorData?.message) {
      return errorData.message;
    }

    // Fallback based on status code
    if (statusCode === 401) return '❌ Invalid email or password. Please try again.';
    if (statusCode === 403) return '⚠️ Access denied. Your account may be pending approval or suspended.';
    if (statusCode === 404) return '❌ No account found with this email.';
    if (statusCode === 429) return '⏱️ Too many attempts. Please try again in a few minutes.';
    if (statusCode >= 500) return '🔧 Server error. Please try again in a moment.';
    if (error?.message === 'Network Error') return '🌐 Cannot connect to server. Check your internet connection.';
    if (error?.code === 'ECONNABORTED') return '⏱️ Request timed out. Please try again.';

    return error?.message || 'Login failed. Please try again.';
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setAlert(null);

      const response = await authService.login(data);
      dispatch(setCredentials(response.data));

      // Show success briefly then redirect
      setAlert({ type: 'success', message: '✅ Login successful! Redirecting...' });

      const { role } = response.data.user;

      setTimeout(() => {
        switch (role) {
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'vendor':
            navigate('/vendor/dashboard');
            break;
          case 'sug':
            navigate('/sug/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate('/');
        }
      }, 800);
    } catch (error) {
      console.error('Login error:', error);
      setAlert({ type: 'error', message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Sign In to eBuy</h2>
          <p className="text-gray-600 mt-2">Welcome back!</p>
        </div>

        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Please enter a valid email address'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@university.edu"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password with show/hide toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { 
                    value: 6, 
                    message: 'Password must be at least 6 characters' 
                  }
                })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-lg"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link 
              to="/forgot-password" 
              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;