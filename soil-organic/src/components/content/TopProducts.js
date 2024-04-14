import react, { useEffect } from "react";
import { initProducts, getProducts } from "../../data/products";
import Cards from "../../utils/Cards";

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
      <section className="grid md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Cards
            key={product.product_id}
            name={product.product_name}
            image={product.product_image}
            quantity={product.product_quantity}
            price={product.product_price}
          />
        ))}
      </section>
    </>
  );
}

export default Products;
