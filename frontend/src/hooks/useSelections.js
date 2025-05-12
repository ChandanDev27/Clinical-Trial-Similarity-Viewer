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
      const response = await fetch('/api/trials/selections');
      const data = await response.json();
      setState({
        selectedTrials: data.data || [],
        loading: false,
        error: null
      });
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }, []);

  const saveSelections = useCallback(async (selections) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      await fetch('/api/trials/selections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selections)
      });
      setState(prev => ({ ...prev, selectedTrials: selections, loading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }, []);

  return { ...state, fetchSelections, saveSelections };
};

export default useSelections;
