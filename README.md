# Movie Hub 🎬

A modern, responsive movie discovery application built with React and Vite, powered by The Open Movie Database (OMDB) API.

## Features

- **Movie Discovery**: Browse popular, top-rated, and upcoming movies
- **Search Functionality**: Search movies by title with real-time results
- **Advanced Filtering**: Filter movies by genre, year, and rating
- **Favorites System**: Add/remove movies to/from favorites with persistent storage
- **Movie Details**: View detailed information including runtime, ratings, and overview
- **User Ratings**: Rate movies and save your ratings locally
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Slider**: Featured movie carousel on homepage

## Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS, Custom CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Slider**: Swiper.js
- **API**: The Open Movie Database (OMDB) API
- **Storage**: Local Storage for favorites and ratings

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movieapp
```

2. Install dependencies:
```bash
npm install
```

3. Get your free OMDB API key from [OMDB API](http://www.omdbapi.com/apikey.aspx)

4. Update the API key in `Hooks/useFetch.jsx` file

5. Start the development server:
```bash
npm run dev
```

## Usage

- **Browse Movies**: Use category tabs to switch between Popular, Top Rated, and Upcoming movies
- **Search**: Enter movie titles in the search bar
- **Filter**: Use the filter dropdown to narrow results by genre, year, or rating
- **Favorites**: Click the heart icon to add movies to favorites
- **Movie Details**: Click on any movie card to view detailed information
- **Rate Movies**: Give movies a 1-5 star rating on the details page

## Project Structure

```
src/
├── components/
│   ├── Card.jsx          # Movie card component
│   ├── Header.jsx        # Navigation header with search/filter
│   ├── Footer.jsx        # Footer component
│   └── Slider.jsx        # Movie carousel slider
├── pages/
│   ├── MovieList.jsx     # Main movie listing page
│   └── MovieDetails.jsx  # Individual movie details page
├── Hooks/
│   └── useFetch.jsx      # Custom hook for API calls
├── App.jsx               # Main application component
├── App.css               # Custom styles
├── index.css             # Global styles
└── main.jsx              # Application entry point
```

## API Integration

This project uses The Open Movie Database (OMDB) API. You'll need to:

1. Get your free API key at [OMDB API](http://www.omdbapi.com/apikey.aspx)
2. Replace the API key in `Hooks/useFetch.jsx` file

## Build

To build the project for production:

```bash
npm run build
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Acknowledgments

- [The Open Movie Database (OMDB)](http://www.omdbapi.com/) for providing the movie data API
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide React](https://lucide.dev/) for the beautiful icons