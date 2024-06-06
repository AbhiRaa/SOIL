/**
 * TopProducts.js
 * 
 * This file defines the `Products` component that displays a curated list of top 5-rated products
 * within the application. It leverages the `ProductList` component to render products that are top rated.
 * The component initializes product data upon rendering and showcases top 5 rated products.
 * 
 * Imports:
 * - initProducts: A function from `../../data/products` that initializes the product dataset.
 * - ProductList: A component that renders a list of products based on provided filtering criteria.
 */
import ProductList from "../ProductList";

function Products() {
  return (
    <>
      <section>
        <h2 className="font-medium text-4xl text-teal-700 ml-5 mt-5 flex justify-center">
          Top Products
        </h2>
      </section>    
        <ProductList topRatedLimit={5}/>
        
    </>
  );
}

export default Products;
