import { useEffect, useState } from "react"
import { Card } from "../components/Card";
import MovieSliderBanner from "../components/Slider";
import useFetch from "../../Hooks/useFetch";

const GENRE_KEYWORDS = {
  'Action': ['action', 'fight', 'war', 'battle', 'hero'],
  'Comedy': ['comedy', 'funny', 'laugh', 'humor'],
  'Drama': ['drama', 'story', 'life', 'love'],
  'Horror': ['horror', 'scary', 'fear', 'dark'],
  'Romance': ['love', 'romance', 'heart', 'wedding'],
  'Sci-Fi': ['space', 'future', 'alien', 'robot', 'star'],
  'Thriller': ['thriller', 'mystery', 'crime', 'detective']
};

export function MovieList({ title = "Now Playing", apiPath = "movie/now_playing", searchTerm = "", filters = {}, showFavorites = false, setShowFavorites }) {
  const [activeCategory, setActiveCategory] = useState('popular');
  const [currentApiPath, setCurrentApiPath] = useState('popular');
  const [currentTitle, setCurrentTitle] = useState('Popular Movies');
  const [filteredMovies, setFilteredMovies] = useState([]);
  
  const {data: movies} = useFetch(searchTerm ? 'search' : currentApiPath, searchTerm);
  const [isSearching, setIsSearching] = useState(false);
  
  const categories = [
    { id: 'popular', label: 'Popular', apiPath: 'popular', title: 'Popular Movies' },
    { id: 'toprated', label: 'Top Rated', apiPath: 'top', title: 'Top Movies' },
    { id: 'upcoming', label: 'New', apiPath: 'new', title: 'New Movies' }
  ];
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category.id);
    setCurrentApiPath(category.apiPath);
    setCurrentTitle(category.title);
    setShowFavorites(false);
  };
  
  useEffect(()=>{
    document.title = `MovieHub - ${currentTitle}`;
  }, [currentTitle]);

  useEffect(() => {
    setIsSearching(!!searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (!movies || movies.length === 0) {
      setFilteredMovies([]);
      return;
    }
    
    let filtered = [...movies];
    
    // Apply year filter
    if (filters.year && filters.year !== '') {
      filtered = filtered.filter(movie => {
        if (!movie.Year) return false;
        return movie.Year === filters.year;
      });
    }
    
    // Apply rating filter (simulate with year as proxy since OMDB search doesn't have ratings)
    if (filters.rating && filters.rating !== '') {
      const minRating = parseFloat(filters.rating);
      // Filter newer movies for higher ratings (rough approximation)
      if (minRating >= 8) {
        filtered = filtered.filter(movie => movie.Year >= '2010');
      } else if (minRating >= 6) {
        filtered = filtered.filter(movie => movie.Year >= '2000');
      }
    }
    
    // Apply genre filter (filter by title keywords)
    if (filters.genre && filters.genre !== '') {
      const keywords = GENRE_KEYWORDS[filters.genre] || [filters.genre.toLowerCase()];
      filtered = filtered.filter(movie => 
        keywords.some(keyword => 
          movie.Title && movie.Title.toLowerCase().includes(keyword)
        )
      );
    }
    
    setFilteredMovies(filtered);
  }, [movies, filters]);

  const getFavoriteMovies = () => {
    try {
      return JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    } catch (error) {
      console.error('Error parsing favorites from localStorage:', error);
      return [];
    }
  };

  const displayTitle = showFavorites ? 'My Favorite Movies' : (searchTerm ? `Search Results for "${searchTerm}"` : currentTitle);
  const hasActiveFilters = filters && Object.keys(filters).some(key => filters[key] && filters[key] !== '');
  const displayMovies = showFavorites ? getFavoriteMovies() : (hasActiveFilters ? filteredMovies : movies);
  
  return (
    <>
      <div className="slider">
        <MovieSliderBanner/>
      </div>
      <div className="py-8">
        <div className="menu flex flex-row gap-8 md:gap-20 justify-center items-center text-lg md:text-2xl px-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category)}
              className={`relative px-4 py-2 font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeCategory === category.id
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-500'
              }`}
            >
              {category.label}
              {activeCategory === category.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-100 transition-transform duration-300"></span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="title px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">{displayTitle}</h2>
        <div className="movies-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {displayMovies && displayMovies.length > 0 ? (
            displayMovies.map((movie, index) => (
              <Card movie={movie} key={`${movie.imdbID}-${index}`} />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center min-h-[400px]">
              <div className="text-center max-w-md mx-auto">
                {showFavorites ? (
                  <>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Favorites Yet</h3>
                    <p className="text-gray-500">You haven't added any movies to your favorites. Start exploring and add movies you love!</p>
                    <button 
                      onClick={() => setShowFavorites(false)}
                      className="filter mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Browse Movies
                    </button>
                  </>
                ) : isSearching ? (
                  <>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Movies Found</h3>
                    <p className="text-gray-500">Sorry, we couldn't find any movies matching "{searchTerm}". Try searching with different keywords.</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results</h3>
                    <p className="text-gray-500">No movies match your current filter criteria. Try adjusting your filters.</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


