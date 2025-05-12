import { useState, useEffect } from 'react';

export const useTrialsData = (initialPage = 1, initialItemsPerPage = 8) => {
  const [state, setState] = useState({
    trials: [],
    selectedTrials: [],
    loading: true,
    error: null,
    currentPage: initialPage,
    itemsPerPage: initialItemsPerPage,
    totalPages: 1
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({...prev, loading: true}));
        const [trialsRes, selectionsRes] = await Promise.all([
          fetch(`/api/trials?page=${state.currentPage}&limit=${state.itemsPerPage}`),
          fetch('/api/trials/selections')
        ]);
        
      } catch (error) {
        setState(prev => ({...prev, error: error.message}));
      } finally {
        setState(prev => ({...prev, loading: false}));
      }
    };
    
    fetchData();
  }, [state.currentPage, state.itemsPerPage]);

  return {...state, setCurrentPage, setItemsPerPage};
};