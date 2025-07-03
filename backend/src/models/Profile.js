module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define('Profile', {
      // Unique identifier for the profile, automatically incremented.
      profile_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      // Corresponding user identifier, creating a one-to-one relationship.
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users', // References the 'users' table
          key: 'user_id'  // The 'user_id' column in 'users' acts as the foreign key
        }
      },
      // User's age, stored as an integer.
      age: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true, // Validates that the value is an integer
          min: 0       // Ensures age is non-negative
        }
      },
      // User's weight in kilograms, stored as a decimal for precision.
      weight: {
        type: DataTypes.DECIMAL(10, 2),
        validate: {
          isDecimal: true, // Validates that the value is a decimal
          min: 0           // Ensures weight is non-negative
        }
      },
      // User's height in centimeters, stored as an integer.
      height: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true, // Validates that the value is an integer
          min: 0       // Ensures height is non-negative
        }
      },
      // User's gender, stored as a string.
      gender: {
        type: DataTypes.STRING(50),
        validate: {
          isIn: [['', 'male', 'female']], // Ensures gender is one of the predefined options
        }
      },
      // User's daily activity level, stored as a string.
      activity_level: {
        type: DataTypes.STRING(255),
        validate: {
          isIn: [['', 'sedentary', 'lightly active', 'moderately active', 'very active', 'super active']], // Predefined activity levels
        }
      },
      // Stores user’s dietary preferences as a JSON array.
      dietary_preferences: {
        type: DataTypes.JSON,
        defaultValue: '[]',
        get() {
          const rawValue = this.getDataValue('dietary_preferences');
          return rawValue ? JSON.parse(rawValue) : [];
          // return this.getDataValue('dietary_preferences');
        },
        set(value) {
          this.setDataValue('dietary_preferences', JSON.stringify(value));
          // this.setDataValue('dietary_preferences', value);
        }
      },
      // Stores user’s health goals as a JSON array.
      health_goals: {
        type: DataTypes.JSON,
        defaultValue: '[]',
        get() {
          const rawValue = this.getDataValue('health_goals');
          return rawValue ? JSON.parse(rawValue) : [];
          // return this.getDataValue('health_goals');
        },
        set(value) {
          this.setDataValue('health_goals', JSON.stringify(value));
          // this.setDataValue('health_goals', value);
        }
      },
      // Record of the last time the profile was updated.
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: false,  // Disable automatic timestamp creation.
      tableName: 'profiles',
      indexes: [
        {
          fields: ['user_id']  // Indexing user_id for quick retrieval of profiles
        }
      ]
    });
  
    return Profile;
  };
  