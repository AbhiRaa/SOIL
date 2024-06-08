import React, { useState, useEffect } from 'react';
import './ProductModal.css'; 

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="modal-content bg-white rounded-lg shadow-xl p-6">
        <span className="close text-gray-600 hover:text-gray-900 cursor-pointer" onClick={onClose}>&times;</span>
        <form onSubmit={handleSubmit} className="space-y-4 font-bold">
          <div>
            <label htmlFor="product_name" className="block text-sm font-medium text-gray-700">Product Name:</label>
            <input id="product_name" type="text" name="product_name" value={productData.product_name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="product_description" className="block text-sm font-medium text-gray-700">Product Description:</label>
            <textarea id="product_description" name="product_description" value={productData.product_description} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>
          <div>
            <label htmlFor="product_price" className="block text-sm font-medium text-gray-700">Product Price:</label>
            <input id="product_price" type="number" name="product_price" value={productData.product_price} onChange={handleChange} required min="0.01" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="product_image" className="block text-sm font-medium text-gray-700">Product Image Path:</label>
            <input id="product_image" type="text" name="product_image" value={productData.product_image} onChange={handleChange} placeholder='images/<image_name> or leave empty' className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="minimum_purchase_unit" className="block text-sm font-medium text-gray-700">Minimum Purchase Unit:</label>
            <input id="minimum_purchase_unit" type="text" name="minimum_purchase_unit" value={productData.minimum_purchase_unit} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="product_stock" className="block text-sm font-medium text-gray-700">Product Stock:</label>
            <input id="product_stock" type="number" name="product_stock" value={productData.product_stock} onChange={handleChange} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="flex items-center">
            <label htmlFor="is_special" className="block text-sm font-medium text-gray-700 mr-2">Is Special:</label>
            <input id="is_special" type="checkbox" name="is_special" checked={productData.is_special} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          </div>
          <div>
            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;