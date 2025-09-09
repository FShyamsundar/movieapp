import { useEffect, useState, useCallback } from 'react'

const SEARCH_TERMS = {
    'popular': 'action',
    'top': 'classic', 
    'new': '2025'
};

const useFetch = (searchType, queryTerm = "") => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const key = "e1a284f5";
    
    const fetchMovies = useCallback(async () => {
        if (loading) return;
        
        setLoading(true);
        setError(null);
        
        try {
            let url;
            if (queryTerm) {
                url = `https://www.omdbapi.com/?apikey=${key}&s=${queryTerm}&type=movie`;
            } else {
                const searchTerm = SEARCH_TERMS[searchType] || 'movie';
                url = `https://www.omdbapi.com/?apikey=${key}&s=${searchTerm}&type=movie`;
            }
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.Response === 'True') {
                setData(result.Search || []);
            } else {
                setData([]);
                setError(result.Error || 'No movies found');
            }
        } catch (error) {
            setError(error.message || 'Failed to fetch movies');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [searchType, queryTerm, loading, key]);
    
    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);
    
    return { data, loading, error };
};

export default useFetch;