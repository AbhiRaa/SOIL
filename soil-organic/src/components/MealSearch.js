import React, { useState } from 'react';

function MealSearch({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search meals..." />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default MealSearch;
