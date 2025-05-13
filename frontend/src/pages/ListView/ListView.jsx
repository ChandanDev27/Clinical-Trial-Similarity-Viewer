import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TrialsTable from './TrialsTable';
import Pagination from '../../components/navigation/Pagination';
import useTrials from '../../hooks/useTrials';
import useSelections from '../../hooks/useSelections';
import ErrorBoundary from '../../components/feedback/ErrorBoundary';
import LoadingSpinner from '../../components/loading/LoadingSpinner';
import ErrorDisplay from '../../components/feedback/ErrorDisplay';
import Header from '../../components/layout/Header';
import TitleSection from '../../components/layout/TitleSection';
import ViewToggle from '../../components/navigation/ViewToggle';

const ListView = () => {
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  
  const { trials, loading, error, totalPages, totalItems } = useTrials(currentPage, itemsPerPage);
  const { selectedTrials, saveSelections, fetchSelections } = useSelections();

  const navigate = useNavigate();

  // Changed handleViewChange to navigate based on the view choice
  const handleViewChange = useCallback((view) => {
    navigate(view === 'list' ? '/listview' : '/dashboard');
  }, [navigate]);

  const handleTrialSelect = useCallback(async (trialId) => {
  const newSelections = selectedTrials.includes(trialId)
    ? selectedTrials.filter(id => id !== trialId)
    : [...selectedTrials, trialId];

  await saveSelections(newSelections);
  await fetchSelections();
}, [selectedTrials, saveSelections, fetchSelections]);


  const handleSelectAll = useCallback((isSelected) => {
    const newSelections = isSelected ? trials.map(trial => trial.nctId) : [];
    saveSelections(newSelections);
  }, [trials, saveSelections]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#f7f2fb]">
        <Header />

        <div className="p-5">
          <div className="bg-white rounded-t-xl p-6 border border-[#e9eaef]">
            <TitleSection />

            <div className="border-t border-[#e9eaef] pt-6 mb-6"></div>
            
            {/* Using the updated ViewToggle which calls handleViewChange to navigate */}
            <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />
            
            <TrialsTable 
              trials={trials}
              selectedTrials={selectedTrials}
              onTrialSelect={handleTrialSelect}
              onSelectAll={handleSelectAll}
            />
          
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onItemsPerPageChange={setItemsPerPage}
              className="mt-6"
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ListView;
