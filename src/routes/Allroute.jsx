import {  Route, Routes } from "react-router-dom";
import { MovieDetails, MovieList, PageNotFound, Search } from "../pages";

const Allroute = () => {
    return(


    
    <>
    
   <Routes>
  <Route path="/" element={<MovieList apiPath="movie/now_playing" />} />
  <Route path="/popular-movies" element={<MovieList title="Popular movies" apiPath="movie/popular" />} />
  <Route path="/top-rated" element={<MovieList title="Top Rated" apiPath="movie/top_rated"  />} />
  <Route path="/upcoming" element={<MovieList title="Upcoming Movies" apiPath="movie/upcoming" />} />
  <Route path="/movie/:id" element={<MovieDetails />} />
  
</Routes>

    
    
    </>
    );
    
};

export default Allroute;