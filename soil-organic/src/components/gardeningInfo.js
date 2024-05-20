import React, { useState,useEffect } from 'react';
import {initTips , getTips} from '../data/gardenTips';

/**
 * BackyardGardeningTips component that displays gardening tips in an accordion format.
 * This component is ideal for users interested in gardening but with limited space,
 * offering practical tips and suggestions. Shown on Specials page.
 */
function BackyardGardeningTips() {
  // State to track the active accordion index
  const [activeIndex, setActiveIndex] = useState(0);
  // State to store gardening tips fetched from an external source
  const [gardeningTips, setGardeningTips] = useState([]);

  // Effect to initialize and fetch gardening tips data on component mount
  useEffect(() => {
    initTips(); // Initialize the tips data
    const tips = getTips(); // Fetch the tips
    console.log(tips)
    setGardeningTips(tips); // Set the fetched tips into state
  }, []);

  /**
   * Handles accordion item clicks to toggle visibility of content.
   * @param {number} index - The index of the clicked accordion item
   */
  const handleAccordionClick = (index) => {
    // Toggle active index; reset if the same index is clicked again
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
            <div className="p-4 text-white text-xl flex gap-5">
              {/* {tip.content} */}
              <div className="flex">
                {tip.content}
              </div>
              <div className="flex px-10">
                <img src={tip.image} alt={"tips"}className='rounded h-auto max-w-full'/>
              </div>
              </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BackyardGardeningTips;
