import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Star, Calendar, Clock, Pause } from 'lucide-react';
import useFetch from '../../Hooks/useFetch';

const MovieSliderBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const navigate = useNavigate();
  
  const { data: movies } = useFetch('popular');
  const sliderMovies = movies?.slice(0, 5) || [];

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlay || sliderMovies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderMovies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, sliderMovies.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderMovies.length) % sliderMovies.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentMovie = sliderMovies[currentSlide];
  
  if (!currentMovie) return <div className="w-full h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="relative w-full h-screen sm:h-screen overflow-hidden bg-black">
      {/* Background Images */}
      <div className="absolute inset-0">
        {sliderMovies.map((movie, index) => (
          <div
            key={`${movie.imdbID}-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index == currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'}
              alt={movie.Title}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-8 lg:px-16">
          <div className="max-w-xs sm:max-w-lg md:max-w-2xl slider-content">
            {/* Movie Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-2 sm:mb-4 animate-fadeIn">
              {currentMovie.Title}
            </h1>
            
            {/* Tagline */}
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-4 sm:mb-6 font-light italic">
              {currentMovie.tagline || 'Discover the story'}
            </p>

            {/* Movie Info */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-6 text-white text-sm sm:text-base">
              <div className="flex items-center gap-1 sm:gap-2">
                <Star className="text-yellow-400 fill-current" size={16} />
                <span className="font-semibold">{currentMovie.imdbRating || '8.5'}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Calendar size={16} />
                <span>{currentMovie.Year}</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Clock size={16} />
                <span>Type: {currentMovie.Type}</span>
              </div>
              
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-8 max-w-full sm:max-w-xl">
              {currentMovie.Plot?.substring(0, window.innerWidth < 640 ? 150 : 300) || 'No description available'}{currentMovie.Plot?.length > (window.innerWidth < 640 ? 150 : 300) ? '...' : ''}
            </p>

            {/* Action Button */}
            <div>
              <button 
                onClick={() => navigate(`/movie/${currentMovie.imdbID}`, { state: { movie: currentMovie } })}
                className="view-btn bg-blue-600 bg-opacity-70 text-white px-4 py-2 sm:px-8 sm:py-4 rounded-lg font-bold text-sm sm:text-lg hover:bg-opacity-90 transition-colors duration-200"
              >
                View More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-6">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="bg-black bg-opacity-50 hover:bg-opacity-80 text-white p-2 rounded-full transition-all duration-200"
        >
          <ChevronLeft size={20} />
        </button>
        
        {/* Slide Indicators */}
        <div className="flex gap-3">
          {sliderMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-gray-500'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={nextSlide}
          className="bg-black bg-opacity-50 hover:bg-opacity-80 text-white p-2 rounded-full transition-all duration-200"
        >
          <ChevronRight size={20} />
        </button>
      </div>


      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-gray-800">
        <div 
          className="h-full bg-red-600 transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / sliderMovies.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default MovieSliderBanner;