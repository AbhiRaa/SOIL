import React, { useEffect,useContext } from 'react';
import { initProducts, getProducts } from '../data/products';
import useCart from '../hooks/useCart';
import UserContext from "../hooks/context";


function ProductList() {
    const { addToCart } = useCart();
    const [products, setProducts] = React.useState([]);
    let { currentloggedInUser } = useContext(UserContext);

    useEffect(() => {
        initProducts();  // Initialize products in local storage if not already initialized
        setProducts(getProducts());  // Load products from local storage into state
    }, []);

    return (
            <div className="flex flex-wrap justify-center">
                {products.map(product => (
                    <div key={product.product_id} className="border border-primary text-orange-600 rounded-lg p-4 m-4 w-64 shadow-lg">
                        <img src={product.product_image} alt={product.product_name} className="w-full h-40 object-cover rounded-t-lg"/>
                        <h3 className="text-lg font-bold" >{product.product_name} - ${product.product_price.toFixed(2)}</h3>
                        <p className="text-md text-primary">{product.product_description}</p>
                        <p className="text-md font-bold">Quantity: {product.product_quantity}</p>
                        <p className="text-md font-bold">Rating: {product.product_rating} stars</p>
                        {currentloggedInUser && (
                        <button onClick={() => addToCart({
                            ...product,
                            quantity: 1  // Set initial quantity to 1 when adding to cart
                        })} className="mt-4  hover:bg-teal-300 text-primary font-bold py-2 px-4 rounded-lg border border-primary">
                            Add to cart
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ProductList;