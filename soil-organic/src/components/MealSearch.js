import React, { useState } from 'react';

function MealSearch({ onSearch }) {
  const [query, setQuery] = useState('');

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
