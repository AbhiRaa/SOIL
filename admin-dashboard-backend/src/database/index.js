  // This file will manage the database connection and initialize the database models and assocaiations.
  const { Sequelize, DataTypes } = require("sequelize");
  const config = require("../config/config.js");

  // Function to establish a database connection with retry logic
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

  // Associations
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

  return db;
};
