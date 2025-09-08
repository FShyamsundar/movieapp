import { useEffect, useState } from 'react'
import React from 'react'

const useFetch = (apiPath, queryTerm = "") => {
    const [data, setData] = useState([]);
    const key = import.meta.env.VITE_API_KEY;
    
    useEffect(() => {
        if (!apiPath || !key) return;
        
        const baseUrl = `https://cors-anywhere.herokuapp.com/https://api.themoviedb.org/3/${apiPath}?api_key=${key}`;
        const url = queryTerm ? `${baseUrl}&query=${queryTerm}` : baseUrl;
        
        async function fetchmovies() {
            try {
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                setData(result.results || []);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setData([]);
            }
        }
        
        fetchmovies();
    }, [apiPath, queryTerm, key]);
  return {data}
};

export default useFetch;
