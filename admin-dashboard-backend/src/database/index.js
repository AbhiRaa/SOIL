/**
 * index.js
 * 
 * Manages database connections and initializes Sequelize models and associations.
 * This module sets up the Sequelize connection to the database using configurations
 * from `config/config.js` and defines relationships between models.
 */
  
  const { Sequelize, DataTypes } = require("sequelize");
  const config = require("../config/config.js");

  /**
   * Establishes a database connection with retry logic.
   * Tries to connect multiple times if the first attempt fails, with a delay between attempts.
   * 
   * @returns {Object} The Sequelize instance connected to the database.
   * @throws {Error} If connection fails after maximum retries.
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
 * Initializes the database by setting up models and their associations.
 * 
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
  db.models.Product = require('../models/Product')(sequelize, DataTypes);
  db.models.Review = require('../models/Review')(sequelize, DataTypes);

  // Define model associations
  // Users and Reviews
  db.models.User.hasMany(db.models.Review, {
    foreignKey: 'user_id',
    as: 'reviews',
    onDelete: 'CASCADE',  // Deletes all associated reviews when a user is deleted.
    onUpdate: 'CASCADE'   // Updates foreign key when user_id changes.
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

  return db;
};
