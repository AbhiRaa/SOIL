
import { initProducts } from "../../data/products";

import ProductList from "../ProductList";

function Products() {
  initProducts();
  return (
    <>
      <section>
        <h2
          style={{
            fontWeight: "500",
            fontSize: "3rem",
            color: "#207187",
            textAlign: "center",
            margin: "10px",
          }}
        >
          Top Products
        </h2>
      </section>    
        <ProductList/>
        
    </>
  );
}

export default Products;
