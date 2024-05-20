module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("product", {
      productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      product_quantity: {
        type: DataTypes.STRING, // Assuming the quantity can contain units (e.g., "200 grams")
        allowNull: false
      },
      product_description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      product_image: {
        type: DataTypes.STRING, // Assuming the image URL is a string
        allowNull: false
      },
      product_rating: {
        type: DataTypes.FLOAT, // Assuming the rating can be a decimal value
        allowNull: true
      },
      product_price: {
        type: DataTypes.FLOAT, // Assuming the price can be a decimal value
        allowNull: false
      }
    });
  
    return Product;
  };
  