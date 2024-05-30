import API from './api';

const addToCart = (itemId, quantity) => {
  return API.post('/cart', { itemId, quantity });
};

const removeFromCart = (itemId) => {
  return API.delete(`/cart/${itemId}`);
};

const updateCartItem = (itemId, quantity) => {
  return API.put(`/cart/${itemId}`, { quantity });
};

const getCartItems = () => {
  return API.get('/cart');
};

export const cartService = {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCartItems
};
