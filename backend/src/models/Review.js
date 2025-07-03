module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
      // Primary key for the review table, automatically incremented.
      review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      // Foreign key linking to the product reviewed.
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'product_id'
        }
      },
      // Foreign key linking to the user who wrote the review.
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      // Review content limited to 100 words.
      content: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 1000] // Set a reasonable character limit to maintain concise reviews.
        }
      },
      // Numeric rating from 1 to 5.
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      // Visibility flag to manage the display of reviews.
      is_visible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      // Record of when the review was created.
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      // Record of when the review was last updated.
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      // Email of the admin who last deemed the review.
      updated_by: {
        type: DataTypes.STRING(255),
        validate: {
          isEmail: true
        }
      }
    }, {
      timestamps: false,
      tableName: 'reviews',
      indexes: [
        {
          fields: ['product_id']  // Helps in fetching all reviews for a product
        },
        {
          fields: ['user_id']  // Helps in fetching all reviews made by a user
        }
      ]
    });
  
    return Review;
  };
  