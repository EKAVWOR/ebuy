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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

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
      setAlert(null);
      await authService.verifyMatric(matricNumber);
      setVerified(true);
      setAlert({ type: 'success', message: 'Matric number verified! ✓' });
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || error.message || 'Verification failed';
      setAlert({ type: 'error', message: errorMsg });
      setVerified(false);
    } finally {
      setVerifying(false);
    }
  };

  const onSubmit = async (data) => {
    if (!verified) {
      setAlert({
        type: 'error',
        message: 'Please verify your matric number first',
      });
      return;
    }

    const payload = { ...data };
    if (!payload.matricNumber) delete payload.matricNumber;

    try {
      setLoading(true);
      setAlert(null);

      const response = await authService.register(payload);

      if (data.role === 'student') {
        // Student gets token, log in immediately
        dispatch(setCredentials(response.data));
        setAlert({
          type: 'success',
          message: 'Registration successful! Redirecting...',
        });
        setTimeout(() => navigate('/student/dashboard'), 1500);
      } else {
        // Vendor: no token yet, needs SUG approval
        setAlert({
          type: 'success',
          message:
            '✅ Registration submitted! Awaiting SUG approval. You will be notified once approved.',
        });
        setTimeout(() => navigate('/login'), 4000);
      }
    } catch (error) {
      const errorData = error?.response?.data;
      let errorMessage = 'Registration failed';

      if (
        errorData?.errors &&
        Array.isArray(errorData.errors) &&
        errorData.errors.length > 0
      ) {
        errorMessage = errorData.errors.map((e) => e.message).join(' • ');
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
        {/* Left: brand / value prop */}
        <div className="hidden md:block text-slate-50">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm shadow-blue-500/40">
              e
            </div>
            <div className="leading-tight">
              <span className="block text-lg font-semibold">eBuy</span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                Campus marketplace
              </span>
            </div>
          </Link>

          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">
            Create your eBuy account.
          </h1>
          <p className="mt-3 text-sm text-slate-300 max-w-md">
            Join a trusted marketplace built for students. Buy, sell, and manage
            your campus commerce in one place.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.586l6.543-6.543a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>Student and vendor accounts in the same platform.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.586l6.543-6.543a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>Matric verification keeps the marketplace secure.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.586l6.543-6.543a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span>Vendors get visibility to thousands of students.</span>
            </li>
          </ul>
        </div>

        {/* Right: form card */}
        <div className="w-full">
          <div className="mx-auto max-w-md rounded-2xl bg-white px-6 py-7 shadow-xl shadow-slate-900/25 border border-slate-200 sm:px-8 dark:bg-slate-950 dark:border-slate-800">
            <div className="text-center mb-6 md:mb-7">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                Create account
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Join eBuy in a few quick steps.
              </p>
            </div>

            {alert && (
              <div className="mb-4">
                <Alert {...alert} onClose={() => setAlert(null)} />
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">
                  Full name
                </label>
                <input
                  {...register('fullname', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  placeholder="John Doe"
                />
                {errors.fullname && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.fullname.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">
                  Phone number
                </label>
                <input
                  type="tel"
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^0\d{10}$/,
                      message:
                        'Phone must be 11 digits starting with 0 (e.g., 08012345678)',
                    },
                  })}
                  placeholder="08012345678"
                  maxLength={11}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Format: 11 digits starting with 0.
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">
                  Password
                </label>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                  placeholder="At least 6 characters"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">
                  I am a
                </label>
                <select
                  {...register('role', { required: true })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                >
                  <option value="student">Student</option>
                  <option value="vendor">Vendor</option>
                </select>
                {role === 'vendor' && (
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    Vendor accounts require SUG approval before you can start
                    selling.
                  </p>
                )}
              </div>

              {/* Matric Number */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">
                  Matric number
                </label>
                <div className="flex gap-2">
                  <input
                    {...register('matricNumber', {
                      required: 'Matric number is required',
                    })}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 uppercase shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                    placeholder="CS/2020/001"
                    disabled={verified}
                  />
                  <button
                    type="button"
                    onClick={verifyMatricNumber}
                    disabled={verifying || verified}
                    className={`min-w-[96px] rounded-lg px-3 text-sm font-semibold text-white shadow-sm transition-colors ${
                      verified
                        ? 'bg-emerald-500 cursor-default'
                        : verifying
                        ? 'bg-slate-400 cursor-wait'
                        : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                  >
                    {verifying ? 'Verifying…' : verified ? '✓ Verified' : 'Verify'}
                  </button>
                </div>
                {errors.matricNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.matricNumber.message}
                  </p>
                )}
                {!verified && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Click &quot;Verify&quot; to confirm you&apos;re pre‑registered
                    by SUG.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !verified}
                className={`w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${
                  loading || !verified
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Mobile brand footer */}
          <div className="mt-6 text-center text-xs text-slate-400 md:hidden">
            <span>eBuy • Campus marketplace</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;