import React, { useState } from 'react';
import { Star, Heart, Calendar, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export const Card = ({ movie }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  if (!movie) return null;

  const handleViewMore = () => {
    navigate(`/movie/${movie.imdbID}`, { state: { movie } });
  };
  return (
    <div className="w-full">
      <div 
      className="relative bg-white rounded-xl shadow-lg overflow-hidden w-full h-64 sm:h-80 md:h-96 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <div className="relative w-full h-full ">
        <img 
          src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'}
          alt={movie.Title}
          className="w-full h-full object-cover"
        />
        
        {/* Rating Badge - Top Left */}
        <div className="rating absolute top-2 left-2 sm:top-3 sm:left-3 bg-yellow-500 text-white px-2 py-1 sm:px-3 rounded-full flex items-center gap-1 font-bold text-xs sm:text-sm shadow-lg min-w-fit">
          <Star size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" fill="currentColor" />
          <span className="whitespace-nowrap">{movie.imdbRating || '8.5'}</span>
        </div>
        {/* Hover Overlay with Movie Details */}
        <div className={`absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center p-2 sm:p-4 transition-all duration-300 ${isHovered ? 'opacity-80' : 'opacity-0'}`}>
          <div className="text-white text-center max-w-full">
            {/* Movie Title */}
            <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2 text-white truncate">{movie.Title}</h3>
            
            {/* Movie Info */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs text-gray-300 mb-1 sm:mb-2">
              <div className="flex items-center gap-1">
                <Calendar size={10} className="sm:w-3 sm:h-3" />
                <span>{movie.Year}</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={10} className="sm:w-3 sm:h-3" />
                <span>{movie.Type}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-xs leading-relaxed mb-2 sm:mb-3 line-clamp-2 sm:line-clamp-3">
              {movie.Plot?.substring(0, 80) || 'No description available'}...
            </p>

            {/* View More Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleViewMore();
                
              }}
              className=" view-btn bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 sm:py-3 sm:px-8 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap min-w-fit"
            >
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}








