module.exports = (sequelize, DataTypes) => {
    const Follows = sequelize.define('Follows', {
      // Foreign key for the user who is following another user.
      follower_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // This is the table name
          key: 'user_id'
        }
      },
      // Foreign key for the user who is being followed.
      following_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',  // This is the table name
          key: 'user_id'
        }
      },
      // Timestamp for when the follow relationship was created.
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false, // Disabling Sequelize default timestamps to use custom field
      tableName: 'follows',
      indexes: [
          {
              unique: true,
              fields: ['follower_id', 'following_id'], // Unique index for follower and following
              name: 'unique_follows_index'
          },
          {
              fields: ['follower_id'] // Optimize lookup for who a user is following
          },
          {
              fields: ['following_id'] // Optimize lookup for who is following a user
          }
      ]
    });
  
    // // Define a composite primary key to prevent duplicate follow records.
    // Follows.removeAttribute('id');
    // Follows.addIndex(['follower_id', 'following_id'], {
    //   unique: true,
    //   name: 'unique_follows_index'
    // });
  
    return Follows;
  };
  