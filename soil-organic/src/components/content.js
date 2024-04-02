import React from 'react';
import Products from './content/TopProducts';
import About from './about';
import Container from 'react-bootstrap/Container';

function Content() {
    return (
        <Container fluid>
            <About />
            <Products />
        </Container>
        
        );
}
 
export default Content;