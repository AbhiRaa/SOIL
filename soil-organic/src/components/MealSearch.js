import React, { useState } from 'react';

/**
 * Enhanced MealSearch component with improved UX and functionality.
 * Features include search suggestions, keyboard support, and loading states.
 *
 * @param {Function} onSearch - Callback function to execute when searching.
 * @param {boolean} loading - Whether the search is currently loading.
 */
function MealSearch({ onSearch, loading = false }) {
  const [query, setQuery] = useState('');
  
  // Common search suggestions
  const searchSuggestions = [
    'chicken', 'vegetarian pasta', 'protein bowl', 'quinoa salad', 
    'breakfast smoothie', 'healthy snacks', 'low carb dinner'
  ];

  /**
   * Handle search with validation
   */
  const handleSearch = async () => {
    if (query.trim() && onSearch && !loading) {
      onSearch(query.trim());
    }
  };

  /**
   * Handle Enter key press for search
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * Handle suggestion click
   */
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    if (onSearch && !loading) {
      onSearch(suggestion);
    }
  };

  /**
   * Clear search input
   */
  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for recipes (e.g., chicken, pasta, salad)..." 
              className="w-full px-4 py-3 pl-10 border-2 border-orange-200 rounded-lg bg-orange-50 text-primary placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition-all duration-200"
              disabled={loading}
            />
            {/* Search Icon */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* Clear Button */}
            {query && !loading && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Search Button */}
          <button 
            onClick={handleSearch}
            disabled={!query.trim() || loading}
            className="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-semibold rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Searching...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>🔍</span>
                <span>Search</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Search Suggestions */}
      {!query && !loading && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">💡 Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 bg-gray-100 hover:bg-primary hover:text-white rounded-full text-sm text-gray-700 transition-all duration-200 transform hover:scale-105"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MealSearch;
