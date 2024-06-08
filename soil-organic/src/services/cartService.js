import API from '../utils/axiosUtil';

const addItem = (userId, productId, quantity, price) => {
  return API.post(`/cart/add/${userId}`, { productId, quantity, price });
};

const removeItem = (itemId, userId) => {
  return API.delete(`/cart/item/${userId}/${itemId}`);
};

const updateItem = (itemId, userId, quantity) => {
  return API.put(`/cart/item/${userId}`, { itemId, quantity });
};

const getCart = (userId) => {
  return API.get(`/cart/${userId}`);
};

const clearCart = (userId) => {
  return API.delete(`/cart/clear/${userId}`);
};

export {
  addItem,
  removeItem,
  updateItem,
  getCart,
  clearCart
};
