/**
 * TopProducts.js
 * 
 * This file defines the `Products` component that displays a curated list of top-rated products
 * within the application. It leverages the `ProductList` component to render products that meet a
 * specific rating threshold. The component initializes product data upon rendering and showcases
 * products with a rating of 4.5 or higher.
 * 
 * Imports:
 * - initProducts: A function from `../../data/products` that initializes the product dataset.
 * - ProductList: A component that renders a list of products based on provided filtering criteria.
 */
import { initProducts } from "../../data/products";
import ProductList from "../ProductList";

function Products() {
  initProducts();   // Initialize products at the start. This function could be fetching or setting up data.
  return (
    <>
      <section>
        <h2 className="font-medium text-4xl text-teal-700 ml-5 mt-5 flex justify-center">
          Top Products
        </h2>
      </section>    
        <ProductList filterRating={4.5}/>
        
    </>
  );
}

export default Products;
