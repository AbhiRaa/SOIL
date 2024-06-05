import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { FETCH_PRODUCT_LIST } from '../../graphql/queries/fetchProductList';
import { ADD_PRODUCT } from '../../graphql/mutations/addProduct';
import { EDIT_PRODUCT } from '../../graphql/mutations/editProduct';
import { DELETE_PRODUCT } from '../../graphql/mutations/deleteProduct';
import ProductModal from './ProductModal';  // Import the modal component

const ProductManagement = () => {
  const { loading, error, data } = useQuery(FETCH_PRODUCT_LIST, {
    onError: (err) => console.error('Failed to fetch products:', err)
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [addProduct] = useMutation(ADD_PRODUCT, {
    refetchQueries: [ { query: FETCH_PRODUCT_LIST }],
    onError: (error) => {
      console.error("Error adding product:", error);
      setErrorMessage(error.message);
    }
  });
  const [editProduct] = useMutation(EDIT_PRODUCT, {
    refetchQueries: [ { query: FETCH_PRODUCT_LIST }],
    onError: (error) => {
      console.error("Error editing product:", error);
      setErrorMessage(error.message);
    }
  });
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [ { query: FETCH_PRODUCT_LIST }],
    onError: (error) => {
      console.error("Error deleting product:", error);
      setErrorMessage(error.message);
    }
  });

  const handleOpenModalForAdd = () => {
    setCurrentProduct(null);
    setModalOpen(true);
    setErrorMessage("");
  };

  const handleOpenModalForEdit = (product) => {
    setCurrentProduct(product);
    setModalOpen(true);
    setErrorMessage("");
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (currentProduct) {
        await editProduct({ variables: { id: currentProduct.product_id, productInput: productData } });
      } else {
        await addProduct({ variables: { productInput: productData } });
      }
      setModalOpen(false);
    } catch (err) {
      setErrorMessage("Failed to save product: " + err.message);
    }
  };

  const formatDate = (timestamp) => {
    // Convert the string timestamp to a number and create a new Date object
    const date = new Date(Number(timestamp));
    return date.toLocaleString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products :(</p>;

  return (
    <div>
      <h1>Product Management</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <button onClick={handleOpenModalForAdd}>Add New Product</button>
      {data && data.products.map((product) => (
        <div key={product.product_id} style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
          <h2>{product.product_name} - ${product.product_price}</h2>
          <img src={product.product_image ? `http://localhost:4001/${product.product_image}` : 'images/product-default.jpeg'} alt={product.product_name} style={{ width: '100px', height: '100px' }} />
          <p><strong>Description:</strong> {product.product_description}</p>
          <p><strong>Minimum Purchase Unit:</strong> {product.minimum_purchase_unit}</p>
          <p><strong>Stock:</strong> {product.product_stock}</p>
          <p><strong>Special:</strong> {product.is_special ? 'Yes' : 'No'}</p>
          <p><strong>Created At:</strong> {formatDate(product.created_at)}</p>
          <p><strong>Updated At:</strong> {formatDate(product.updated_at)}</p>
          <p><strong>Updated By:</strong> {product.updated_by}</p>
          <button onClick={() => handleOpenModalForEdit(product)}>Edit</button>
          <button onClick={() => deleteProduct({ variables: { id: product.product_id } })}>
            Delete
          </button>
        </div>
      ))}
      {modalOpen && (
        <ProductModal 
          isOpen={modalOpen} 
          onClose={handleCloseModal} 
          product={currentProduct} 
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default ProductManagement;