const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
  Op: Sequelize.Op
};

const products = [
  {
    product_quantity: "200 grams",
    product_image: "organicMillets",
    product_name: "Organic millets",
    product_description: "These are organic",
    product_rating: 4,
    product_price: 15,
  },
  {
    product_image: "organicWatermelon",
    product_quantity: "each",
    product_name: "Organic fruits",
    product_description: "these are organic",
    product_rating: 5,
    product_price: 10,
  },
  {
    product_image: "banana",
    product_quantity: "1 kg",
    product_name: "Organic Bananas",
    product_description: "Fresh organic bananas",
    product_rating: 4.5,
    product_price: 2.5,
  },
  // {
  //   product_image: strawberries,
  //   product_quantity: "250g",
  //   product_name: "Fresh Strawberries",
  //   product_description: "Juicy and sweet strawberries",
  //   product_rating: 4.8,
  //   product_price: 3.99,
  // },
  // {
  //   product_image: tomatoes,
  //   product_quantity: "250g",
  //   product_name: "Fresh Tomatoes",
  //   product_description: "Organic homegrown tomatoes",
  //   product_rating: 5,
  //   product_price: 5,
  // },
  // {
  //   product_image: bread,
  //   product_name: "Wholemeal Bread",
  //   product_quantity:"1 pack",
  //   product_description: "Ovenbaked fresh bread",
  //   product_rating: 3.8,
  //   product_price: 4,
  // },
  // {
  //   product_image: mixedBerries,
  //   product_quantity: "250g",
  //   product_name: "Mixed Berries",
  //   product_description: "Juicy and sweet berries",
  //   product_rating: 5,
  //   product_price: 10,
  // },
  // {
  //   product_image: spinach,
  //   product_quantity: "500g",
  //   product_name: "Local spinach",
  //   product_description: "Green and nutritious",
  //   product_rating: 3,
  //   product_price: 3,
  // },
  // {
  //   product_image: salmon,
  //   product_quantity: "250g",
  //   product_name: "Fresh Salmon",
  //   product_description: "Ocean salmon",
  //   product_rating: 5,
  //   product_price: 14,
  // },
  // {
  //   product_image: honey,
  //   product_quantity: "350g",
  //   product_name: "Organic Honey",
  //   product_description: "Locally harvested",
  //   product_rating: 5,
  //   product_price: 14,
  // },
  // {
  //   product_image: nuts,
  //   product_quantity: "250g",
  //   product_name: "Mixed Nuts",
  //   product_description: "Pine, almonds and cashews",
  //   product_rating: 2.5,
  //   product_price: 4,
  // },
  // {
  //   product_image: cheese,
  //   product_quantity: "300g",
  //   product_name: "Fresh Cheddar",
  //   product_description: "Made with fresh milk",
  //   product_rating: 5,
  //   product_price: 14,
  // },
  // {
  //   product_image: grapes,
  //   product_quantity: "250g",
  //   product_name: "Red grapes",
  //   product_description: "Sweet and delicious",
  //   product_rating: 5,
  //   product_price: 14,
  // },
];
// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT
});

// Include models.
db.product = require("../models/Product.js")(db.sequelize, DataTypes);
db.user = require("../models/user.js")(db.sequelize, DataTypes);

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync();

  // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
  // await db.sequelize.sync({ force: true });
  
  await seedData();
};

async function seedData() {
  const count = await db.product.count();

  // Only seed data if necessary.
  if(count > 0)
    return;

  for (let everyProduct of products){
    await db.product.create(everyProduct)
  }
  console.log('Data seeding completed');
}

module.exports = db;
