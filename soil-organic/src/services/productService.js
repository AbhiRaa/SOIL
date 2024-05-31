import API from '../utils/axiosUtil';

const getAllSecureProducts = () => {
  return API.get('/secure/products');
};

const getAllPublicProducts = () => {
  return API.get('/public/products');
};

const getProductById = (id) => {
  return API.get(`/products/${id}`);
};

// export const productService = {
//   getAllProducts,
//   getProductById
// };

export{
  getAllSecureProducts,
  getProductById,
  getAllPublicProducts,
};