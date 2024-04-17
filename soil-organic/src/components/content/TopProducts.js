import react, { useEffect } from "react";
import { initProducts, getProducts } from "../../data/products";
import Cards from "../../utils/Cards";
import ProductList from "../ProductList";

function Products() {
  initProducts();
  const products = getProducts();
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
