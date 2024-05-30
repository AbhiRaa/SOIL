
import organicWatermelon from "../images/org-fruit.jpg";
import organicMillets from "../images/org-millets.jpg";
import strawberries from "../images/strawberry.jpg";
import banana from "../images/banana.jpg";
import tomatoes from '../images/toamtoes.webp';
import spinach from '../images/spinach.webp';
import salmon from '../images/salmon.webp';
import bread from '../images/bread.webp';
import mixedBerries from '../images/mixedBerries.webp';
import honey from '../images/honey.webp';
import cheese from '../images/cheddarcheese.webp';
import nuts from '../images/mixednuts.webp';
import grapes from '../images/redgrapes.webp';

function initProducts() {
  if (localStorage.getItem("products") !== null) return;
  const products = [
    {
      product_id: 1,
      product_quantity: "200 grams",
      product_image: organicMillets,
      product_name: "Organic millets",
      product_description: "These are organic",
      product_rating: 4,
      product_price: 15,
      is_special:true
    },
    {
      product_id: 2,
      product_image: organicWatermelon,
      product_quantity: "each",
      product_name: "Organic fruits",
      product_description: "these are organic",
      product_rating: 5,
      product_price: 10,
      is_special:true
    },
    {
      product_id: 3,
      product_image: banana,
      product_quantity: "1 kg",
      product_name: "Organic Bananas",
      product_description: "Fresh organic bananas",
      product_rating: 4.5,
      product_price: 2.5,
      is_special:true
    },
    {
      product_id: 4,
      product_image: strawberries,
      product_quantity: "250g",
      product_name: "Fresh Strawberries",
      product_description: "Juicy and sweet strawberries",
      product_rating: 4.8,
      product_price: 3.99,
      is_special:true
    },
    {
      product_id: 5,
      product_image: tomatoes,
      product_quantity: "250g",
      product_name: "Fresh Tomatoes",
      product_description: "Organic homegrown tomatoes",
      product_rating: 5,
      product_price: 5,
      is_special:true
    },
    {
      product_id: 6,
      product_image: bread,
      product_name: "Wholemeal Bread",
      product_quantity:"1 pack",
      product_description: "Ovenbaked fresh bread",
      product_rating: 3.8,
      product_price: 4,
      is_special:true
    },
    {
      product_id: 7,
      product_image: mixedBerries,
      product_quantity: "250g",
      product_name: "Mixed Berries",
      product_description: "Juicy and sweet berries",
      product_rating: 5,
      product_price: 10,
    },
    {
      product_id: 8,
      product_image: spinach,
      product_quantity: "500g",
      product_name: "Local spinach",
      product_description: "Green and nutritious",
      product_rating: 3,
      product_price: 3,
    },
    {
      product_id: 9,
      product_image: salmon,
      product_quantity: "250g",
      product_name: "Fresh Salmon",
      product_description: "Ocean salmon",
      product_rating: 5,
      product_price: 14,
    },
    {
      product_id: 10,
      product_image: honey,
      product_quantity: "350g",
      product_name: "Organic Honey",
      product_description: "Locally harvested",
      product_rating: 5,
      product_price: 14,
    },
    {
      product_id: 11,
      product_image: nuts,
      product_quantity: "250g",
      product_name: "Mixed Nuts",
      product_description: "Pine, almonds and cashews",
      product_rating: 2.5,
      product_price: 4,
    },
    {
      product_id: 12,
      product_image: cheese,
      product_quantity: "300g",
      product_name: "Fresh Cheddar",
      product_description: "Made with fresh milk",
      product_rating: 5,
      product_price: 14,
    },
    {
      product_id: 13,
      product_image: grapes,
      product_quantity: "250g",
      product_name: "Red grapes",
      product_description: "Sweet and delicious",
      product_rating: 5,
      product_price: 14,
    },
  ];
  localStorage.setItem("products", JSON.stringify(products));
}

function getProducts() {
  const products = localStorage.getItem("products");

  return JSON.parse(products);
}

export { initProducts, getProducts };
