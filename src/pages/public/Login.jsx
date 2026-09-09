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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Show message if redirected from expired session / registration / approval
  useEffect(() => {
    if (searchParams.get('session') === 'expired') {
      setAlert({
        type: 'warning',
        message: '⏱️ Your session has expired. Please login again.',
      });
    } else if (searchParams.get('registered') === 'true') {
      setAlert({
        type: 'success',
        message: '✅ Registration successful! Please login to continue.',
      });
    } else if (searchParams.get('approved') === 'true') {
      setAlert({
        type: 'success',
        message:
          '🎉 Your vendor account has been approved! You can now login.',
      });
    }
  }, [searchParams]);

  // Extract user-friendly error message
  const getErrorMessage = (error) => {
    const errorData = error?.response?.data;
    const statusCode = error?.response?.status;

    if (
      errorData?.errors &&
      Array.isArray(errorData.errors) &&
      errorData.errors.length > 0
    ) {
      return errorData.errors.map((e) => e.message).join(' • ');
    }

    if (errorData?.message) {
      return errorData.message;
    }

    if (statusCode === 401)
      return '❌ Invalid email or password. Please try again.';
    if (statusCode === 403)
      return '⚠️ Access denied. Your account may be pending approval or suspended.';
    if (statusCode === 404)
      return '❌ No account found with this email.';
    if (statusCode === 429)
      return '⏱️ Too many attempts. Please try again in a few minutes.';
    if (statusCode >= 500)
      return '🔧 Server error. Please try again in a moment.';
    if (error?.message === 'Network Error')
      return '🌐 Cannot connect to server. Check your internet connection.';
    if (error?.code === 'ECONNABORTED')
      return '⏱️ Request timed out. Please try again.';

    return error?.message || 'Login failed. Please try again.';
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setAlert(null);

      const response = await authService.login(data);
      dispatch(setCredentials(response.data));

      setAlert({
        type: 'success',
        message: '✅ Login successful! Redirecting...',
      });

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
        {/* Left brand / copy */}
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
            Welcome back.
          </h1>
          <p className="mt-3 text-sm text-slate-300 max-w-md">
            Sign in with your campus email to access your dashboard, track
            orders, and manage your listings.
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
              <span>Secure, campus‑only accounts.</span>
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
              <span>One login for all roles – student, vendor, SUG, admin.</span>
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
              <span>Fast sign‑in with clear feedback on any errors.</span>
            </li>
          </ul>
        </div>

        {/* Right: form card */}
        <div className="w-full">
          <div className="mx-auto max-w-md rounded-2xl bg-white px-6 py-7 shadow-xl shadow-slate-900/25 border border-slate-200 sm:px-8 dark:bg-slate-950 dark:border-slate-800">
            <div className="text-center mb-6 md:mb-7">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                Sign in to eBuy
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Enter your details to continue.
              </p>
            </div>

            {alert && (
              <div className="mb-4">
                <Alert {...alert} onClose={() => setAlert(null)} />
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">
                  Email address
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
                  placeholder="you@university.edu"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 dark:text-slate-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      // eye-off icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.94 10.94 0 0112 20c-5 0-9.27-3.11-11-8 0-1.37.35-2.66.97-3.8" />
                        <path d="M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12" />
                        <path d="M1 1l22 22" />
                      </svg>
                    ) : (
                      // eye icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${
                  loading
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
              <p>
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Mobile brand under card */}
          <div className="mt-6 text-center text-xs text-slate-400 md:hidden">
            <span>eBuy • Campus marketplace</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;