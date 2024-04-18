import React, { useState,useEffect } from 'react';
import {initTips , getTips} from '../data/gardenTips';

function BackyardGardeningTips() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [gardeningTips, setGardeningTips] = useState([]);
  useEffect(() => {
    initTips(); // Initialize the tips data
    const tips = getTips(); // Fetch the tips
    console.log(tips)
    setGardeningTips(tips); // Set the fetched tips into state
  }, []);

  const handleAccordionClick = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  return (
    <div className="container mx-auto m-5">
      <h1 className="text-start text-3xl font-semibold text-custom-green m-4">Don't have a huge backyard to grow your favorite vegetables?</h1>
      <h2 className="text-start text-xl font-semibold text-custom-green m-4">Check out these short posts!</h2>
      {gardeningTips.map((tip, index) => (
        <div key={index} className="mb-2">
          <button
            className={`w-full text-left p-3 text-lg font-medium bg-custom-green rounded-t-md 
                       hover:bg-green-900 focus:outline-none focus:bg-primary 
                       ${activeIndex === index ? "rounded-b-none" : "rounded-b-md text-white"}`}
            onClick={() => handleAccordionClick(index)}
          >
            {tip.title}
          </button>
          <div
            className={`overflow-hidden transition-all duration-700 ease-in-out 
                        ${activeIndex === index ? 'h-auto' : 'h-0'} 
                        border border-t-0 border-green-800 bg-orange-200 rounded-b-lg text-white`}
          >
            <div className="p-4 text-white text-lg flex gap-5">
              {/* {tip.content} */}
              <div className="flex">
                {tip.content}
              </div>
              <div className="flex px-10">
                <img src={tip.image} className='rounded w-full h-full'/>
              </div>
              </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BackyardGardeningTips;
