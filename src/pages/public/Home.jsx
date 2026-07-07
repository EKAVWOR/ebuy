// src/pages/public/Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/cards/ProductCard';
import productService from '../../services/productService';
import { useDispatch } from 'react-redux';
import cartService from '../../services/cartService';
import { setCart } from '../../store/slices/cartSlice';

const Home = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productService.getAllProducts({ limit: 8, sort: 'popular' });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await cartService.addToCart(product._id, 1);
      dispatch(setCart(response.data));
      alert('Added to cart!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white py-24 md:py-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
          
          {/* Floating Icons */}
          <div className="absolute top-20 left-10 animate-float">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <svg className="w-8 h-8 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
          
          <div className="absolute top-40 right-20 animate-float animation-delay-1000">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-xl">
              <svg className="w-10 h-10 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          
          <div className="absolute bottom-32 left-1/4 animate-float animation-delay-2000">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-xl transform rotate-12">
              <svg className="w-7 h-7 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="absolute bottom-20 right-1/3 animate-float animation-delay-3000">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 shadow-xl">
              <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20 animate-slideInLeft">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium">Campus Marketplace • Live Now</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight animate-slideInLeft animation-delay-200">
                Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-pink-200 to-pink-300 animate-gradient">eBuy</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-10 text-purple-100 max-w-3xl mx-auto lg:mx-0 font-light animate-slideInLeft animation-delay-400">
                Your Campus Marketplace - Buy & Sell with Ease
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center animate-slideInLeft animation-delay-600">
                <Link
                  to="/products"
                  className="group relative bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:-translate-y-1 inline-flex items-center overflow-hidden"
                >
                  <span className="relative z-10">Start Shopping</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
                
                <Link
                  to="/register"
                  className="group relative bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Become a Vendor</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 animate-slideInLeft animation-delay-800">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold mb-1">10K+</div>
                  <div className="text-purple-200 text-sm">Active Users</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold mb-1">5K+</div>
                  <div className="text-purple-200 text-sm">Products</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold mb-1">98%</div>
                  <div className="text-purple-200 text-sm">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative animate-slideInRight">
              <div className="relative z-10">
                {/* Main Image Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm bg-white/10 p-2">
                  <img 
                    src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop" 
                    alt="Shopping Experience"
                    className="rounded-2xl w-full h-auto object-cover"
                  />
                  
                  {/* Floating Card - Popular Item */}
                  <div className="absolute top-8 -left-4 bg-white rounded-2xl shadow-2xl p-4 animate-float max-w-[200px]">
                    <div className="flex items-center gap-3">
                      <img 
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" 
                        alt="Product"
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Top Seller</div>
                        <div className="font-bold text-sm text-gray-800">Premium Headphones</div>
                        <div className="text-indigo-600 font-bold text-sm">₦15,999</div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Card - New Arrival */}
                  <div className="absolute bottom-8 -right-4 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl shadow-2xl p-4 animate-float animation-delay-1000 max-w-[180px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span className="font-bold text-sm">New Arrival!</span>
                    </div>
                    <div className="text-xs opacity-90">Fresh products added today</div>
                  </div>

                  {/* Floating Badge - Secure */}
                  <div className="absolute top-1/2 -left-6 bg-green-500 text-white rounded-full p-3 shadow-lg animate-bounce-slow">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -top-4 -left-4 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="rgb(249, 250, 251)"/>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">eBuy</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of campus commerce with our cutting-edge features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-2xl bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 animate-fadeInUp">
              <div className="relative mb-6 mx-auto w-fit">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                {/* Pulse Ring */}
                <div className="absolute inset-0 bg-indigo-400 rounded-2xl animate-ping opacity-20"></div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Secure Payments</h3>
              <p className="text-gray-600 leading-relaxed mb-4">Safe and secure transactions powered by Paystack</p>
              
              {/* Feature Image */}
              <div className="mt-6 rounded-xl overflow-hidden border-2 border-indigo-100">
                <img 
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop" 
                  alt="Secure Payment"
                  className="w-full h-32 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 animate-fadeInUp animation-delay-200">
              <div className="relative mb-6 mx-auto w-fit">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-violet-400 rounded-2xl animate-ping opacity-20"></div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed mb-4">Quick delivery within campus</p>
              
              <div className="mt-6 rounded-xl overflow-hidden border-2 border-violet-100">
                <img 
                  src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&h=200&fit=crop" 
                  alt="Fast Delivery"
                  className="w-full h-32 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="group text-center p-8 rounded-2xl bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 animate-fadeInUp animation-delay-400">
              <div className="relative mb-6 mx-auto w-fit">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-purple-400 rounded-2xl animate-ping opacity-20"></div>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Student Verified</h3>
              <p className="text-gray-600 leading-relaxed mb-4">All users are verified students</p>
              
              <div className="mt-6 rounded-xl overflow-hidden border-2 border-purple-100">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=200&fit=crop" 
                  alt="Student Community"
                  className="w-full h-32 object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-200 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 animate-fadeIn">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600 text-lg">Handpicked items just for you</p>
            </div>
            
            <Link 
              to="/products" 
              className="group mt-4 md:mt-0 inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold text-lg transition-all bg-indigo-50 px-6 py-3 rounded-full hover:bg-indigo-100"
            >
              <span>View All</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-8 border-indigo-200 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-8 border-purple-200 rounded-full"></div>
                <div className="absolute inset-2 border-8 border-t-purple-600 rounded-full animate-spin animation-delay-300" style={{animationDirection: 'reverse'}}></div>
              </div>
              <p className="mt-8 text-gray-600 font-medium text-lg animate-pulse">Loading amazing products...</p>
              <div className="flex gap-2 mt-4">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce animation-delay-400"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div 
                  key={product._id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600">Trusted by thousands of students</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Computer Science Student",
                image: "https://randomuser.me/api/portraits/women/1.jpg",
                text: "eBuy made selling my old textbooks so easy! I love how secure and fast the platform is.",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Business Administration",
                image: "https://randomuser.me/api/portraits/men/2.jpg",
                text: "Best marketplace for campus needs. Found everything I needed for my dorm room!",
                rating: 5
              },
              {
                name: "Emily Davis",
                role: "Engineering Student",
                image: "https://randomuser.me/api/portraits/women/3.jpg",
                text: "The verification system makes me feel safe. Great platform for student entrepreneurs!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fadeInUp border border-gray-100"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-4 border-indigo-100 mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white py-20 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/30 animate-fadeIn">
            <svg className="w-4 h-4 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold">Join 10,000+ Happy Vendors</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fadeIn animation-delay-200">
            Ready to Start Selling?
          </h2>
          
          <p className="text-xl md:text-2xl mb-10 text-purple-100 max-w-2xl mx-auto font-light animate-fadeIn animation-delay-400">
            Join thousands of student vendors on eBuy and start earning today
          </p>
          
          <Link
            to="/register"
            className="group inline-flex items-center bg-white text-indigo-600 px-10 py-5 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105 animate-fadeIn animation-delay-600"
          >
            <svg className="w-6 h-6 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Vendor Account</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm animate-fadeIn animation-delay-800">
            <div className="flex items-center backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
              <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-purple-100 font-medium">Free to Start</span>
            </div>
            <div className="flex items-center backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
              <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-purple-100 font-medium">No Hidden Fees</span>
            </div>
            <div className="flex items-center backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
              <svg className="w-5 h-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-purple-100 font-medium">24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
          opacity: 0;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
          opacity: 0;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
};

export default Home;
