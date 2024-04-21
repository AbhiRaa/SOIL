
import { initProducts } from "../../data/products";

import ProductList from "../ProductList";

function Products() {
  initProducts();
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
