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
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <form onSubmit={handleSubmit} className="product-modal-form">
          <label htmlFor="product_name">Product Name:</label>
          <input id="product_name" type="text" name="product_name" value={productData.product_name} onChange={handleChange} required />

          <label htmlFor="product_description">Product Description:</label>
          <textarea id="product_description" name="product_description" value={productData.product_description} onChange={handleChange} required />

          <label htmlFor="product_price">Product Price:</label>
          <input id="product_price" type="number" name="product_price" value={productData.product_price} onChange={handleChange} required min="0.01" step="0.01" />

          <label htmlFor="product_image">Product Image Path:</label>
          <input id="product_image" type="text" name="product_image" value={productData.product_image} onChange={handleChange} />

          <label htmlFor="minimum_purchase_unit">Minimum Purchase Unit:</label>
          <input id="minimum_purchase_unit" type="text" name="minimum_purchase_unit" value={productData.minimum_purchase_unit} onChange={handleChange} required />

          <label htmlFor="product_stock">Product Stock:</label>
          <input id="product_stock" type="number" name="product_stock" value={productData.product_stock} onChange={handleChange} required min="0" />

          <label htmlFor="is_special">Is Special:</label>
          <input id="is_special" type="checkbox" name="is_special" checked={productData.is_special} onChange={handleChange} />

          <button type="submit">Save Product</button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;