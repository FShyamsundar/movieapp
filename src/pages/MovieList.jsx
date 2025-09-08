import { useEffect, useState } from "react"
import { Card } from "../components/Card";
import MovieSliderBanner from "../components/Slider";
import useFetch from "../../Hooks/useFetch";

export function MovieList({ title = "Now Playing", apiPath = "movie/now_playing", searchTerm = "", filters = {}, showFavorites = false, setShowFavorites }) {
  const [activeCategory, setActiveCategory] = useState('popular');
  const [currentApiPath, setCurrentApiPath] = useState('movie/popular');
  const [currentTitle, setCurrentTitle] = useState('Popular Movies');
  const [filteredMovies, setFilteredMovies] = useState([]);
  
  const {data: movies} = useFetch(searchTerm ? `search/movie` : currentApiPath, searchTerm);
  const [isSearching, setIsSearching] = useState(false);
  
  const categories = [
    { id: 'popular', label: 'Popular', apiPath: 'movie/popular', title: 'Popular Movies' },
    { id: 'toprated', label: 'Top Rated', apiPath: 'movie/top_rated', title: 'Top Rated Movies' },
    { id: 'upcoming', label: 'Upcoming', apiPath: 'movie/upcoming', title: 'Upcoming Movies' }
  ];
  
  const handleCategoryChange = (category) => {
    setActiveCategory(category.id);
    setCurrentApiPath(category.apiPath);
    setCurrentTitle(category.title);
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
        if (!movie.release_date) return false;
        const movieYear = new Date(movie.release_date).getFullYear();
        return movieYear.toString() === filters.year;
      });
    }
    
    // Apply rating filter (minimum rating)
    if (filters.rating && filters.rating !== '') {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter(movie => {
        if (!movie.vote_average) return false;
        return movie.vote_average >= minRating;
      });
    }
    
    // Apply genre filter
    if (filters.genre && filters.genre !== '') {
      const genreMap = {
        'Action': 28, 'Adventure': 12, 'Animation': 16, 'Comedy': 35, 'Crime': 80,
        'Documentary': 99, 'Drama': 18, 'Family': 10751, 'Fantasy': 14, 'History': 36,
        'Horror': 27, 'Music': 10402, 'Mystery': 9648, 'Romance': 10749, 'Sci-Fi': 878,
        'TV Movie': 10770, 'Thriller': 53, 'War': 10752, 'Western': 37
      };
      const genreId = genreMap[filters.genre];
      if (genreId) {
        filtered = filtered.filter(movie => 
          movie.genre_ids && movie.genre_ids.includes(genreId)
        );
      }
    }
    
    setFilteredMovies(filtered);
  }, [movies, filters]);

  const getFavoriteMovies = () => {
    return JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
  };

  const displayTitle = showFavorites ? 'My Favorite Movies' : (searchTerm ? `Search Results for "${searchTerm}"` : currentTitle);
  const displayMovies = showFavorites ? getFavoriteMovies() : (Object.keys(filters).some(key => filters[key] && filters[key] !== '') ? filteredMovies : movies);
  
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
            displayMovies.map((movie) => (
              <Card movie={movie} key={movie.id} />
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


