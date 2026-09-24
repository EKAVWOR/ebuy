// src/layouts/Dashboard.jsx
import React, { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const DashboardLayout = ({ title = "Dashboard", menuItems = [], children, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useMemo(() => {
    setMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const baseLink =
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200";
  const inactive = "text-slate-600 hover:text-slate-900 hover:bg-slate-50";
  const active =
    "active text-slate-900 bg-blue-50 border border-blue-100 shadow-sm";

  const LogoutButton = ({ variant = "sidebar" }) => (
    <motion.button
      type="button"
      onClick={() => {
        if (!onLogout) return;
        const ok = window.confirm("Logout now?");
        if (ok) onLogout();
      }}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={
        variant === "topbar"
          ? "rounded-xl px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 transition inline-flex items-center gap-2"
          : "w-full rounded-xl px-3 py-2.5 bg-white border border-orange-200 hover:bg-orange-50 transition inline-flex items-center gap-2"
      }
    >
      <span
        className={
          variant === "topbar"
            ? "text-slate-900"
            : "text-orange-700"
        }
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
        </svg>
      </span>
      <span className={variant === "topbar" ? "text-sm text-slate-700" : "text-sm text-orange-800"}>
        Logout
      </span>
    </motion.button>
  );

  const Sidebar = () => (
    <div className="h-full flex flex-col">
      <div className="px-4 py-5 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-slate-900 font-semibold truncate">{title}</p>
            <p className="text-xs text-slate-500 mt-1 truncate">
              Manage everything in one place
            </p>
          </div>
          <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.45)]" />
        </div>
      </div>

      <nav className="p-3 space-y-1 overflow-y-auto bg-white">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `${baseLink} ${isActive ? active : inactive}`}
          >
            <span className="shrink-0 grid place-items-center rounded-lg p-2 border border-slate-200 bg-white group-hover:border-blue-100 transition">
              <span className="text-slate-900">{item.icon}</span>
            </span>

            <span className="truncate">{item.label}</span>

            <span className="ml-auto h-2 w-2 rounded-full bg-transparent group-[.active]:bg-orange-500" />
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t border-slate-200 bg-white space-y-3">
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
          <p className="text-xs text-slate-600">Tip: Use the menu to navigate.</p>
        </div>

        {/* Logout in sidebar footer */}
        {onLogout && <LogoutButton variant="sidebar" />}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* subtle background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />
      </div>

      <div className="relative flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-[280px] h-screen sticky top-0">
          <div className="h-full bg-white border-r border-slate-200">
            <Sidebar />
          </div>
        </aside>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/30 z-40"
              />
              <motion.aside
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className="lg:hidden fixed left-0 top-0 z-50 w-[280px] h-screen bg-white border-r border-slate-200"
              >
                <Sidebar />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Topbar */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
            <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden inline-flex items-center justify-center rounded-xl p-2 bg-white border border-slate-200 hover:bg-slate-50 transition"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">Dashboard Panel</p>
                <p className="text-xs text-slate-500 truncate">{location.pathname}</p>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 bg-slate-50 border border-slate-200">
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="text-xs text-slate-600">Live</span>
                </div>

                {/* Logout in topbar (optional, but handy) */}
                {onLogout && <LogoutButton variant="topbar" />}
              </div>
            </div>
          </header>

          {/* Page container */}
          <main className="px-4 sm:px-6 py-5 sm:py-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: "easeOut" }}>
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;