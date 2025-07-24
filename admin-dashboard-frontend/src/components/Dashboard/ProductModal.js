import React, { useState, useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [productData, setProductData] = useState({
    product_name: '',
    product_description: '',
    product_price: '',
    product_image: '',
    minimum_purchase_unit: '',
    product_stock: '',
    is_special: false,
  });

  useEffect(() => {
    if (product) {
      setProductData({
        product_name: product.product_name || '',
        product_description: product.product_description || '',
        product_price: product.product_price || '',
        product_image: product.product_image || '',
        minimum_purchase_unit: product.minimum_purchase_unit || '',
        product_stock: product.product_stock || '',
        is_special: product.is_special || false,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'number') {
      // Parse as float for price and as int for stock, ensure value is non-negative
      const parsedValue = name === 'product_price' ? parseFloat(value) : parseInt(value, 10);
      setProductData(prev => ({
        ...prev,
        [name]: parsedValue >= 0 ? parsedValue : 0
      }));
    } else {
      setProductData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(productData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-green-50 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <p className="text-sm text-slate-600">
                {product ? 'Update product information' : 'Create a new product for your catalog'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="product_name" className="block text-sm font-semibold text-slate-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="product_name"
              type="text"
              name="product_name"
              value={productData.product_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter product name"
            />
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="product_description" className="block text-sm font-semibold text-slate-700 mb-2">
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="product_description"
              name="product_description"
              value={productData.product_description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
              placeholder="Enter detailed product description"
            />
          </div>

          {/* Price and Stock Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="product_price" className="block text-sm font-semibold text-slate-700 mb-2">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-500 sm:text-sm">$</span>
                </div>
                <input
                  id="product_price"
                  type="number"
                  name="product_price"
                  value={productData.product_price}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="product_stock" className="block text-sm font-semibold text-slate-700 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                id="product_stock"
                type="number"
                name="product_stock"
                value={productData.product_stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Enter stock quantity"
              />
            </div>
          </div>

          {/* Image and Unit Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="product_image" className="block text-sm font-semibold text-slate-700 mb-2">
                Product Image Path
              </label>
              <input
                id="product_image"
                type="text"
                name="product_image"
                value={productData.product_image}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="images/product-name.jpg"
              />
              <p className="mt-1 text-xs text-slate-500">Format: images/filename.jpg or leave empty for default</p>
            </div>

            <div>
              <label htmlFor="minimum_purchase_unit" className="block text-sm font-semibold text-slate-700 mb-2">
                Minimum Purchase Unit <span className="text-red-500">*</span>
              </label>
              <input
                id="minimum_purchase_unit"
                type="text"
                name="minimum_purchase_unit"
                value={productData.minimum_purchase_unit}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="e.g., 1 kg, 500g, 1 piece"
              />
            </div>
          </div>

          {/* Special Product Toggle */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="is_special" className="text-sm font-semibold text-slate-700">
                  Special Product
                </label>
                <p className="text-xs text-slate-500 mt-1">Mark this product as special/featured</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="is_special"
                  type="checkbox"
                  name="is_special"
                  checked={productData.is_special}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{product ? 'Update Product' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;