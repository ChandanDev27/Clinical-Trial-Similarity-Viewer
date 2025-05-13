import { useState } from 'react';

const useViewMode = (initialMode = 'dashboard') => {
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('viewMode') || initialMode;
    } catch {
      return initialMode;
    }
  });
  
  const toggleViewMode = () => {
    setViewMode(prev => {
      const newMode = prev === 'dashboard' ? 'list' : 'dashboard';
      localStorage.setItem('viewMode', newMode);
      return newMode;
    });
  };

  return {
    viewMode,
    setViewMode,
    toggleViewMode,
    isDashboardView: viewMode === 'dashboard',
    isListView: viewMode === 'list'
  };
};

export default useViewMode;
