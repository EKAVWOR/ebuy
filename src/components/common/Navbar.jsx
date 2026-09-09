// src/components/common/Navbar.jsx

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import authService from '../../services/authService';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = items?.length || 0;

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    navigate('/login');
    setIsMenuOpen(false);
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'student':
        return '/student/dashboard';
      case 'vendor':
        return '/vendor/dashboard';
      case 'sug':
        return '/sug/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? 'text-slate-900 dark:text-slate-50'
      : 'text-slate-500 dark:text-slate-400';

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main row */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm shadow-blue-500/40 dark:bg-blue-500">
                e
              </div>
              <div className="leading-tight">
                <span className="block text-lg font-semibold text-slate-900 dark:text-slate-50">
                  eBuy
                </span>
                <span className="block text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  Campus marketplace
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 text-sm font-medium">
              <Link
                to="/products"
                className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${isActive(
                  '/products'
                )}`}
              >
                Products
              </Link>
              <Link
                to="/stores"
                className={`transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${isActive(
                  '/stores'
                )}`}
              >
                Stores
              </Link>
            </div>

            {/* Right side (auth/cart) */}
            <div className="flex items-center gap-4">
              {/* Cart (students only) */}
              {isAuthenticated && user?.role === 'student' && (
                <Link
                  to="/student/cart"
                  className="relative inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-slate-600 shadow-sm hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 inline-flex h-4.5 min-w-[1.15rem] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold text-white shadow-sm shadow-amber-500/60">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {isAuthenticated ? (
                // User dropdown
                <div className="relative group">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white dark:bg-blue-500">
                      {user?.fullname?.charAt(0) || 'U'}
                    </div>
                    <span className="max-w-[140px] truncate">
                      {user?.fullname}
                    </span>
                    <svg
                      className="w-4 h-4 text-slate-400 group-hover:text-current"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-lg shadow-slate-200/80 transition-opacity dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-sm font-medium">
                  <Link
                    to="/login"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/40 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile right side: cart + burger */}
          <div className="flex items-center gap-3 md:hidden">
            {isAuthenticated && user?.role === 'student' && (
              <Link
                to="/student/cart"
                className="relative inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-1.5 text-slate-600 shadow-sm hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 inline-flex h-4.5 min-w-[1.1rem] items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-1.5 text-slate-700 shadow-sm hover:border-blue-500 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-400 dark:hover:text-blue-300 transition-colors"
              aria-label="Toggle navigation"
              aria-expanded={isMenuOpen}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
          <div className="space-y-1 px-4 py-3 text-sm font-medium">
            <Link
              to="/products"
              onClick={() => setIsMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive(
                '/products'
              )}`}
            >
              Products
            </Link>
            <Link
              to="/stores"
              onClick={() => setIsMenuOpen(false)}
              className={`block rounded-lg px-3 py-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive(
                '/stores'
              )}`}
            >
              Stores
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;