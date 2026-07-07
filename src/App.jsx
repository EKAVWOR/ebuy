// src/App.jsx (COMPLETE VERSION)

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from './components/common/Loader';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import StudentLayout from './layouts/StudentLayout';
import VendorLayout from './layouts/VendorLayout';
import SugLayout from './layouts/SugLayout';
import AdminLayout from './layouts/AdminLayout';

import VendorOrderDetails from './pages/vendor/VendorOrderDetails';
import StudentOrderDetails from './pages/student/StudentOrderDetails';

// Lazy load pages
const Home = lazy(() => import('./pages/public/Home'));
const Login = lazy(() => import('./pages/public/Login'));
const Register = lazy(() => import('./pages/public/Register'));
const Products = lazy(() => import('./pages/public/Products'));
const ProductDetails = lazy(() => import('./pages/public/ProductDetails'));
const Stores = lazy(() => import('./pages/public/Stores'));
const StoreDetails = lazy(() => import('./pages/public/StoreDetails'));

const StudentDashboard = lazy(() => import('./pages/student/Dashboard'));
const Cart = lazy(() => import('./pages/student/Cart'));
const Checkout = lazy(() => import('./pages/student/Checkout'));
const PaymentVerify = lazy(() => import('./pages/student/PaymentVerifyt'));
const StudentOrders = lazy(() => import('./pages/student/Orders'));
const OrderDetails = lazy(() => import('./pages/student/OrderDetails'));

const VendorDashboard = lazy(() => import('./pages/vendor/Dashboard'));
const VendorStore = lazy(() => import('./pages/vendor/Store'));
const VendorProducts = lazy(() => import('./pages/vendor/Products'));
const AddProduct = lazy(() => import('./pages/vendor/AddProduct'));
const EditProduct = lazy(() => import('./pages/vendor/EditProduct'));
const VendorOrders = lazy(() => import('./pages/vendor/Orders'));
const VendorWallet = lazy(() => import('./pages/vendor/Wallet'));
const Withdrawals = lazy(() => import('./pages/vendor/Withdrawals'));
const VendorAnalytics = lazy(() => import('./pages/vendor/Dashboard'));

const SugDashboard = lazy(() => import('./pages/sug/Dashboard'));
const VendorApproval = lazy(() => import('./pages/sug/VendorApproval'));
const SugCommissions = lazy(() => import('./pages/sug/Commissions'));
const Students = lazy(() => import('./pages/sug/Students'));
const Reports = lazy(() => import('./pages/sug/Dashboard'));

const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/admin/Users'));
const AdminStores = lazy(() => import('./pages/admin/Stores'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminPayments = lazy(() => import('./pages/admin/Payments'));
const AdminWithdrawals = lazy(() => import('./pages/admin/Withdrawals'));
const CommissionSettings = lazy(() => import('./pages/admin/CommissionSettings'));
const Revenue = lazy(() => import('./pages/admin/Revenue'));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics'));

const Profile = lazy(() => import('./pages/public/Login'));
const NotFound = lazy(() => import('./pages/public/NotFound'));

const SubscriptionPlans = lazy(() => import('./pages/vendor/SubscriptionPlan'));
const SubscriptionManagement = lazy(() => import('./pages/vendor/SubscriptionManagement'));
const SubscriptionVerify = lazy(() => import('./pages/vendor/SubscriptionVerification'));
const AdminSubscriptions = lazy(() => import('./pages/admin/Subscriptions'));

const StudentRegistry = lazy(() => import('./pages/sug/StudentRegistry'));
import SugStores from './pages/sug/SugStores';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (isAuthenticated && user) {
    const dashboardRoutes = {
      student: '/student/dashboard',
      vendor: '/vendor/dashboard',
      sug: '/sug/dashboard',
      admin: '/admin/dashboard'
    };
    return <Navigate to={dashboardRoutes[user.role] || '/'} replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/stores/:id" element={<StoreDetails />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          {/* Payment Verification (Public but requires reference) */}
          <Route path="/payment/verify" element={<PaymentVerify />} />

          {/* Profile (Shared for all authenticated users) */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/student" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<StudentOrders />} />
            <Route path="orders/:id" element={<StudentOrderDetails />} />
            <Route path="orders/:id" element={<OrderDetails />} />
          </Route>

          {/* Vendor Routes */}
          <Route path="/vendor" element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="store" element={<VendorStore />} />
            <Route path="products" element={<VendorProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="orders" element={<VendorOrders />} />
            <Route path="wallet" element={<VendorWallet />} />
            <Route path="withdrawals" element={<Withdrawals />} />
            <Route path="analytics" element={<VendorAnalytics />} />
            <Route path="orders/:id" element={<VendorOrderDetails />} />
            <Route path="subscription/plans" element={<SubscriptionPlans />} />
            <Route path="subscription" element={<SubscriptionManagement />} />
           <Route path="subscription/verify" element={<SubscriptionVerify />} />
          </Route>

          {/* SUG Routes */}
          <Route path="/sug" element={
            <ProtectedRoute allowedRoles={['sug']}>
              <SugLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<SugDashboard />} />
            <Route path="vendors" element={<VendorApproval />} />
            <Route path="commissions" element={<SugCommissions />} />
            <Route path="students" element={<Students />} />
            <Route path="reports" element={<Reports />} />
            <Route path="stores" element={<SugStores />} />
            <Route path="student-registry" element={<StudentRegistry />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="stores" element={<AdminStores />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="withdrawals" element={<AdminWithdrawals />} />
            <Route path="commission-settings" element={<CommissionSettings />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="analytics" element={<AdminAnalytics />} />
             <Route path="subscriptions" element={<AdminSubscriptions />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;