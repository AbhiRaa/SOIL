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
    <div className="container mx-auto px-4">
    
    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    <div className='flex justify-between items-center p-4'>
      <h1 className="text-3xl font-bold my-2 flex-grow text-center">Product Management</h1>
      <div className='ml-5'>
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={handleOpenModalForAdd}>
          Add New Product
        </button>
      </div>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 p-4">
      {data && data.products.map((product) => (
        <div key={product.product_id} className="flex border rounded shadow-lg p-4 bg-slate-100 text-black m-1">
          <div className="w-1/3">
            <img src={product.product_image ? `http://localhost:4001/${product.product_image}` : 'images/product-default.jpeg'} alt={product.product_name} className="w-32 h-32 object-cover mt-2" />
          </div>
          <div className="w-2/3 pl-4 flex flex-col justify-between">
          <div className='text-left'>
            <h2 className="text-2xl font-bold text-orange-500">{product.product_name} - ${product.product_price}</h2>
            <p className="text-lg mt-2"><strong>Description:</strong> {product.product_description}</p>
            <p className="text-lg"><strong>Minimum Purchase Unit:</strong> {product.minimum_purchase_unit}</p>
            <p className="text-lg"><strong>Stock:</strong> {product.product_stock}</p>
            <p className="text-lg"><strong>Special:</strong> {product.is_special ? 'Yes' : 'No'}</p>
            <p className="text-lg"><strong>Created At:</strong> {formatDate(product.created_at)}</p>
            <p className="text-lg"><strong>Updated At:</strong> {formatDate(product.updated_at)}</p>
            <p className="text-lg"><strong>Updated By:</strong> {product.updated_by}</p>
          </div>
          <div className="flex justify-start gap-3 mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => handleOpenModalForEdit(product)}>
              Edit
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => deleteProduct({ variables: { id: product.product_id } })}>
              Delete
            </button>
          </div>
        </div>
      </div>
      ))}
    </div>
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