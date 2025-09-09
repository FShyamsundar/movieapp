import { useEffect, useState } from 'react'

const useFetch = (searchType, queryTerm = "") => {
    const [data, setData] = useState([]);
    const key = "e1a284f5";
    
    useEffect(() => {
        async function fetchMovies() {
            try {
                let url;
                if (queryTerm) {
                    url = `https://www.omdbapi.com/?apikey=${key}&s=${queryTerm}&type=movie`;
                } else {
                    const searchTerms = {
                        'popular': 'action',
                        'top': 'classic', 
                        'new': '2025'
                    };
                    const searchTerm = searchTerms[searchType] || 'movie';
                    url = `https://www.omdbapi.com/?apikey=${key}&s=${searchTerm}&type=movie`;
                }
                
                const response = await fetch(url);
                const result = await response.json();
                
                if (result.Response === 'True') {
                    setData(result.Search || []);
                } else {
                    setData([]);
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
                setData([]);
            }
        }
        
        fetchMovies();
    }, [searchType, queryTerm]);
    
    return { data };
};

export default useFetch;
