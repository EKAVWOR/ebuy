// src/pages/public/Home.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import ProductCard from '../../components/cards/ProductCard';
import productService from '../../services/productService';
import cartService from '../../services/cartService';
import { setCart } from '../../store/slices/cartSlice';

// ============================================================
// CONSTANTS & DATA
// ============================================================

const HERO_SLIDES = [
  {
    image:
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop',
    title: 'Latest Electronics',
    subtitle: 'Premium gadgets at student prices',
    tag: 'Trending',
  },
  {
    image:
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=600&fit=crop',
    title: 'Fashion & Accessories',
    subtitle: 'Style that fits your budget',
    tag: 'Hot deals',
  },
  {
    image:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop',
    title: 'Books & Stationery',
    subtitle: 'Everything for your studies',
    tag: 'Essentials',
  },
  {
    image:
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
    title: 'Tech & Laptops',
    subtitle: 'Power up your productivity',
    tag: 'New arrival',
  },
  {
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
    title: 'Home & Living',
    subtitle: 'Make your space comfortable',
    tag: 'Popular',
  },
];

const TRUST_BADGES = [
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: '100% Secure',
    subtitle: 'Safe shopping',
  },
  {
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    title: 'Fast Delivery',
    subtitle: 'Same‑day dispatch',
  },
  {
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    title: 'Best Prices',
    subtitle: 'Student discounts',
  },
  {
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    title: 'Verified Sellers',
    subtitle: 'Trusted community',
  },
];

const CATEGORIES = [
  {
    name: 'Electronics',
    image:
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    count: '1,234 items',
    color: 'from-blue-700 to-blue-500',
  },
  {
    name: 'Fashion',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
    count: '856 items',
    color: 'from-yellow-600 to-yellow-400',
  },
  {
    name: 'Books',
    image:
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=300&fit=crop',
    count: '2,145 items',
    color: 'from-blue-600 to-yellow-500',
  },
  {
    name: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=300&fit=crop',
    count: '645 items',
    color: 'from-yellow-600 to-blue-600',
  },
  {
    name: 'Sports',
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
    count: '432 items',
    color: 'from-blue-700 to-blue-500',
  },
  {
    name: 'Home & Living',
    image:
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=300&fit=crop',
    count: '789 items',
    color: 'from-yellow-500 to-blue-500',
  },
  {
    name: 'Beauty',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
    count: '521 items',
    color: 'from-blue-600 to-yellow-400',
  },
  {
    name: 'Food & Drinks',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    count: '312 items',
    color: 'from-yellow-600 to-yellow-500',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Sign up',
    description: 'Create your free account with student email.',
    image:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
  },
  {
    step: '02',
    title: 'Browse products',
    description: 'Find what you need from thousands of items.',
    image:
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  {
    step: '03',
    title: 'Make purchase',
    description: 'Secure checkout with multiple payment options.',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
  },
  {
    step: '04',
    title: 'Get delivered',
    description: 'Receive your items on campus in no time.',
    image:
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&h=300&fit=crop',
    icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Johnson',
    role: 'Computer Science student',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    text: 'eBuy made selling my old textbooks so easy. I love how secure and fast the platform is.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Business Administration',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    text: 'Best marketplace for campus needs. Found everything I needed for my dorm room.',
    rating: 5,
  },
  {
    name: 'Emily Davis',
    role: 'Engineering student',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    text: 'The verification system makes me feel safe. Great platform for student entrepreneurs.',
    rating: 5,
  },
];

const STATS = [
  { value: '10K+', label: 'Active users' },
  { value: '5K+', label: 'Products' },
  { value: '98%', label: 'Satisfaction' },
];

const FEATURES = [
  {
    title: 'Secure payments',
    description: 'Safe and secure transactions powered by Paystack.',
    image:
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    gradient: 'from-blue-600 to-amber-500',
  },
  {
    title: 'Fast delivery',
    description: 'Quick delivery within campus.',
    image:
      'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=200&fit=crop',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    gradient: 'from-amber-500 to-blue-600',
  },
  {
    title: 'Student verified',
    description: 'Every user is a verified student.',
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=200&fit=crop',
    icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    gradient: 'from-blue-500 to-amber-600',
  },
];

const CTA_PERKS = ['Free to start', 'No hidden fees', '24/7 support'];

const HERO_BENEFITS = [
  'Verified buyers and sellers – student‑only community.',
  'Secure payments with escrow‑style protection.',
  'Same‑day pickup or on‑campus delivery on most items.',
];

// ============================================================
// REUSABLE UI COMPONENTS
// ============================================================

const SvgIcon = ({ path, className = 'w-6 h-6' }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d={path}
    />
  </svg>
);

const SectionHeader = ({ title, highlight, subtitle }) => (
  <div className="mb-12 text-center">
    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
      {title}{' '}
      <span className="bg-gradient-to-r from-blue-600 to-amber-400 bg-clip-text text-transparent">
        {highlight}
      </span>
    </h2>
    {subtitle && (
      <p className="mt-3 max-w-2xl mx-auto text-base md:text-lg text-slate-500 dark:text-slate-400">
        {subtitle}
      </p>
    )}
  </div>
);

const GradientIcon = ({ path, gradient }) => (
  <div
    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shadow-blue-900/30`}
  >
    <SvgIcon path={path} className="w-8 h-8 text-white" />
  </div>
);

// ============================================================
// DARK MODE TOGGLE
// ============================================================

const DarkModeToggle = ({ darkMode, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label="Toggle dark mode"
    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    className="fixed bottom-6 right-6 z-[100] rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 shadow-lg shadow-slate-900/30 backdrop-blur hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
  >
    <div className="p-2">
      {darkMode ? (
        <svg
          className="w-5 h-5 text-amber-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-blue-700"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </div>
  </button>
);

// ============================================================
// HERO SLIDER
// ============================================================

const HeroSlider = ({ slides, currentSlide, onPrev, onNext, onDotClick }) => (
  <div className="relative h-[420px] md:h-[460px] rounded-3xl border border-slate-800 bg-slate-950/70 shadow-[0_24px_70px_rgba(15,23,42,0.85)] overflow-hidden backdrop-blur">
    {slides.map((slide, index) => (
      <div
        key={index}
        className={`absolute inset-0 transition-all duration-700 ease-out ${
          index === currentSlide
            ? 'opacity-100 translate-x-0'
            : index < currentSlide
            ? 'opacity-0 -translate-x-6'
            : 'opacity-0 translate-x-6'
        }`}
      >
        <div className="relative w-full h-full">
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/10" />

          <div className="relative flex flex-col justify-between h-full p-6 md:p-8">
            <div className="flex items-center justify-between text-xs font-medium text-slate-200/80">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {slide.tag}
              </span>
              <span className="tracking-[0.18em] uppercase text-slate-400">
                {String(index + 1).padStart(2, '0')}/{slides.length}
              </span>
            </div>

            <div className="mt-auto">
              <h3 className="text-2xl md:text-3xl font-semibold text-white">
                {slide.title}
              </h3>
              <p className="mt-2 text-sm md:text-base text-slate-200/90">
                {slide.subtitle}
              </p>
              <Link
                to="/products"
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow shadow-amber-500/40 hover:bg-amber-300 transition-colors"
              >
                Shop this category
                <SvgIcon
                  path="M13 7l5 5m0 0l-5 5m5-5H6"
                  className="ml-2 h-4 w-4"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    ))}

    {/* Navigation */}
    <button
      type="button"
      onClick={onPrev}
      aria-label="Previous hero slide"
      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-slate-700/80 bg-slate-900/80 p-2 text-slate-200 hover:bg-slate-800 hover:border-slate-500 transition-colors"
    >
      <SvgIcon path="M15 19l-7-7 7-7" className="w-5 h-5" />
    </button>
    <button
      type="button"
      onClick={onNext}
      aria-label="Next hero slide"
      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-slate-700/80 bg-slate-900/80 p-2 text-slate-200 hover:bg-slate-800 hover:border-slate-500 transition-colors"
    >
      <SvgIcon path="M9 5l7 7-7 7" className="w-5 h-5" />
    </button>

    {/* Dots */}
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
      {slides.map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onDotClick(i)}
          className={`h-1.5 rounded-full transition-all ${
            i === currentSlide
              ? 'w-6 bg-amber-400'
              : 'w-2 bg-slate-500 hover:bg-slate-300'
          }`}
        />
      ))}
    </div>

    {/* Floating product highlight */}
    <div className="absolute top-5 left-5 rounded-2xl border border-slate-700 bg-slate-900/90 p-3 shadow-lg shadow-slate-900/70 flex items-center gap-3 max-w-xs">
      <img
        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
        alt="Premium headphones"
        className="h-14 w-14 rounded-xl object-cover"
      />
      <div>
        <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
          <span className="text-xs">★</span> Top seller
        </p>
        <p className="text-sm font-medium text-slate-50">
          Premium Headphones
        </p>
        <p className="text-xs font-semibold text-amber-300">₦15,999</p>
      </div>
    </div>
  </div>
);

// ============================================================
// SECTION COMPONENTS
// ============================================================

const HeroSection = ({ currentSlide, onPrev, onNext, onDotClick }) => (
  <section className="relative overflow-hidden bg-slate-950 text-white">
    {/* background accents */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-600/40 blur-3xl" />
      <div className="absolute -bottom-32 right-[-6rem] h-80 w-80 rounded-full bg-amber-500/40 blur-3xl" />
      <div className="absolute inset-y-0 left-1/3 w-px bg-gradient-to-b from-transparent via-slate-700/40 to-transparent" />
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pb-28">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center">
        {/* Left: copy */}
        <div>
          <div className="inline-flex items-center rounded-full border border-slate-700/70 bg-slate-900/70 px-3.5 py-1.5 text-xs font-medium text-slate-200/80 mb-6">
            <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Campus marketplace • Live in your school
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-50">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
              eBuy
            </span>
            <span className="block mt-3 text-slate-200/95">
              The campus marketplace that actually feels modern.
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base md:text-lg text-slate-300/90">
            Discover verified deals from fellow students and trusted vendors —
            from textbooks and tech to fashion and household essentials.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              className="group inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm md:text-base font-semibold text-white shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition-colors"
            >
              Start shopping
              <SvgIcon
                path="M13 7l5 5m0 0l-5 5m5-5H6"
                className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform"
              />
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl border border-slate-500/80 bg-slate-950/40 px-6 py-3 text-sm md:text-base font-semibold text-slate-100 hover:bg-slate-900 hover:border-slate-300 transition-colors"
            >
              <SvgIcon
                path="M13 10V3L4 14h7v7l9-11h-7z"
                className="mr-2 h-4 w-4"
              />
              Become a vendor
            </Link>
          </div>

          {/* benefits */}
          <ul className="mt-6 space-y-2 text-sm text-slate-300">
            {HERO_BENEFITS.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <svg
                    viewBox="0 0 20 20"
                    className="h-3 w-3"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L8.5 11.586l6.543-6.543a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* stats */}
          <div className="mt-8 grid max-w-md grid-cols-3 gap-4">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-700/70 bg-slate-950/60 px-4 py-3 text-center"
              >
                <div className="text-xl md:text-2xl font-semibold text-slate-50">
                  {value}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wide text-slate-400">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: hero slider */}
        <div className="relative">
          <HeroSlider
            slides={HERO_SLIDES}
            currentSlide={currentSlide}
            onPrev={onPrev}
            onNext={onNext}
            onDotClick={onDotClick}
          />
        </div>
      </div>
    </div>

    {/* bottom subtle divider */}
    <div className="absolute bottom-0 left-0 right-0 text-slate-50">
      <svg
        viewBox="0 0 1440 80"
        className="w-full h-auto text-slate-50 dark:text-slate-900"
        fill="currentColor"
      >
        <path d="M0 80L60 70C120 60 240 40 360 30C480 20 600 20 720 25C840 30 960 40 1080 45C1200 50 1320 50 1380 50L1440 50V80H0Z" />
      </svg>
    </div>
  </section>
);

const TrustBadgesSection = () => (
  <section className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800 py-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
        Trusted by thousands of students across campuses
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_BADGES.map((badge) => (
          <div
            key={badge.title}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm shadow-slate-200/60 dark:border-slate-700 dark:bg-slate-900/70 dark:shadow-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
              <SvgIcon path={badge.icon} className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {badge.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {badge.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CategoriesSection = () => (
  <section className="py-20 bg-white dark:bg-slate-950">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        title="Browse by"
        highlight="category"
        subtitle="Jump straight into the products you care about."
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.name}
            to={`/products?category=${cat.name.toLowerCase()}`}
            className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-slate-900/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="h-56">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${cat.color} mix-blend-multiply opacity-50 group-hover:opacity-70 transition-opacity`}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h3 className="text-lg font-semibold text-white drop-shadow-lg">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-50/90 font-medium">
                  {cat.count}
                </p>
                <div className="mt-3 opacity-0 translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="inline-flex items-center text-xs font-semibold text-slate-950 bg-amber-400/95 rounded-full px-3 py-1">
                    Explore
                    <SvgIcon
                      path="M17 8l4 4m0 0l-4 4m4-4H3"
                      className="ml-1 h-3 w-3"
                    />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="py-20 bg-slate-50 dark:bg-slate-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        title="Why students choose"
        highlight="eBuy"
        subtitle="Everything you need to buy and sell safely on your campus."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURES.map((feat) => (
          <div
            key={feat.title}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="mb-5">
              <GradientIcon path={feat.icon} gradient={feat.gradient} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              {feat.title}
            </h3>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 flex-1">
              {feat.description}
            </p>
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700">
              <img
                src={feat.image}
                alt={feat.title}
                className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section className="py-20 bg-white dark:bg-slate-950">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        title="How it"
        highlight="works"
        subtitle="Getting started takes less than 2 minutes."
      />
      <div className="grid md:grid-cols-4 gap-8">
        {HOW_IT_WORKS.map((item, index) => (
          <div key={item.step} className="relative">
            {index < HOW_IT_WORKS.length - 1 && (
              <div className="hidden md:block absolute top-14 left-full w-full h-px bg-gradient-to-r from-blue-500 to-amber-400 opacity-40" />
            )}
            <div className="relative flex flex-col items-center text-center rounded-2xl border border-slate-100 bg-slate-50/60 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {item.step}
              </div>
              <div className="mb-4 h-32 w-full overflow-hidden rounded-xl border border-slate-100 dark:border-slate-700">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-blue-500/70 bg-white text-blue-600 dark:border-amber-400 dark:bg-slate-900 dark:text-amber-400">
                <SvgIcon path={item.icon} className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturedProductsSection = ({ products, loading, onAddToCart }) => (
  <section className="relative overflow-hidden py-20 bg-slate-50 dark:bg-slate-900">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -top-32 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-200/50 blur-3xl dark:bg-blue-900/60" />
      <div className="absolute bottom-[-6rem] right-[-4rem] h-72 w-72 rounded-full bg-amber-200/60 blur-3xl dark:bg-amber-900/60" />
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Featured products
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-500 dark:text-slate-400">
            Handpicked items students are loving this week.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center rounded-full border border-blue-600/80 bg-white px-5 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:border-amber-400/80 dark:bg-slate-900 dark:text-amber-300 dark:hover:bg-slate-800"
        >
          View all products
          <SvgIcon
            path="M17 8l4 4m0 0l-4 4m4-4H3"
            className="ml-2 h-4 w-4"
          />
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-800" />
            <div className="absolute inset-0 rounded-full border-2 border-t-blue-600 dark:border-t-amber-400 animate-spin" />
          </div>
          <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading amazing products…
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <div
              key={product._id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-20 bg-white dark:bg-slate-950">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        title="What students"
        highlight="say"
        subtitle="Real feedback from students using eBuy every day."
      />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={t.name}
            className="rounded-2xl border border-slate-100 bg-slate-50/70 p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={t.image}
                alt={t.name}
                className="h-12 w-12 rounded-full border-2 border-blue-600 dark:border-amber-400 object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {t.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: t.rating }).map((_, idx) => (
                <svg
                  key={idx}
                  className="h-4 w-4 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              “{t.text}”
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const NewsletterSection = () => (
  <section className="py-16 bg-gradient-to-r from-blue-700 via-blue-600 to-amber-500 dark:from-slate-900 dark:via-blue-900 dark:to-amber-700">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
        Stay ahead of campus deals
      </h2>
      <p className="mt-3 text-sm md:text-base text-blue-100/90">
        Subscribe to receive weekly highlights and exclusive student‑only
        offers.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full sm:w-auto flex-1 rounded-full border border-white/60 bg-white/95 px-5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white/80"
        />
        <button
          type="button"
          className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/60 hover:bg-slate-900 transition-colors"
        >
          Subscribe
        </button>
      </div>
      <p className="mt-3 text-[11px] text-blue-100/90">
        We respect your inbox. Unsubscribe at any time.
      </p>
    </div>
  </section>
);

const CTASection = () => (
  <section className="relative overflow-hidden bg-slate-950 text-white py-20">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -top-24 left-10 h-48 w-48 rounded-full bg-blue-600/40 blur-3xl" />
      <div className="absolute bottom-[-6rem] right-[-4rem] h-64 w-64 rounded-full bg-amber-500/40 blur-3xl" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_#ffffff_0,_transparent_55%)]" />
    </div>

    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide uppercase text-blue-100 mb-5">
        <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        Join 10,000+ student vendors
      </div>

      <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
        Ready to turn your items into extra cash?
      </h2>
      <p className="mt-4 max-w-xl mx-auto text-sm md:text-base text-slate-300">
        Create a free vendor account in minutes, list your products, and start
        selling to verified students on your campus.
      </p>

      <Link
        to="/register"
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-amber-400 px-8 py-3.5 text-sm md:text-base font-semibold text-slate-950 shadow-xl shadow-amber-500/40 hover:bg-amber-300 transition-transform hover:-translate-y-0.5"
      >
        <SvgIcon
          path="M12 4v16m8-8H4"
          className="mr-2 h-5 w-5"
        />
        Create vendor account
        <SvgIcon
          path="M13 7l5 5m0 0l-5 5m5-5H6"
          className="ml-2 h-4 w-4"
        />
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-200">
        {CTA_PERKS.map((perk) => (
          <div
            key={perk}
            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1"
          >
            <svg
              className="mr-2 h-3.5 w-3.5 text-emerald-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {perk}
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ============================================================
// GLOBAL STYLES (lightweight animation helpers)
// ============================================================

const GlobalStyles = () => (
  <style>{`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeInUp { 
      opacity: 0;
      animation: fadeInUp 0.6s ease-out forwards;
    }
  `}</style>
);

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================

const Home = () => {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('darkMode') || 'false');
    } catch {
      return false;
    }
  });

  // Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getAllProducts({
          limit: 8,
          sort: 'popular',
        });
        setProducts(res.data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % HERO_SLIDES.length),
      6000
    );
    return () => clearInterval(timer);
  }, []);

  // Dark mode class toggle on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Handlers
  const handleAddToCart = useCallback(
    async (product) => {
      try {
        const res = await cartService.addToCart(product._id, 1);
        dispatch(setCart(res.data));
        // In production, replace with a toast system
        alert('Added to cart!');
      } catch (err) {
        alert(err.message);
      }
    },
    [dispatch]
  );

  const nextSlide = useCallback(
    () => setCurrentSlide((p) => (p + 1) % HERO_SLIDES.length),
    []
  );

  const prevSlide = useCallback(
    () => setCurrentSlide((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length),
    []
  );

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  return (
    <div className="overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      <GlobalStyles />

      <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} />

      <HeroSection
        currentSlide={currentSlide}
        onPrev={prevSlide}
        onNext={nextSlide}
        onDotClick={setCurrentSlide}
      />
      <TrustBadgesSection />
      <CategoriesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FeaturedProductsSection
        products={products}
        loading={loading}
        onAddToCart={handleAddToCart}
      />
      <TestimonialsSection />
      <NewsletterSection />
      <CTASection />
    </div>
  );
};

export default Home;