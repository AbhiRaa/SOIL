module.exports = (app, db) => {
  const userController = require('../controllers/userController')(db);  // Passing models to the controller
  const authenticate = require('../middlewares/authenticate');

  // Register a new user
  app.post('/api/user/signup', userController.signup);

  // Signin a user
  app.post('/api/user/signin', userController.signin);

  // Get user details by userId
  app.get('/api/user/details/:userId', authenticate, userController.getUserDetails);

  // Route for deleting a user
  app.delete('/api/user/:userId', authenticate, userController.deleteUser);

  // Route for updating user details
  app.put('/api/user/update/:userId', authenticate, userController.updateUserDetails);

  // Route for updating user password
  app.post('/api/user/update-password/:userId', authenticate, userController.updatePassword);


  //Route to follow a user
  app.post('/api/user/follow/:followerId',authenticate,userController.followUser);

  //route to fetch following
  app.get('/api/user/following/:followerId',authenticate,userController.fetchFollowing);

  //route to unfollow a user
  app.post('/api/user/unfollow/:followerId',authenticate,userController.unfollowUser);

};  
