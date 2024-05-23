module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define('CartItem', {
      // Primary key for the cart item table, automatically incremented.
      cart_item_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      // Foreign key linking to the cart that contains this item.
      cart_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'carts',
          key: 'cart_id'
        }
      },
      // Foreign key linking to the product added to the cart.
      product_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'products',
          key: 'product_id'
        }
      },
      // Quantity of the product in the cart.
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 1  // Quantity should be at least one or more.
        }
      },
      // Price of the product at the time it was added to the cart.
      price_at_time: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: 0
        }
      }
    }, {
      timestamps: false,
      tableName: 'cart_items',
      indexes: [
          {
            fields: ['cart_id']  // Improve performance of operations within a single cart
          },
          {
            fields: ['product_id']  // Speed up searches and operations by product
          }
        ]
      });
  
    return CartItem;
  };
  