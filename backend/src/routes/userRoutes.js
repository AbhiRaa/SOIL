// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController.js');

// // POST /api/users/signup - Register a new user
// router.post('/signup', userController.signup);

// // // Select a single user with id.
// // router.get("/select/:email", userController.one);

// // // Select a single user with 
// // router.post("/", userController.create);

// // // Delete a user 
// // router.delete("/delete/:email",userController.delete)

// // //Update a user password
// // router.put("/:email",userController.update)

// module.exports = router;

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
};  
