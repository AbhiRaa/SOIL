import React, { useEffect, useState } from "react";
import organicWatermelon from "../images/org-fruit.jpg";
import organicMillets from "../images/org-millets.jpg";
import strawberries from "../images/strawberry.jpg";
import banana from "../images/banana.jpg";

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
    },
    {
      product_id: 2,
      product_image: organicWatermelon,
      product_quantity: "each",
      product_name: "Organic fruits",
      product_description: "these are organic",
      product_rating: 5,
      product_price: 10,
    },
    {
      product_id: 3,
      product_image: banana,
      product_quantity: "1 kg",
      product_name: "Organic Bananas",
      product_description: "Fresh organic bananas",
      product_rating: 4.5,
      product_price: 2.5,
    },
    {
      product_id: 4,
      product_image: strawberries,
      product_quantity: "250g",
      product_name: "Fresh Strawberries",
      product_description: "Juicy and sweet strawberries",
      product_rating: 4.8,
      product_price: 3.99,
    },
  ];
  localStorage.setItem("products", JSON.stringify(products));
}

function getProducts() {
  const products = localStorage.getItem("products");

  return JSON.parse(products);
}

export { initProducts, getProducts };
