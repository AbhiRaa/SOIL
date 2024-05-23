module.exports = (sequelize, DataTypes) => {
    const ReviewReply = sequelize.define('ReviewReply', {
      // Primary key for the reply table, automatically incremented.
      reply_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      // Foreign key linking to the review that is being replied to.
      review_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'reviews',
          key: 'review_id'
        }
      },
      // Foreign key linking to the user who wrote the reply.
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      // Content of the reply limited to 100 words to ensure brevity.
      content: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 1000] // Similar to reviews, we limit characters to ensure replies are concise.
        }
      },
      // Timestamp of when the reply was created.
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,
      tableName: 'review_replies',
      indexes: [
          {
            fields: ['review_id']  // Speed up the retrieval of all replies for a review
          }
        ]
      });
  
    return ReviewReply;
  };
  