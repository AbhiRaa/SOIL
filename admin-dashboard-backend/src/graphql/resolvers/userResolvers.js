/**
 * userResolvers.js
 *
 * Resolvers for handling user-related GraphQL operations. Includes CRUD operations and user state
 * management (blocking/unblocking). Enhancements include detailed error handling, logging for better
 * debuggability, and improved comments for maintainability.
 */

const userResolvers = {
  Query: {
    // Fetch all users
    users: async (_, args, { models }) => {
      try {
        return await models.User.findAll();
      } catch (error) {
        console.error('Error fetching all users:', error);
        throw new Error('Failed to fetch users: ' + error.message);
      }
    },
    // Fetch a single user by ID
    user: async (_, { id }, { models }) => {
      try {
        const user = await models.User.findByPk(id);
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (error) {
        console.error(`Error retrieving user with ID ${id}:`, error);
        throw new Error('Error retrieving user: ' + error.message);
      }
    },
  },

  Mutation: {
    // Block a user, preventing them from login
    blockUser: async (_, { id }, { models }) => {
      try {
        const user = await models.User.findByPk(id);
        if (!user) {
          throw new Error('User not found');
        }
        user.is_blocked = true;
        user.updated_at = new Date(); // Update timestamp
        user.updated_by = 'admin_email@soil.com';
        await user.save();
        return user;
      } catch (error) {
        console.error(`Error blocking user ID ${id}:`, error);
        throw new Error('Error blocking user: ' + error.message);
      }
    },

    // Unblock a user
    unblockUser: async (_, { id }, { models }) => {
      try {
        const user = await models.User.findByPk(id);
        if (!user) {
          throw new Error('User not found');
        }
        user.is_blocked = false;
        user.updated_at = new Date(); // Update timestamp
        user.updated_by = 'admin_email@soil.com';
        await user.save();
        return user;
      } catch (error) {
        console.error(`Error unblocking user ID ${id}:`, error);
        throw new Error('Error unblocking user: ' + error.message);
      }
    },

    // TODO: Create a new user - to do login/signup for admin portal
    createUser: async (_, { email, name, password }, { models }) => {
      try {
        return await models.User.create({
          email,
          name,
          password_hash: password, // Placeholder - hash it
          created_at: new Date(),
          updated_at: new Date(),
          updated_by: 'admin_email@example.com'
        });
      } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Error creating user: ' + error.message);
      }
    },

    // TODO: Update user details - for admins
    updateUser: async (_, { id, email, name }, { models }) => {
      try {
        const user = await models.User.findByPk(id);
        if (!user) {
          throw new Error('User not found');
        }
        user.email = email;
        user.name = name;
        user.updated_at = new Date();
        user.updated_by = 'admin_email@soil.com';
        await user.save();
        return user;
      } catch (error) {
        console.error(`Error updating user ID ${id}:`, error);
        throw new Error('Error updating user: ' + error.message);
      }
    }
  }
};

module.exports = userResolvers;