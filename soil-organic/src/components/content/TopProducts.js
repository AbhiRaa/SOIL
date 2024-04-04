import react, { useEffect } from 'react';
import { initProducts, getProducts } from '../../data/products';
import Cards from '../../utils/Cards'
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';

function Products() {
    initProducts();
    const products = getProducts();
    return (
        <>  
            <section>
                <h2 style={{fontWeight:'500' , fontSize:'3rem' ,color:'#207187', textAlign:'center' , margin:'10px'}}>Top Products</h2>
                {/* <Link to="/Specia ">
                    <Button variant="primary">View Specials</Button>
                </Link> */}
            </section>
            <section className='Container flex justify-around '>
            {
                products.map((product) =>
                        <Cards key = {product.product_id} name ={product.product_name} image = {product.product_image} quantity ={product.product_quantity} price={product.product_price} />
                )
            }
            </section>
        </>
    )
}

export default Products;