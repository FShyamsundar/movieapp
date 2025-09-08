import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export function Header({ onSearch, onFilter, onShowFavorites }) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: ''
  });
  const [favoriteCount, setFavoriteCount] = useState(0);

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];
  const years = Array.from({length: 35}, (_, i) => (2024 - i).toString());
  const ratings = Array.from({length: 10}, (_, i) => (10 - i).toString());

  const handleSearch = () => {
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  const applyFilters = () => {
    if (onFilter) {
      onFilter(filters);
    }
    setShowFilters(false);
  };

  const clearFilters = () => {
    const clearedFilters = { genre: '', year: '', rating: '' };
    setFilters(clearedFilters);
    if (onFilter) {
      onFilter(clearedFilters);
    }
  };

  const handleShowFavorites = () => {
    if (onShowFavorites) {
      onShowFavorites();
    }
  };

  useEffect(() => {
    const updateFavoriteCount = () => {
      const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
      setFavoriteCount(favorites.length);
    };
    
    updateFavoriteCount();
    
    // Custom event listener for favorite changes
    const handleFavoriteChange = () => updateFavoriteCount();
    window.addEventListener('favoriteChanged', handleFavoriteChange);
    
    return () => {
      window.removeEventListener('favoriteChanged', handleFavoriteChange);
    };
  }, []);

  return (
    <>
      <div className="text-white px-2 sm:px-4 py-4 sm:py-6">
        <div className="w-full max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="text-center mb-4">
              <h3 className="text-2xl sm:text-3xl font-bold">
                Movie <span className="text-orange-500">Hub</span>
              </h3>
            </div>
            <div className="flex flex-col items-center gap-3">
              <button 
                onClick={handleShowFavorites}
                className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm relative"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                Favorites
              </button>
              <div className="w-full max-w-2xl relative">
                <input 
                  type="search" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search movies..." 
                  className="search-bar w-full px-3 py-2 pr-16 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                />
                {searchTerm && (
                  <button 
                    onClick={clearSearch}
                    className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button 
                  onClick={handleSearch}
                  disabled={!searchTerm.trim()}
                  className="search-btn absolute right-1 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed px-2 py-1 rounded text-xs font-medium transition-colors"
                >
                  Search
                </button>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="filter w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                  Filter
                </button>
                {showFilters && (
                  <div className="filter absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                    <div className="p-3 space-y-3">
                      <div>
                        <label className="block text-xs font-medium mb-2">Genre</label>
                        <select 
                          value={filters.genre}
                          onChange={(e) => handleFilterChange('genre', e.target.value)}
                          className="filter w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:border-orange-500 text-xs"
                        >
                          <option value="">All Genres</option>
                          {genres.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2">Year</label>
                        <select 
                          value={filters.year}
                          onChange={(e) => handleFilterChange('year', e.target.value)}
                          className="filter w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:border-orange-500 text-xs"
                        >
                          <option value="">All Years</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-2">Rating</label>
                        <select 
                          value={filters.rating}
                          onChange={(e) => handleFilterChange('rating', e.target.value)}
                          className="filter w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:border-orange-500 text-xs"
                        >
                          <option value="">All Ratings</option>
                          {ratings.map(rating => (
                            <option key={rating} value={rating}>{rating}+ and above</option>
                          ))}
                        </select>
                      </div>
                      <div className="filter flex gap-2 pt-2">
                        <button 
                          onClick={applyFilters}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          Apply Filters
                        </button>
                        <button 
                          onClick={clearFilters}
                          className="filter flex-1 bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between">
            {/* Website Name - Left */}
            <div>
              <h3 className="text-4xl font-bold">
                Movie <span className="text-orange-500">Hub</span>
              </h3>
            </div>

            {/* Search, Favorites and Filter - Right */}
            <div className="flex items-center gap-4">
              <button 
                onClick={handleShowFavorites}
                className="filter bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 relative"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                Favorites
              </button>
              <div className="w-96 relative">
                <input 
                  type="search" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search movies..." 
                  className="search-bar w-full px-4 py-3 pr-20 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                />
                {searchTerm && (
                  <button 
                    onClick={clearSearch}
                    className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button 
                  onClick={handleSearch}
                  disabled={!searchTerm.trim()}
                  className="search-btn absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  Search
                </button>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="filter bg-gray-800 hover:bg-gray-700 border border-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                  Filter
                </button>
                {showFilters && (
                  <div className="filter absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Genre</label>
                        <select 
                          value={filters.genre}
                          onChange={(e) => handleFilterChange('genre', e.target.value)}
                          className="filter w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                        >
                          <option value="">All Genres</option>
                          {genres.map(genre => (
                            <option key={genre} value={genre}>{genre}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Year</label>
                        <select 
                          value={filters.year}
                          onChange={(e) => handleFilterChange('year', e.target.value)}
                          className="filter w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                        >
                          <option value="">All Years</option>
                          {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <select 
                          value={filters.rating}
                          onChange={(e) => handleFilterChange('rating', e.target.value)}
                          className="filter w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                        >
                          <option value="">All Ratings</option>
                          {ratings.map(rating => (
                            <option key={rating} value={rating}>{rating}+ and above</option>
                          ))}
                        </select>
                      </div>
                      <div className="filter flex gap-2 pt-2">
                        <button 
                          onClick={applyFilters}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-sm font-medium transition-colors"
                        >
                          Apply Filters
                        </button>
                        <button 
                          onClick={clearFilters}
                          className="filter flex-1 bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded text-sm font-medium transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}