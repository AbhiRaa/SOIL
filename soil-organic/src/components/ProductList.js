import React, { useEffect,useContext } from 'react';
import { initProducts, getProducts } from '../data/products';
import useCart from '../hooks/useCart';
import Cards from "../utils/Cards";
import UserContext from "../hooks/context";

function ProductList() {
    const { addToCart } = useCart();
    const [products, setProducts] = React.useState([]);
    let { currentloggedInUser } = useContext(UserContext);

    useEffect(() => {
        initProducts();  // Initialize products in local storage if not already initialized
        setProducts(getProducts());  // Load products from local storage into state
    }, []);

    return currentloggedInUser!==null? (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {products.map(product => (
                    <div key={product.product_id} style={{ border: '1px solid gray', padding: '10px', margin: '10px' }}>
                        <img src={product.product_image} alt={product.product_name} style={{ width: '100px', height: '100px' }} />
                        <h3>{product.product_name} - ${product.product_price.toFixed(2)}</h3>
                        <p>{product.product_description}</p>
                        <p>Quantity: {product.product_quantity}</p>
                        <p>Rating: {product.product_rating} stars</p>
                        <button onClick={() => addToCart({
                            ...product,
                            quantity: 1  // Set initial quantity to 1 when adding to cart
                        })}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    ):
    (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                {products.map(product => (
                    <div key={product.product_id} style={{ border: '1px solid gray', padding: '10px', margin: '10px' }}>
                        <img src={product.product_image} alt={product.product_name} style={{ width: '100px', height: '100px' }} />
                        <h3>{product.product_name} - ${product.product_price.toFixed(2)}</h3>
                        <p>{product.product_description}</p>
                        <p>Quantity: {product.product_quantity}</p>
                        <p>Rating: {product.product_rating} stars</p>
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default ProductList;