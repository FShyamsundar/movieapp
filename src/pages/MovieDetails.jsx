import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar, Clock, Heart, User, Users, Trophy, Globe } from "lucide-react";

export const MovieDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;
  
  const [userRating, setUserRating] = useState(0);
  const [showRatingSuccess, setShowRatingSuccess] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (movie?.id) {
        try {
          const API_KEY = import.meta.env.VITE_API_KEY;
          const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`);
          const data = await response.json();
          setMovieDetails(data);
        } catch (error) {
          console.error('Error fetching movie details:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMovieDetails();
  }, [movie?.id]);

  useEffect(() => {
    if (movie) {
      const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
      setIsFavorite(favorites.some(fav => fav.id === movie.id));
    }
  }, [movie]);

  const toggleFavorite = () => {
    if (!movie) return;
    
    const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
    } else {
      updatedFavorites = [...favorites, movie];
    }
    
    localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
    
    // Trigger custom event to update header count
    window.dispatchEvent(new Event('favoriteChanged'));
  };
  
  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Go Back 
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading movie details...</p>
        </div>
      </div>
    );
  }

  const handleRatingSubmit = () => {
    if (userRating > 0) {
      const ratings = JSON.parse(localStorage.getItem('movieRatings') || '{}');
      ratings[movie.id] = userRating;
      localStorage.setItem('movieRatings', JSON.stringify(ratings));
      setShowRatingSuccess(true);
      setTimeout(() => setShowRatingSuccess(false), 2000);
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        <img 
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 md:top-8 md:left-8 z-10 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 md:p-3 rounded-full transition-all duration-200 flex items-center gap-2"
        >
          <ArrowLeft size={16} className="md:w-5 md:h-5" />
          <span className="hidden md:inline">Back to Movies</span>
        </button>

        {/* Movie Info Overlay */}
        <div className="absolute inset-0 flex items-start md:items-center pt-40 md:pt-24">
          <div className="container mx-auto px-4 md:px-8 lg:px-16 pb-8 md:pb-0">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
              {/* Movie Poster */}
              <div className="flex-shrink-0 order-1">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-48 md:w-80 rounded-xl shadow-2xl"
                />
              </div>

              {/* Movie Details */}
              <div className="flex-1 max-w-2xl order-2 text-center md:text-left">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">{movie.title}</h1>
                
                {/* Movie Meta Info */}
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-6 mb-6 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400 fill-current" size={20} />
                    <span className="font-semibold text-white">{movie.vote_average?.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={20} />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={20} />
                    <span>{movieDetails?.runtime ? `${movieDetails.runtime} min` : 'Runtime: N/A'}</span>
                  </div>
                </div>

                {/* Genre Tags */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                  {movie.genre_ids?.slice(0, 3).map((genreId) => {
                    const genreNames = {
                      28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
                      99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
                      27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
                      10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
                    };
                    return (
                      <span key={genreId} className="genre bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        {genreNames[genreId] || 'Unknown'}
                      </span>
                    );
                  }) || (
                    <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {movie.original_language?.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-base md:text-lg leading-relaxed mb-8 text-gray-200">
                  {movie.overview}
                </p>

                {/* Action Button */}
                <div className="flex justify-center md:justify-start mb-16">
                  <button 
                    onClick={toggleFavorite}
                    className={`view-btn flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all duration-200 transform hover:scale-105 ${
                      isFavorite 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-700 hover:bg-green-600 text-white'
                    }`}
                  >
                    <Heart className={isFavorite ? 'fill-current' : ''} size={20} />
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>
                </div>

                {/* User Rating Section */}
                <div className="text-center mb-16">
                  <h3 className="text-2xl font-bold mb-6">Rate This Movie</h3>
                  <div className="flex flex-col items-center gap-6">
                    <div>
                      <p className="text-gray-400 mb-4">Your Rating:</p>
                      <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setUserRating(star)}
                            className="text-3xl transition-colors duration-200 hover:scale-110"
                          >
                            <Star 
                              size={32} 
                              className={star <= userRating ? 'text-yellow-400 fill-current' : 'text-gray-400'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    {userRating > 0 && (
                      <button
                        onClick={handleRatingSubmit}
                        className="view-btn bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                      >
                        Submit Rating
                      </button>
                    )}
                  </div>
                  
                  {showRatingSuccess && (
                    <div className="view-btn bg-green-600 text-white px-4 py-2 rounded-lg mt-4 inline-block">
                      Rating submitted successfully !
                    </div>
                  )}
                </div>

                {/* Movie Info */}
                <div className="text-center mb-16">
                  <h3 className="text-2xl font-bold mb-6">Movie Information</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="font-semibold text-gray-400 block mb-1">Original Title:</span>
                      <p className="text-gray-300">{movie.original_title}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-400 block mb-1">Adult Content:</span>
                      <p className="text-gray-300">{movie.adult ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-400 block mb-1">Vote Count:</span>
                      <p className="text-gray-300">{movie.vote_count} votes</p>
                    </div>
                  </div>
                </div>

                {/* Movie Stats */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6">Movie Stats</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Star size={20} className="text-yellow-400" />
                        <span className="font-semibold">Rating</span>
                      </div>
                      <p className="text-gray-300 text-lg">{movie.vote_average?.toFixed(1)}/10</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Trophy size={20} className="text-orange-400" />
                        <span className="font-semibold">Popularity</span>
                      </div>
                      <p className="text-gray-300 text-lg">{movie.popularity?.toFixed(0)}</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Globe size={20} className="text-blue-400" />
                        <span className="font-semibold">Language</span>
                      </div>
                      <p className="text-gray-300 text-lg">{movie.original_language?.toUpperCase()}</p>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Users size={20} className="text-green-400" />
                        <span className="font-semibold">Votes</span>
                      </div>
                      <p className="text-gray-300 text-lg">{movie.vote_count}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};