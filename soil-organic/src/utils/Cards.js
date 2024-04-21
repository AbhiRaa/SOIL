import React,{useContext} from "react";
import useCart from '../hooks/useCart';
import UserContext from "../hooks/context";


function Cards({ key ,product }) {
  const { addToCart } = useCart();
  let { currentloggedInUser } = useContext(UserContext);
  //card inspiration from floatbite react source- https://flowbite-react.com/docs/components/card
  return currentloggedInUser!==null? (
    
    <div key={key} className="max-w-sm mx-5 my-2 shadow-lg rounded-lg bg-white dark:bg-gray-800">
      <div className="invisible">{key}</div>
      <img
        src={product.product_image}
        alt={product.product_name}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <a href="#">
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {product.product_name}
          </h5>
        </a>
        <p className="mt-2">
          Quantity: {product.product_quantity} <br /> Price: ${product.product_price}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${product.product_price}
          </span>
          <button className="bg-primary text-white font-medium py-2 px-4 rounded hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  ):(
    <div key={key} className="max-w-sm mx-5 my-2 shadow-lg rounded-lg bg-white dark:bg-gray-800">
      <div className="invisible">{key}</div>
      <img
        src={product.product_image}
        alt={product.product_name}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <a href="#">
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {product.product_name}
          </h5>
        </a>
        <p className="mt-2">
          Quantity: {product.product_quantity} <br /> Price: ${product.product_price}ī
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            ${product.product_price}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Cards;
