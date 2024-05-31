
// import organicWatermelon from "images/org-fruit.jpg";
// import organicMillets from "images/org-millets.jpg";
// import strawberries from "images/strawberry.jpg";
// import banana from "images/banana.jpg";
// import tomatoes from 'images/toamtoes.webp';
// import spinach from 'images/spinach.webp';
// import salmon from 'images/salmon.webp';
// import bread from 'images/bread.webp';
// import mixedBerries from 'images/mixedBerries.webp';
// import honey from 'images/honey.webp';
// import cheese from 'images/cheddarcheese.webp';
// import nuts from 'images/mixednuts.webp';
// import grapes from 'images/redgrapes.webp';

// const organicWatermelon = require("images/org-fruit.jpg");
// const organicMillets = require("images/org-millets.jpg");
// const strawberries = require("images/strawberry.jpg");
// const banana = require("images/banana.jpg");
// const tomatoes = require('images/toamtoes.webp');
// const spinach = require('images/spinach.webp');
// const salmon = require('images/salmon.webp');
// const bread = require('images/bread.webp');
// const mixedBerries = require('images/mixedBerries.webp');
// const honey = require('images/honey.webp');
// const cheese = require('images/cheddarcheese.webp');
// const nuts = require('images/mixednuts.webp');
// const grapes = require('images/redgrapes.webp');


const products = [
  {
    minimum_purchase_unit: "200 grams",
    product_image: "images/org-millets.jpg",
    product_name: "Organic millets",
    product_description: "These are organic",
    product_rating: 4,
    product_price: 15,
    product_stock:100,
    is_special:true,
    
  },
  {
    product_image: "images/org-fruit.jpg",
    minimum_purchase_unit: "each",
    product_name: "Organic fruits",
    product_description: "these are organic",
    product_rating: 5,
    product_price: 10,
    product_stock:100,
    is_special:true
  },
  {
    product_image:"images/banana.jpg",
    minimum_purchase_unit: "1 kg",
    product_name: "Organic Bananas",
    product_description: "Fresh organic bananas",
    product_rating: 4.5,
    product_price: 2.5,
    product_stock:100,
    is_special:true
  },
  {

    product_image: "images/strawberry.jpg",
    minimum_purchase_unit: "250g",
    product_name: "Fresh Strawberries",
    product_description: "Juicy and sweet strawberries",
    product_rating: 4.8,
    product_price: 3.99,
    product_stock:100,
    is_special:true
  },
  {

    product_image: "images/toamtoes.webp",
    minimum_purchase_unit: "250g",
    product_name: "Fresh Tomatoes",
    product_description: "Organic homegrown tomatoes",
    product_rating: 5,
    product_price: 5,
    product_stock:100,
    is_special:true
  },
  {

    product_image: 'images/bread.webp',
    product_name: "Wholemeal Bread",
    minimum_purchase_unit:"1 pack",
    product_description: "Ovenbaked fresh bread",
    product_rating: 3.8,
    product_price: 4,
    product_stock:100,
    is_special:true

  },
  {

    product_image:'images/mixedBerries.webp',
    minimum_purchase_unit: "250g",
    product_name: "Mixed Berries",
    product_description: "Juicy and sweet berries",
    product_rating: 5,
    product_price: 10,
    product_stock:100,
    is_special:false
  },
  {

    product_image: 'images/spinach.webp',
    minimum_purchase_unit: "500g",
    product_name: "Local spinach",
    product_description: "Green and nutritious",
    product_rating: 3,
    product_price: 3,
    product_stock:100,
    is_special:false
  },
  {

    product_image: 'images/salmon.webp',
    minimum_purchase_unit: "250g",
    product_name: "Fresh Salmon",
    product_description: "Ocean salmon",
    product_rating: 5,
    product_price: 14,
    product_stock:100,
    is_special:false
  },
  {

    product_image: 'images/honey.webp',
    minimum_purchase_unit: "350g",
    product_name: "Organic Honey",
    product_description: "Locally harvested",
    product_rating: 5,
    product_price: 14,
    product_stock:100,
    is_special:false
  },
  {

    product_image: 'images/mixednuts.webp',
    minimum_purchase_unit: "250g",
    product_name: "Mixed Nuts",
    product_description: "Pine, almonds and cashews",
    product_rating: 2.5,
    product_price: 4,
    product_stock:100,
    is_special:false
  },
  {

    product_image: 'images/cheddarcheese.webp',
    minimum_purchase_unit: "300g",
    product_name: "Fresh Cheddar",
    product_description: "Made with fresh milk",
    product_rating: 5,
    product_price: 14,
    product_stock:100,
    is_special:true,
  },
  {

    product_image: 'images/redgrapes.webp',
    minimum_purchase_unit: "250g",
    product_name: "Red grapes",
    product_description: "Sweet and delicious",
    product_rating: 5,
    product_price: 14,
    product_stock:100,
    is_special:true,
  },
];


module.exports =  { products};
