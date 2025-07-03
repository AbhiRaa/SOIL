module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
      // Primary key for the cart table, automatically incremented.
      cart_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      // Foreign key linking to the user who owns the cart.
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,  // Ensuring one-to-one relationship between user and cart.
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      // Total cost of the items in the cart, calculated dynamically.
      total: {
        type: DataTypes.DECIMAL(10, 2),  // Sufficient for handling most currency calculations.
        defaultValue: 0.00,
        allowNull: false,
        validate: {
          isDecimal: true,
          min: 0
        }
      },
      // Creation and update timestamps.
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
      tableName: 'carts',
      indexes: [
        {
          fields: ['user_id'],  // Quick access to the cart of a user
          unique: true  // Ensures that the one-to-one relationship is enforced at the database level
        }
      ]
    });
  
    return Cart;
  };
  