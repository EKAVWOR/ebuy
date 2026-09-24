import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "../../components/cards/StatCard";
import Loader from "../../components/common/Loader";
import adminService from "../../services/adminService";
import { formatCurrency, formatDate } from "../../utils/formatters";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await adminService.getDashboardStats();
      // works whether you return raw axios response or already-unwrapped payload
      const payload = response?.data?.data ?? response?.data ?? response;
      setData(payload);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const { statistics = {}, recentActivities = {} } = data;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 sm:space-y-6"
    >
      {/* Revenue Banner (light, premium) */}
      <motion.div variants={fadeUp}>
        <div
          className="
            relative overflow-hidden rounded-2xl
            bg-gradient-to-r from-white via-blue-50 to-orange-50
            border border-slate-200
            shadow-sm
            p-4 sm:p-6
          "
        >
          {/* subtle accents */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />
          </div>

          <div className="relative flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-slate-600">Revenue Overview</p>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">
                Admin Dashboard
              </h2>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs text-slate-600">Live</span>
            </div>
          </div>

          <div className="relative mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            <div className="min-w-0">
              <p className="text-slate-600 text-xs sm:text-sm">Total Revenue</p>
              <p className="text-2xl sm:text-3xl font-semibold text-slate-900 truncate">
                {formatCurrency(statistics.revenue?.total || 0)}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                Gross successful payments
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-slate-600 text-xs sm:text-sm">Platform/Admin Revenue</p>
              <p className="text-2xl sm:text-3xl font-semibold text-slate-900 truncate">
                {formatCurrency(statistics.revenue?.platformRevenue || 0)}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                Platform earnings
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-slate-600 text-xs sm:text-sm">Total SUG Revenue</p>
              <p className="text-2xl sm:text-3xl font-semibold text-slate-900 truncate">
                {formatCurrency(statistics.revenue?.sugRevenue || 0)}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
                SUG commission total
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-slate-600 text-xs sm:text-sm">Transactions</p>
              <p className="text-2xl sm:text-3xl font-semibold text-slate-900 truncate">
                {statistics.revenue?.transactions || 0}
              </p>
              <p className="text-[11px] sm:text-xs text-orange-700/80 mt-1">
                Successful only
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        <StatCard
          title="Total Users"
          value={statistics.users?.total || 0}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />

        <StatCard
          title="Total Vendors"
          value={statistics.users?.vendors || 0}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          }
        />

        <StatCard
          title="Total Products"
          value={statistics.products?.total || 0}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
        />

        <StatCard
          title="Total Orders"
          value={statistics.orders?.total || 0}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
              />
            </svg>
          }
        />
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6"
      >
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
              Recent Orders
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest 5 orders</p>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {recentActivities.orders?.length ? (
              recentActivities.orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-slate-200 pb-3 min-w-0"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm text-slate-500 truncate">
                      {order.buyerId?.fullname}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No recent orders.</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
              Recent Users
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest 5 signups</p>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {recentActivities.users?.length ? (
              recentActivities.users.map((user) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-slate-200 pb-3 min-w-0"
                >
                  <div className="flex items-center min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-slate-900 font-semibold shrink-0">
                      {user.fullname?.charAt(0)}
                    </div>
                    <div className="ml-3 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {user.fullname}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <span className="self-start sm:self-auto px-2 py-1 text-xs rounded-full bg-orange-50 text-orange-700 border border-orange-100 capitalize shrink-0">
                    {user.role}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No recent users.</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;