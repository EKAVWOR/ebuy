import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, trend, trendValue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="
        group relative overflow-hidden rounded-2xl
        bg-white
        border border-slate-200
        shadow-sm hover:shadow-md
        transition-shadow
      "
    >
      {/* subtle top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-slate-900 via-blue-600 to-orange-500" />

      {/* soft glow on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <div className="relative p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-slate-600 mb-1 truncate">
              {title}
            </p>

            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight truncate">
              {value}
            </h3>

            {trend && (
              <p
                className={`text-xs sm:text-sm mt-2 ${
                  trend === "up" ? "text-emerald-600" : "text-orange-600"
                }`}
              >
                <span className="font-semibold">
                  {trend === "up" ? "↑" : "↓"} {trendValue}
                </span>
                <span className="text-slate-500 ml-1">vs last month</span>
              </p>
            )}
          </div>

          <div className="shrink-0">
            <div
              className="
                relative grid place-items-center
                rounded-2xl p-2.5 sm:p-3
                bg-gradient-to-br from-slate-900 via-blue-700 to-slate-900
                shadow-[0_10px_25px_rgba(2,6,23,0.18)]
              "
            >
              {/* small orange indicator */}
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.55)]" />
              <div className="w-5 h-5 sm:w-6 sm:h-6 text-white">{icon}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;