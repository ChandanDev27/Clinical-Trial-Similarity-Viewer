import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchTrials, 
  toggleTrialSelection, 
  selectAllTrials,
  clearSelectedTrials,
  selectAllTrialsData,
  selectSelectedTrials
} from '../../features/trials/trialsSlice';
import TrialsTable from './TrialsTable';
import Pagination from '../../components/navigation/Pagination';
import ErrorBoundary from '../../components/feedback/ErrorBoundary';
import LoadingSpinner from '../../components/loading/LoadingSpinner';
import ErrorDisplay from '../../components/feedback/ErrorDisplay';
import Header from '../../components/layout/Header';
import ViewToggle from '../../components/navigation/ViewToggle';
import Button from '../../components/ui/Button';


const ListView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const trials = useSelector(selectAllTrialsData);
  console.log("ListView trials:", trials);
  const selectedTrials = useSelector(selectSelectedTrials);
  const loading = useSelector(state => state.trials.loading);
  const error = useSelector(state => state.trials.error);
  
  const totalItems = trials.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    dispatch(fetchTrials());
  }, [dispatch]);

  const handleTrialSelect = useCallback((trialId) => {
    dispatch(toggleTrialSelection(trialId));
  }, [dispatch]);

  const handleSelectAll = useCallback((isSelected) => {
    const allTrialIds = trials
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .map(trial => trial.nctId);
    dispatch(selectAllTrials(allTrialIds));
  }, [dispatch, trials, currentPage, itemsPerPage]);

  const handleClearSelections = useCallback(() => {
    dispatch(clearSelectedTrials());
  }, [dispatch]);

  const handleNavigateToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#f7f2fb]">
        <Header />

        <div className="p-5">
          <div className="bg-white rounded-t-xl p-6 border border-[#e9eaef]">
            <h1 className="text-[20px] font-semibold text-[#232323] mb-2">
              Clinical Trials List
            </h1>
            <p className="text-[14px] text-[#6d7194] mb-6">
              {selectedTrials.length} trial(s) selected
            </p>

            <div className="border-t border-[#e9eaef] pt-6 mb-6"></div>
            
            <div className="flex justify-between items-center mb-6">
              <ViewToggle 
                viewMode="list"
                onViewChange={handleNavigateToDashboard}
              />
              
              {selectedTrials.length > 0 && (
                <Button 
                  variant="secondary"
                  className="px-4 py-2 text-sm"
                  onClick={handleClearSelections}
                >
                  Clear Selections
                </Button>
              )}
            </div>

            <TrialsTable 
              trials={trials.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )}
              selectedTrials={selectedTrials}
              onTrialSelect={handleTrialSelect}
              onSelectAll={handleSelectAll}
            />
          
            <Pagination
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
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
