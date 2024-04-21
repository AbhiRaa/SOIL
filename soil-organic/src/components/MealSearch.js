import React, { useState } from 'react';

/**
 * MealSearch component provides a search bar to enter meal queries. Upon submission,
 * it triggers a search operation based on the input query.
 *
 * @param {Function} onSearch - Callback function to execute when the search button is clicked.
 *                              This function is intended to handle the search logic.
 */
function MealSearch({ onSearch }) {
  // State to hold the search query input by the user
  const [query, setQuery] = useState('');

  /**
   * handleSearch triggers the search operation by calling the onSearch callback.
   * It passes the current query state to the onSearch function.
   */
  const handleSearch = async () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div >
      <div className='flex gap-4'>
      <input type="text" className='text-lg border-primary border-2 rounded-lg bg-orange-100 p-3 text-primary' value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search meals..." />
      <button onClick={handleSearch} className='bg-primary rounded-md p-3 text-white'>Search</button>
      </div>
    </div>
  );
}

export default MealSearch;
