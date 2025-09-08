import "./App.css";
import { Header } from "./components/header";
import { Routes, Route, useLocation } from "react-router-dom";
import { MovieList } from "./pages/MovieList";
import { MovieDetails } from "./pages/MovieDetails";
import { Footer } from "./components/Footer";
import { useState } from "react";

function App() {
  const location = useLocation();
  const isMovieDetailsPage = location.pathname.startsWith('/movie/');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [showFavorites, setShowFavorites] = useState(false);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (filterData) => {
    setFilters(filterData);
  };

  const handleShowFavorites = () => {
    setShowFavorites(true);
    setSearchTerm('');
    setFilters({});
  };

  return (
    <>

    <div className="first-page">

      {!isMovieDetailsPage && <Header onSearch={handleSearch} onFilter={handleFilter} onShowFavorites={handleShowFavorites} />}
    </div>
      
      <Routes>
        <Route path="/" element={<MovieList title="Home" apiPath="movie/now_playing" searchTerm={searchTerm} filters={filters} showFavorites={showFavorites} setShowFavorites={setShowFavorites} />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
      {!isMovieDetailsPage && <Footer/>}
      
    </>
  );
}

export default App;
