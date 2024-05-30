// const bcrypt = require('bcrypt');
// const { generateToken } = require('../utils/jwtUtils');
// const db = require('../database');
// const User = db.models.User;

// // Signup
// exports.signup = async (req, res) => {
//     const { name, email, password } = req.body;

//     // Basic validation
//     if (!name || !email || !password) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     try {
//         // Check for existing user
//         const existingUser = await User.findOne({ where: { email } });
//         if (existingUser) {
//             return res.status(409).json({ message: "Email already exists" });
//         }

//         // Hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create new user
//         const newUser = await User.create({
//             name,
//             email,
//             password: hashedPassword
//         });

//         const token = generateToken(newUser);  // Generate JWT for the new user

//         res.status(201).json({ message: "User registered successfully", userId: newUser.id,
//                               userName: newUser.name,
//                               userEmail: newUser.email,
//                               access_token: token });
//     } catch (error) {
//         console.error("Registration Error:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// // Signin
// exports.signin = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//       const user = await User.findOne({ where: { email } });
//       if (!user) {
//           return res.status(404).json({ message: 'User not found.' });
//       }

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//           return res.status(400).json({ message: 'Invalid credentials.' });
//       }

//       const token = generateToken(user);  // Generate JWT for the logged in user

//       res.json({ token });
//   } catch (error) {
//       res.status(500).json({ message: 'Something went wrong.' });
//   }
// };








// // Select one user from the database.
// exports.one = async (req, res) => {
//     const user = await db.user.findByPk(req.params.email);
//     console.log(user)
//     res.json(user);
    
//   };

// // Create a user in the database.
// exports.create = async (req, res) => {
//     const user = await db.user.create({
//       username: req.body.name,
//       email: req.body.email,
//       password: req.body.password,
//       salt:req.body.salt,
//       joinDate:req.body.joinDate,
//       Age:req.body.profile.age,
//       Weight:req.body.profile.weight,  
//       Height:req.body.profile.height,
//       Gender:req.body.profile.gender,
//       Activity_Level: req.body.profile.activityLevel,
//       Dietary_Preferences: JSON.stringify(req.body.profile.dietaryPreferences),
//       Health_Goals:JSON.stringify(req.body.profile.healthGoals),
//     });
  
//     res.json(user);
//   };

// exports.delete = async(req,res)=>{
//   try {
//     const result = await db.user.destroy({
//         where: { email: req.params.email }
//     });
//     if (result > 0) {
//         res.status(200).send({ message: "User deleted successfully" });
//     } else {
//         res.status(404).send({ message: "User not found" });
//     }
// } catch (error) {
//     res.status(500).send({ message: "Error deleting user", error: error.message });
// }
// };

// exports.update = async(req,res)=>{
//   const [affectedCount] = await db.user.update(req.body, {where:{email:req.params.email}});
//   if(affectedCount>0){
//     res.status(200).send({message:"updated user successfully"})
//   }
//   else{
//     res.status(404).send({ message: "User not found" });
//   }
// }

module.exports = (db) => {
  const bcrypt = require('bcrypt');
  const { generateToken } = require('../utils/jwtUtils');
  const { User, Profile } = db.models;
  const { sequelize } = db;

  return {
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

                // Create a corresponding profile with default values
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

      signin: async (req, res) => {
          const { email, password } = req.body;
          try {
              const user = await User.findOne({ where: { email } });
              if (!user) {
                  return res.status(404).json({ message: 'User not found.' });
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
              res.status(500).json({ message: 'Something went wrong.' });
          }
      },

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
                attributes: ['name', 'email', 'join_date']
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userProfile = {
                userName: user.name,
                userEmail: user.email,
                joinDate: user.join_date,
                age: user.profile ? user.profile.age : null,
                weight: user.profile ? user.profile.weight : null,
                height: user.profile ? user.profile.height : null,
                gender: user.profile ? user.profile.gender : '',
                activityLevel: user.profile ? user.profile.activity_level : '',
                dietaryPreferences: user.profile ? user.profile.dietary_preferences : [],
                healthGoals: user.profile ? user.profile.health_goals : []
            };

            res.status(200).json(userProfile);
        } catch (error) {
            console.error("Error fetching user details:", error);
            res.status(500).json({ message: "Server error" });
        }
      },

      deleteUser: async (req, res) => {
        const { userId } = req.params;  // Extract userId from the request parameters
    
        try {
            // Start a transaction to handle the deletion of user and its associated profile
            const result = await sequelize.transaction(async (t) => {
                // Delete the associated profile first to maintain referential integrity
                await Profile.destroy({
                    where: { user_id: userId },
                    transaction: t
                });
    
                // Now delete the user
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
    }
  };
};
