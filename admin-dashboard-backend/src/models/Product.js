module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    // Primary key for the product table, automatically incremented.
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Product name, required and constrained to 255 characters.
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true, // Ensures the product name is not empty.
        len: [1, 255]  // Ensures the length is between 1 and 255 characters.
      }
    },
    // Description of the product, allowing up to 1000 characters.
    product_description: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 1000] // Ensures the description is not too lengthy.
      }
    },
    // Price of the product, stored as a decimal for accuracy.
    product_price: {
      type: DataTypes.DECIMAL(10, 2), // Allows values up to 99999999.99
      allowNull: false,
      validate: {
        isDecimal: true, // Ensures the price is a valid decimal number.
        min: 0.01       // Ensures the price cannot be zero or negative.
      }
    },
    // URL or path to the product's image.
    product_image: {
      type: DataTypes.STRING(255),
      // validate: {
      //   isUrl: true // Validates that the string is a well-formed URL.
      // }
    },
    // Minimum purchase unit, e.g., "200 grams" or "1 pack", stored as a string.
    minimum_purchase_unit: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    // Stock available for the product, ensuring inventory management.
    product_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true, // Ensures stock count is an integer.
        min: 0       // Ensures stock count is not negative.
      }
    },
    // Boolean flag to indicate if the product is a special offer.
    is_special: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    // Record of creation time.
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    // Record of the last update time.
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    // Email of the admin who last updated the product.
    updated_by: {
      type: DataTypes.STRING(255),
      validate: {
        isEmail: true // Validates that the string is a valid email address.
      }
    }
  }, {
    timestamps: false, // Disable automatic timestamp creation.
    tableName: 'products',
    indexes: [
      {
        fields: ['product_name']  // Facilitate fast searches on product name
      }
    ]
  });

  return Product;
};
