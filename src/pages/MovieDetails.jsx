import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Calendar, Clock, Heart } from "lucide-react";

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
      if (movie?.imdbID) {
        try {
          const API_KEY = "e1a284f5";
          const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}&plot=full`);
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
  }, [movie?.imdbID]);

  useEffect(() => {
    if (movie) {
      const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
      setIsFavorite(favorites.some(fav => fav.imdbID === movie.imdbID));
    }
  }, [movie]);

  const toggleFavorite = () => {
    if (!movie) return;
    
    const favorites = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favorites.filter(fav => fav.imdbID !== movie.imdbID);
    } else {
      updatedFavorites = [...favorites, movie];
    }
    
    localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
    
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
      ratings[movie.imdbID] = userRating;
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
      <div className="relative min-h-screen">
        <img 
          src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'}
          alt={movie.Title}
          className="w-full h-screen object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 md:top-8 md:left-8 z-10 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 md:p-3 rounded-full transition-all duration-200 flex items-center gap-2"
        >
          <ArrowLeft size={16} className="md:w-5 md:h-5" />
          <span className="hidden md:inline">Back to Movies</span>
        </button>

        <div className="absolute inset-0 flex items-center pt-20">
          <div className="container mx-auto px-4 md:px-8 lg:px-16">
            <div className="details-top flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12">
              <div className="flex-shrink-0">
                <img 
                  src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'}
                  alt={movie.Title}
                  className="w-48 md:w-80 rounded-xl shadow-2xl"
                />
              </div>

              <div className="flex-1 max-w-2xl text-center md:text-left">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">{movie.Title}</h1>
                
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-6 mb-6 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400 fill-current" size={20} />
                    <span className="font-semibold text-white">{movieDetails?.imdbRating || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={20} />
                    <span>{movie.Year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={20} />
                    <span>{movieDetails?.Runtime || 'Runtime: N/A'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                  {movieDetails?.Genre ? movieDetails.Genre.split(', ').slice(0, 3).map((genre, index) => (
                    <span key={index} className="filter bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {genre}
                    </span>
                  )) : (
                    <span className="filter bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      {movie.Type?.toUpperCase()}
                    </span>
                  )}
                </div>

                <p className="text-base md:text-lg leading-relaxed mb-8 text-gray-200">
                  {movieDetails?.Plot || movie.Plot || 'No description available'}
                </p>

                <div className="flex justify-center md:justify-start mb-8">
                  <button 
                    onClick={toggleFavorite}
                    className={`filter flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all duration-200 transform hover:scale-105 ${
                      isFavorite 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-700 hover:bg-green-600 text-white'
                    }`}
                  >
                    <Heart className={isFavorite ? 'fill-current' : ''} size={20} />
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="bg-black py-16 mb-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="max-w-2xl mx-auto text-center details-content">
            <div className="mb-12">
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
                    className="filter bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    Submit Rating
                  </button>
                )}
              </div>
              
              {showRatingSuccess && (
                <div className="filter bg-green-600 text-white px-4 py-2 rounded-lg mt-4 inline-block">
                  Rating submitted successfully!
                </div>
              )}
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-8">Movie Information</h3>
              <div className="space-y-6">
                <div>
                  <span className="font-semibold text-gray-400 text-lg block mb-2">Director</span>
                  <p className="text-gray-300 text-xl">{movieDetails?.Director || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-400 text-lg block mb-2">Runtime</span>
                  <p className="text-gray-300 text-xl">{movieDetails?.Runtime || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-400 text-lg block mb-2">Released</span>
                  <p className="text-gray-300 text-xl">{movieDetails?.Released || movie.Year}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-400 text-lg block mb-2">Language</span>
                  <p className="text-gray-300 text-xl">{movieDetails?.Language || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-8">Movie Stats</h3>
              <div className="space-y-6">
                <div>
                  <span className="font-semibold text-gray-400 text-lg block mb-2">IMDB Rating</span>
                  <p className="text-yellow-400 font-bold text-2xl">{movieDetails?.imdbRating || 'N/A'}/10</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-400 text-lg block mb-2">IMDB Votes</span>
                  <p className="text-gray-300 text-xl">{movieDetails?.imdbVotes || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-400 text-lg block mb-2">Box Office</span>
                  <p className="text-gray-300 text-xl">{movieDetails?.BoxOffice || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-400 text-lg block mb-2">Awards</span>
                  <p className="text-gray-300 text-xl">{movieDetails?.Awards || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="mb-0">
              <h3 className="text-2xl font-bold mb-8">Cast & Crew</h3>
              <div className="space-y-6">
                <div>
                  <span className="font-semibold text-gray-400 text-lg block mb-2">Actors</span>
                  <p className="text-gray-300 text-xl">{movieDetails?.Actors || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-400 text-lg block mb-2">Writer</span>
                  <p className="text-gray-300 text-xl">{movieDetails?.Writer || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};