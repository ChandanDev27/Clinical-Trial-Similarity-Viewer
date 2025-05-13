import { useState, useCallback } from 'react';

export const useSelections = () => {
  const [state, setState] = useState({
    selectedTrials: [],
    loading: false,
    error: null
  });

  const fetchSelections = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch('http://localhost:5000/api/trials/selections');
      if (!response.ok) throw new Error('Failed to fetch selections');

      const data = await response.json();
      setState({
        selectedTrials: data.trials || [],
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Error fetching selections:', err);
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }, []);

  const saveSelections = useCallback(async (selections) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const response = await fetch('http://localhost:5000/api/trials/selections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trialIds: selections }) // Ensure payload matches backend expectations
      });

      if (!response.ok) throw new Error('Failed to save selections');

      setState(prev => ({ ...prev, selectedTrials: selections, loading: false }));
    } catch (err) {
      console.error('Error saving selections:', err);
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }, []);

  return { ...state, fetchSelections, saveSelections };
};

export default useSelections;
