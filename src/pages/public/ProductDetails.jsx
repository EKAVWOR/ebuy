// src/pages/public/ProductDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Loader from '../../components/common/Loader';
import productService from '../../services/productService';
import cartService from '../../services/cartService';
import { setCart } from '../../store/slices/cartSlice';
import { formatCurrency } from '../../utils/formatters';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getProduct(id);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await cartService.addToCart(product._id, quantity);
      dispatch(setCart(response.data));
      alert('Added to cart!');
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <Loader />;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="mb-4">
            <img
              src={product.images[selectedImage] || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt=""
                  onClick={() => setSelectedImage(idx)}
                  className={`cursor-pointer rounded border-2 ${selectedImage === idx ? 'border-indigo-600' : 'border-gray-200'}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="mb-4">
            <span className="text-3xl font-bold text-indigo-600">{formatCurrency(product.price)}</span>
            {product.comparePrice && (
              <span className="text-lg text-gray-400 line-through ml-3">{formatCurrency(product.comparePrice)}</span>
            )}
          </div>

          <div className="mb-6">
            <Link to={`/stores/${product.storeId._id}`} className="text-indigo-600 hover:underline">
              {product.storeId.storeName}
            </Link>
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {product.stock > 0 ? (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  -
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">{product.stock} units available</p>
            </div>
          ) : (
            <p className="text-red-500 font-semibold mb-6">Out of Stock</p>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 font-semibold disabled:bg-gray-400"
          >
            Add to Cart
          </button>

          {product.specifications && product.specifications.length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-4">Specifications</h3>
              <div className="space-y-2">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">{spec.key}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;