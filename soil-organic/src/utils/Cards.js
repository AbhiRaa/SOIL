import react from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function Cards({name, image , quantity , price}) {

    return (  
    <Card b style={{ width: '35%', minWidth: '350px', height:'80%' , color:'#207187', boxSizing:'border-box', padding:'10px', margin:'10px'}}>
      <Card.Img variant="top" src={`${image}`} style={{ maxWidth: '100%', height: '400px',objectFit: 'cover'}} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>                                                                                                                                
        <Card.Text>                          
          {quantity}<br />
          ${price}                                                    
        </Card.Text>
        <Button variant="primary" style={{backgroundColor:'#207187'}}>Add to Cart</Button>                                
      </Card.Body>                                                                           
    </Card>   
    )                                 
}

export default Cards;