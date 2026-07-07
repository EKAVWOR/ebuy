// src/pages/public/Register.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import authService from '../../services/authService';
import Alert from '../../components/common/Alert';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [alert, setAlert] = useState(null);

  const role = watch('role', 'student');
  const matricNumber = watch('matricNumber');

  const verifyMatricNumber = async () => {
    if (!matricNumber) {
      setAlert({ type: 'error', message: 'Enter matric number first' });
      return;
    }

    try {
      setVerifying(true);
      const response = await authService.verifyMatric(matricNumber);
      setVerified(true);
      setAlert({ type: 'success', message: 'Matric number verified! ✓' });
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error.message || 'Verification failed';
      setAlert({ type: 'error', message: errorMsg });
      setVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  const onSubmit = async (data) => {
    if (!verified) {
      setAlert({ type: 'error', message: 'Please verify your matric number first' });
      return;
    }

    const payload = { ...data };
    if (!payload.matricNumber) delete payload.matricNumber;

    try {
      setLoading(true);
      const response = await authService.register(payload);
      
      if (data.role === 'student') {
        // Student gets token, log in immediately
        dispatch(setCredentials(response.data));
        setAlert({ type: 'success', message: 'Registration successful! Redirecting...' });
        setTimeout(() => navigate('/student/dashboard'), 1500);
      } else {
        // Vendor: no token yet, needs SUG approval
        setAlert({ 
          type: 'success', 
          message: '✅ Registration submitted! Awaiting SUG approval. You will be notified once approved.' 
        });
        setTimeout(() => navigate('/login'), 4000);
      }
    } catch (error) {
      // ✅ Extract detailed error message including validator arrays
      const errorData = error?.response?.data;
      let errorMessage = 'Registration failed';
      
      if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
        errorMessage = errorData.errors.map(e => e.message).join(' • ');
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Join eBuy today</p>
        </div>

        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              {...register('fullname', { 
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="John Doe"
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
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
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
                  value: /^0\d{10}$/,
                  message: 'Phone must be 11 digits starting with 0 (e.g., 08012345678)'
                }
              })}
              placeholder="08012345678"
              maxLength={11}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Format: 11 digits starting with 0
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              {...register('password', { 
                required: 'Password is required', 
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              placeholder="At least 6 characters"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              I am a:
            </label>
            <select
              {...register('role', { required: true })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            >
              <option value="student">Student</option>
              <option value="vendor">Vendor</option>
            </select>
            {role === 'vendor' && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Vendor accounts require SUG approval before you can start selling.
              </p>
            )}
          </div>

          {/* Matric Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matric Number
            </label>
            <div className="flex gap-2">
              <input
                {...register('matricNumber', { 
                  required: 'Matric number is required'
                })}
                className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 uppercase"
                placeholder="CS/2020/001"
                disabled={verified}
              />
              <button
                type="button"
                onClick={verifyMatricNumber}
                disabled={verifying || verified}
                className={`px-4 py-2 rounded-md text-white transition ${
                  verified 
                    ? 'bg-green-500 cursor-default' 
                    : verifying 
                      ? 'bg-gray-400 cursor-wait' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {verifying ? '...' : verified ? '✓ Verified' : 'Verify'}
              </button>
            </div>
            {errors.matricNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.matricNumber.message}</p>
            )}
            {!verified && (
              <p className="text-xs text-gray-500 mt-1">
                Click "Verify" to confirm you're pre-registered by SUG.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !verified}
            className={`w-full py-3 rounded-md font-semibold transition ${
              loading || !verified
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;