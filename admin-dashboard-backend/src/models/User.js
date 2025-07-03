module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // Unique identifier for the user, automatically incremented.
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // User's email, must be unique and is required.
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Checks for email format
      }
    },
    // User's full name, required field.
    name: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        len: [2, 40] // Name must be between 2 and 40 characters.
      }
    },
    // Hashed password for security, required field.
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    // Date when the user was created, default to the current time.
    join_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    // Boolean indicating whether the user has administrative privileges.
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    // Boolean indicating whether the user is blocked.
    is_blocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    // Record of when the user was created, defaults to the current date.
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    // Record of the last time the user was updated.
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    // Email of the admin who last updated the user status.
    updated_by: {
      type: DataTypes.STRING(255),
      validate: {
        isEmail: true, // Ensure the updater identifier is an email
      }
    }
  }, {
    // Disabling the automatic timestamp creation as we're manually handling `created_at` and `updated_at`.
    timestamps: false,
    tableName: 'users',
    indexes: [
      {
        unique: true,
        fields: ['email']  // Indexing the email field for faster query performance
      }
    ]
  });

  return User;
};
