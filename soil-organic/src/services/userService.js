import API from '../utils/axiosUtil';

const signUp = (userData) => {
  return API.post('/user/signup', userData);
};

const signIn = (credentials) => {
  return API.post('/user/signin', credentials);
};

const getUserDetails = (userId) => {
    return API.get(`/user/details/${userId}`);
};

const deleteUser = (userId) => {
    return API.delete(`/user/${userId}`);
};

const updateUserDetails = (userId, userDetails) => {
    return API.put(`/user/update/${userId}`, userDetails);
};

// const signOut = () => {
//   localStorage.removeItem('access_token'); // Add more cleanup as needed
// };

export {
  signUp,
  signIn,
  getUserDetails,
  deleteUser,
  updateUserDetails
};
