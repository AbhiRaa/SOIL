import API from './api';

const getAllProducts = () => {
  return API.get('/products');
};

const getProductById = (id) => {
  return API.get(`/products/${id}`);
};

export const productService = {
  getAllProducts,
  getProductById
};
