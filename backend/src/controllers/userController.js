/**
 * User Controller
 * This controller handles requests related to user operations such as signing up, signing in,
 * deleting, updating user details, and managing user follow relationships.
 * 
 * @module UserController
 */

module.exports = (db) => {
  const bcrypt = require('bcrypt');
  const { generateToken } = require('../utils/jwtUtils');
  const { User, Profile, Cart, Follows, ReviewReply } = db.models;
  const { sequelize } = db;

  return {
      /**
       * Signs up a new user, creates associated Profile and Cart, and generates a JWT token.
       * @param {Object} req - HTTP request object containing name, email, and password.
       * @param {Object} res - HTTP response object for sending responses.
       */
      signup: async (req, res) => {
          const { name, email, password } = req.body;

          // Basic validation
          if (!name || !email || !password) {
              return res.status(400).json({ message: "All fields are required" });
          }

          try {
              // Check for existing user
              const existingUser = await User.findOne({ where: { email } });
              if (existingUser) {
                  return res.status(409).json({ message: "Email already exists" });
              }

              // Hash password
              const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(password, salt);

              // Start a transaction to ensure atomicity
              const newUser = await sequelize.transaction(async (t) => {
                // Create new user
                const user = await User.create({ name, email, password_hash: hashedPassword }, { transaction: t });

                // Create a corresponding profile with default values since one to one relationship
                await Profile.create({
                    user_id: user.user_id,
                    age: null,
                    weight: null,
                    height: null,
                    gender: "",
                    activity_level: "",
                    dietary_preferences: [],
                    health_goals: []
                }, { transaction: t });

                // Create a corresponding Cart with default values since one to one relationship
                await Cart.create({
                  user_id: user.user_id,
                  total: 0.00
                }, { transaction: t });

                return user;
              });

              // Generate JWT for the new user
              const token = generateToken(newUser);

              res.status(201).json({ message: "User registered successfully", userId: newUser.user_id,
                                    userName: newUser.name,
                                    userEmail: newUser.email,
                                    access_token: token });
          } catch (error) {
              console.error("Registration Error:", error);
              res.status(500).json({ message: "Server error" });
          }
      },

      /**
       * Signs in an existing user by validating credentials and returns a JWT token.
       * @param {Object} req - HTTP request object containing email and password.
       * @param {Object} res - HTTP response object for sending responses.
       */
      signin: async (req, res) => {
          const { email, password } = req.body;
          try {
              const user = await User.findOne({ where: { email } });
              if (!user) {
                  return res.status(404).json({ message: 'User not found.' });
              }

              // Check if the user is blocked
              if (user.is_blocked) {
                  return res.status(403).json({ message: 'Account is blocked. Please contact support.' });
              }

              const isMatch = await bcrypt.compare(password, user.password_hash);
              if (!isMatch) {
                  return res.status(400).json({ message: 'Invalid credentials.' });
              }

              const token = generateToken(user);

              res.status(201).json({ message: "User Signed in successfully", userId: user.user_id,
                                    userName: user.name,
                                    userEmail: user.email,
                                    access_token: token });

          } catch (error) {
              console.error("Sign in Error:", error);
              res.status(500).json({ message: 'Something went wrong.' });
          }
      },  

      /**
       * Retrieves details of a user including their profile.
       * @param {Object} req - HTTP request object with userId as parameter.
       * @param {Object} res - HTTP response object for sending responses.
       */
      getUserDetails: async (req, res) => {
        const { userId } = req.params;

        try {
            const user = await User.findOne({
                where: { user_id: userId },
                include: [{
                    model: Profile,
                    as: 'profile',  // Make sure 'profile' is the correct alias used in the association
                    attributes: ['age', 'weight', 'height', 'gender', 'activity_level', 'dietary_preferences', 'health_goals']
                }],
                attributes: ['user_id', 'name', 'email', 'join_date']
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userProfile = {
                userId: user.user_id,
                userName: user.name,
                userEmail: user.email,
                joinDate: user.join_date,
                age: user.profile ? user.profile.age : null,
                weight: user.profile ? user.profile.weight : null,
                height: user.profile ? user.profile.height : null,
                gender: user.profile ? user.profile.gender : '',
                activityLevel: user.profile ? user.profile.activity_level : '',
                dietaryPreferences: user.profile ? JSON.parse(user.profile.dietary_preferences) : [],
                healthGoals: user.profile ? JSON.parse(user.profile.health_goals) : []
            };

            res.status(200).json(userProfile);
        } catch (error) {
            console.error("Error fetching user details:", error);
            res.status(500).json({ message: "Server error" });
        }
      },

      /**
       * Deletes a user along with their profile and associated data atomically.
       * @param {Object} req - HTTP request object with userId as parameter.
       * @param {Object} res - HTTP response object for sending responses.
       */
      deleteUser: async (req, res) => {
        const { userId } = req.params;  // Extract userId from the request parameters
    
        try {
            // Start a transaction to handle the deletion of user and its associated profile
            const result = await sequelize.transaction(async (t) => {
                // Delete associated ReviewReplies first to maintain referential integrity
                await ReviewReply.destroy({
                  where: { user_id: userId },
                  transaction: t
                });

                // Delete the associated Cart next
                await Cart.destroy({
                  where: { user_id: userId },
                  transaction: t
                });

                // Delete the associated Profile next
                await Profile.destroy({
                  where: { user_id: userId },
                  transaction: t
                });

                // Finally, delete the User
                const userDeleted = await User.destroy({
                  where: { user_id: userId },
                  transaction: t
                });

                // Check if the user was actually found and deleted
                if (!userDeleted) {
                  throw new Error('User not found');
                }
    
                return userDeleted;  // Return the result of the delete operation
            });
    
            // If everything goes well, send a success response
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            // If an error occurs, log it and send a 500 error response
            console.error("Deletion Error:", error);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    },

    /**
     * Updates user and profile details within a transaction ensuring data consistency.
     * @param {Object} req - HTTP request object with userId as parameter and updated user details in the body.
     * @param {Object} res - HTTP response object for sending responses.
     */
    updateUserDetails: async (req, res) => {
      const { userId } = req.params;
      const { userEmail, userName, age, weight, height, gender, activityLevel, dietaryPreferences, healthGoals } = req.body;

      try {
        await sequelize.transaction(async (t) => {
          // Update the User table
          await User.update(
            { name: userName, updated_by: userEmail, updated_at: new Date()},
            { where: { user_id: userId }, transaction: t }
          );
  
          // Update the Profile table
          await Profile.update(
            {
              age: age,
              weight: weight,
              height: height,
              gender: gender,
              activity_level: activityLevel,
              dietary_preferences: dietaryPreferences,
              health_goals: healthGoals,
              updated_at: new Date()
            },
            { where: { user_id: userId }, transaction: t }
          );

        // Commit the transaction to ensure all updates are finalized
        }).then(async () => {
          // After the transaction has been committed, fetch the updated user and profile data
          const updatedUserData = await User.findOne({
            where: { user_id: userId },
            include: [{
              model: Profile,
              as: 'profile',
              attributes: ['age', 'weight', 'height', 'gender', 'activity_level', 'dietary_preferences', 'health_goals']
          }],
          attributes: ['user_id', 'name', 'email', 'join_date']
        });

        if (!updatedUserData) {
          res.status(404).send({ message: "User not found" });
          return;
        }

        const updatedUser = {
          userId: updatedUserData.user_id,
          userName: updatedUserData.name,
          userEmail: updatedUserData.email,
          joinDate: updatedUserData.join_date,
          age: updatedUserData.profile.age,
          weight: updatedUserData.profile.weight,
          height: updatedUserData.profile.height,
          gender: updatedUserData.profile.gender,
          activityLevel: updatedUserData.profile.activity_level,
          dietaryPreferences: JSON.parse(updatedUserData.profile.dietary_preferences),
          healthGoals: JSON.parse(updatedUserData.profile.health_goals)
        };

        res.status(200).json({ message: "User and profile updated successfully", updatedUser: updatedUser });
      });
      } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: "Failed to update user details", error: error.message });
      }
    }, 

    /**
     * Updates the user's password after validating the current password.
     * @param {Object} req - HTTP request object with userId as parameter and passwords in the body.
     * @param {Object} res - HTTP response object for sending responses.
     */
    updatePassword: async (req, res) => {
      const { userId } = req.params;
      const { currentPassword, newPassword } = req.body;
  
      try {
          const user = await User.findByPk(userId);
          if (!user) {
              return res.status(404).json({ message: 'User not found.' });
          }
  
          const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
          if (!isMatch) {
              return res.status(400).json({ message: 'Current password is incorrect. Please try again.' });
          }
  
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);
          user.password_hash = hashedPassword;
          await user.save();
  
          res.status(200).json({ message: 'Password updated successfully.' });
      } catch (error) {
          res.status(500).json({ message: 'Failed to update password.', error: error.message });
      }
    },
    
    /**
     * Establishes a follow relationship between two users.
     * @param {Object} req - HTTP request object containing followerId in params and followingId in body.
     * @param {Object} res - HTTP response object for sending responses.
     */
    followUser: async (req,res) => {
      const{followingId} = req.body
      const {followerId} = req.params

      try {
        // Prevent users from following themselves
        if (parseInt(followerId) === followingId) {
            return res.status(400).json({ message: "You cannot follow yourself." });
        }

        // Create follow relationship
        const [follow, created] = await Follows.findOrCreate({
          where: { follower_id: followerId, following_id: followingId },
          defaults: { follower_id: followerId, following_id: followingId }
        });

        if (!created) {
          return res.status(409).json({ message: "You are already following this user." });
        }

        res.status(201).json({ message: "Successfully followed the user." });
        } catch (error) {
          console.error("Error in following user: ", error);
          res.status(500).json({ message: 'Internal server error' });
        }
    },

    /**
     * Retrieves the list of users a particular user is following.
     * @param {Object} req - HTTP request object with followerId as a parameter.
     * @param {Object} res - HTTP response object for sending responses.
     */
    fetchFollowing : async (req, res) => {
      const {followerId} = req.params;
      try {
        const followingIds = await db.models.Follows.findAll({
            where: { follower_id: followerId },
            attributes: ['following_id'], // Select only the following_id column
        });

        // Map to extract just the following_id values
        const ids = followingIds.map(follow => follow.following_id);

        if (ids.length === 0) {
          res.json({ message: "No following found.", followingIds: [] });
        } else {
          res.json({ message: "Following IDs retrieved successfully.", followingIds: ids });
        }
      } catch (error) {
        console.error("Error retrieving following IDs: ", error);
        res.status(500).json({ message: 'Internal server error' });
      }
    },

    /**
     * Removes a follow relationship between two users.
     * @param {Object} req - HTTP request object containing followerId in params and followingId in body.
     * @param {Object} res - HTTP response object for sending responses.
     */
    unfollowUser: async(req,res) => {
      const {followerId} = req.params
      const{followingId} = req.body
      try {
        const result = await Follows.destroy({
            where: { follower_id: followerId, following_id: followingId }
        });

        if (result === 0) {
            return res.status(404).json({ message: "You are not following this user." });
        }

        res.status(201).json({ message: "Successfully unfollowed the user." });
        } catch (error) {
          console.error("Error in unfollowing user: ", error);
          res.status(500).json({ message: 'Internal server error' });
        }
    }
  };
};
