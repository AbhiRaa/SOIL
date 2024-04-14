import react from "react";

// function Cards({name, image , quantity , price}) {

//     return (
//     <Card b style={{ width: '35%', minWidth: '350px', height:'80%' , color:'#207187', boxSizing:'border-box', padding:'10px', margin:'10px'}}>
//       <Card.Img variant="top" src={`${image}`} style={{ maxWidth: '100%', height: '400px',objectFit: 'cover'}} />
//       <Card.Body>
//         <Card.Title>{name}</Card.Title>
//         <Card.Text>
//           {quantity}<br />
//           ${price}
//         </Card.Text>
//         <Button variant="primary" style={{backgroundColor:'#207187'}}>Add to Cart</Button>
//       </Card.Body>
//     </Card>
//     )
// }

import React from "react";

function Cards({ name, image, quantity, price }) {
  return (
    <div className="text-sm shadow-lg rounded-lg flex flex-col mx-5 my-2 w-[100%] h-auto bg-lime-200">
      <img
        src={image}
        alt={name}
        className="item-center p-2 w-auto h-1/2 rounded-xl object-cover"
      />
      <div className="p-4 flex flex-col">
        <div>
          <h5 className="text-lg font-bold">{name}</h5>
          <p className="mt-2">
            {quantity}
            <br />${price}
          </p>
        </div>
      </div>
      <div className="pt-2">
        <button className="bg-[#207187] text-white font-medium py-2 px-4 rounded mt-4 hover:bg-[#1e6a86] focus:outline-none focus:ring-2 focus:ring-[#1e6a86] focus:ring-opacity-50 flex">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default Cards;
