module.exports = (sequelize, DataTypes) =>
  sequelize.define("user", {
    email: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull:false,
      unique:true
    },
    username: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    joinDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    Age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Weight: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Height: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Gender: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Activity_Level: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Dietary_Preferences: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    Health_Goals: {
      type: DataTypes.STRING(40),
      allowNull: true
    }
    
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
