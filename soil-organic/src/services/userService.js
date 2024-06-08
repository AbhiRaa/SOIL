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

const changeUserPassword = (userId, currentPassword, newPassword) => {
    return API.post(`/user/update-password/${userId}`, { currentPassword, newPassword });
};

//follow a user
const followUser =(followerId,followingId)=>{         //user to be followed by follower is inside the request body
    return API.post(`/user/follow/${followerId}`,{followingId})
}

//fetch following of current loggedin user
const fetchFollowing = (followerId)=>{
    return API.get(`/user/following/${followerId}`)
}

//unfollow a user
const unfollowUser = (followerId,followingId)=>{
    return API.post(`/user/unfollow/${followerId}`,{followingId})
}

export {
  signUp,
  signIn,
  getUserDetails,
  deleteUser,
  updateUserDetails,
  changeUserPassword,
  followUser,
  fetchFollowing,
  unfollowUser,
};
