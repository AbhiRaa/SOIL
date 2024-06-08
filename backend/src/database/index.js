/**
 * Initializes and configures the database connection and models for the SOIL Organic application.
 * This module establishes a connection to the database using Sequelize and defines the model relationships.
 *
 * @module database
 */

const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config.js");

  /**
   * Establishes a database connection with retry logic to handle potential connection issues.
   * @returns {Sequelize} A Sequelize connection instance.
   */
  async function establishConnection() {
    const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
      host: config.HOST,
      dialect: config.DIALECT,
      logging: console.log,  // Enable Sequelize logging to console
      pool: {
        max: 10,             // Maximum number of connection in pool
        min: 0,              // Minimum number of connection in pool
        acquire: 30000,      // The maximum time, in milliseconds, that pool will try to get connection before throwing error
        idle: 10000          // The maximum time, in milliseconds, that a connection can be idle before being released
      }
    });

    let retries = 5;
    while (retries) {
      try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        return sequelize;
      } catch (err) {
        console.error('Unable to connect to the database:', err);
        retries -= 1;
        console.log(`Retries left: ${retries}`);
        await new Promise(res => setTimeout(res, 5000)); // wait 5 seconds before retrying
      }
    }
    throw new Error('Max retries reached, exiting application');
  }

  /**
 * Initializes the database by establishing a connection and setting up the models and their associations.
 * @returns {Object} An object containing the Sequelize instance and models.
 */
module.exports = async function initDb() {
  const sequelize = await establishConnection();

  const db = {
    sequelize,
    Sequelize,
    models: {}
  };

  // Model imports
  db.models.User = require('../models/User')(sequelize, DataTypes);
  db.models.Profile = require('../models/Profile')(sequelize, DataTypes);
  db.models.Product = require('../models/Product')(sequelize, DataTypes);
  db.models.Review = require('../models/Review')(sequelize, DataTypes);
  db.models.ReviewReply = require('../models/ReviewReply')(sequelize, DataTypes);
  db.models.Cart = require('../models/Cart')(sequelize, DataTypes);
  db.models.CartItem = require('../models/CartItem')(sequelize, DataTypes);
  db.models.Follows = require('../models/Follows')(sequelize, DataTypes);

  // Associations
  // Users and Profiles
  db.models.User.hasOne(db.models.Profile, {
    foreignKey: 'user_id',
    as: 'profile',
    onDelete: 'CASCADE',  // Delete profile when user is deleted
    onUpdate: 'CASCADE'   // Update foreign key when user_id changes
  });
  db.models.Profile.belongsTo(db.models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  // Users and Reviews
  db.models.User.hasMany(db.models.Review, {
    foreignKey: 'user_id',
    as: 'reviews',
    onDelete: 'CASCADE',  // Delete all reviews when user is deleted
    onUpdate: 'CASCADE'   // Update foreign key when user_id changes
  });
  db.models.Review.belongsTo(db.models.User, {
    foreignKey: 'user_id',
    as: 'author'
  });

  // Products and Reviews
  db.models.Product.hasMany(db.models.Review, {
    foreignKey: 'product_id',
    as: 'reviews',
    onDelete: 'CASCADE',  // Set foreign key to null if product is deleted
    onUpdate: 'CASCADE'    // Update foreign key when product_id changes
  });
  db.models.Review.belongsTo(db.models.Product, {
    foreignKey: 'product_id',
    as: 'product'
  });

  // Reviews and Review Replies
  db.models.Review.hasMany(db.models.ReviewReply, {
    foreignKey: 'review_id',
    as: 'replies',
    onDelete: 'CASCADE',  // Delete replies when review is deleted
    onUpdate: 'CASCADE'   // Update foreign key when review_id changes
  });
  db.models.ReviewReply.belongsTo(db.models.Review, {
    foreignKey: 'review_id',
    as: 'review'
  });

  // Users and Carts
  db.models.User.hasOne(db.models.Cart, {
    foreignKey: 'user_id',
    as: 'cart',
    onDelete: 'CASCADE',  // Delete cart when user is deleted
    onUpdate: 'CASCADE'   // Update foreign key when user_id changes
  });
  db.models.Cart.belongsTo(db.models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  // Cart and Cart Items
  db.models.Cart.hasMany(db.models.CartItem, {
    foreignKey: 'cart_id',
    as: 'cartItems',
    onDelete: 'CASCADE',  // Delete cart items when cart is deleted
    onUpdate: 'CASCADE'   // Update foreign key when cart_id changes
  });
  db.models.CartItem.belongsTo(db.models.Cart, {
    foreignKey: 'cart_id',
    as: 'cart'
  });

  // Products and Cart Items
  db.models.Product.hasMany(db.models.CartItem, {
    foreignKey: 'product_id',
    as: 'cartItems',
    onDelete: 'CASCADE ',  // Set foreign key to null if product is deleted
    onUpdate: 'CASCADE'    // Update foreign key when product_id changes
  });
  db.models.CartItem.belongsTo(db.models.Product, {
    foreignKey: 'product_id',
    as: 'product'
  });

  // Follows (Many-to-Many relationship between Users with self-referencing)
  db.models.User.belongsToMany(db.models.User, {
    through: db.models.Follows,
    as: 'followers',
    foreignKey: 'following_id',
    otherKey: 'follower_id',
    onDelete: 'CASCADE',  // Remove relationship if either user is deleted
    onUpdate: 'CASCADE'   // Update foreign keys when user_ids change
  });
  db.models.User.belongsToMany(db.models.User, {
    through: db.models.Follows,
    as: 'following',
    foreignKey: 'follower_id',
    otherKey: 'following_id',
    onDelete: 'CASCADE',  // Remove relationship if either user is deleted
    onUpdate: 'CASCADE'   // Update foreign keys when user_ids change
  });

  return db;
};
