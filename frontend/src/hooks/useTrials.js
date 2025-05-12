import { useState, useEffect } from 'react';

export const useTrials = (page, itemsPerPage) => {
  const [state, setState] = useState({
    trials: [],
    loading: true,
    error: null,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    const fetchTrials = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        const response = await fetch(`/api/trials?page=${page}&limit=${itemsPerPage}`);
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        if (data.success) {
          setState({
            trials: data.data || [],
            totalPages: data.meta.totalPages,
            totalItems: data.meta.total,
            loading: false,
            error: null
          });
        } else {
          throw new Error(data.message || 'Failed to fetch trials');
        }
      } catch (err) {
        setState(prev => ({ ...prev, error: err.message, loading: false }));
      }
    };

    fetchTrials();
  }, [page, itemsPerPage]);

  return state;
};

export default useTrials;
