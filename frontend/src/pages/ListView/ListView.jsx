import React, { useState, useEffect, useCallback } from 'react';
import TrialsTable from './TrialsTable';
import sponsorLogos from '../../sponsorLogos'; // Import sponsor logos

const ListView = () => {
  const [trials, setTrials] = useState([]);
  const [selectedTrials, setSelectedTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    const fetchTrials = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/trials?page=${currentPage}&limit=${itemsPerPage}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setTrials(data.trials || []); // Ensure fallback to empty array
        setError(null);
      } catch (err) {
        setError('Failed to fetch trials');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrials();
  }, [currentPage, itemsPerPage]);

  const handleViewChange = useCallback((view) => {
    setViewMode(view);
  }, []);

  const handleTrialSelect = useCallback((trialId) => {
    setSelectedTrials(prev => 
      prev.includes(trialId) 
        ? prev.filter(id => id !== trialId) 
        : [...prev, trialId]
    );
  }, []);

  const handleSelectAll = useCallback((isSelected) => {
    setSelectedTrials(isSelected ? trials.map(trial => trial.id) : []);
  }, [trials]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  if (loading) return <div className="min-h-screen bg-[#f7f2fb] flex items-center justify-center"><div className="text-[#652995]">Loading trials...</div></div>;
  if (error) return <div className="min-h-screen bg-[#f7f2fb] flex items-center justify-center"><div className="text-red-500">{error}</div></div>;

  return (
    <div className="min-h-screen bg-[#f7f2fb]">
      <div className="py-3 px-5 bg-white border-b border-[#e9eaef]">
        <p className="text-[16px] font-normal text-[#6d7194]">My Trials</p>
      </div>
      
      <div className="p-5">
        <div className="bg-white rounded-t-xl p-6 border border-[#e9eaef]">
          <h1 className="text-[20px] font-semibold text-[#232323] mb-2">Select Similar Trials</h1>
          <p className="text-[14px] text-[#6d7194] mb-6">Select the trials based on their Similarity Score</p>
          
          <div className="border-t border-[#e9eaef] pt-6 mb-6"></div>
          
          <div className="flex gap-4 mb-6">
            <button 
              className={`flex items-center px-3 py-2 rounded-lg border ${viewMode === 'list' ? 'border-[#652995] text-[#652995] font-semibold' : 'border-[#e9eaef] text-[#232323] font-medium'}`}
              onClick={() => handleViewChange('list')}
            >
              <img src="/images/img_tablerlayoutlist.svg" alt="List view" className="w-5 h-5 mr-2" />
              <span className="text-xs">List view</span>
            </button>
            
            <button 
              className={`flex items-center px-3 py-2 rounded-lg border ${viewMode === 'dashboard' ? 'border-[#652995] text-[#652995] font-semibold' : 'border-[#e9eaef] text-[#232323] font-medium'}`}
              onClick={() => handleViewChange('dashboard')}
            >
              <img src="/images/img_hugeicon.svg" alt="Dashboard view" className="w-5 h-5 mr-2" />
              <span className="text-xs">Dashboard view</span>
            </button>
          </div>
          
          <TrialsTable 
            trials={trials}
            selectedTrials={selectedTrials}
            onTrialSelect={handleTrialSelect}
            onSelectAll={handleSelectAll}
          />
          
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center">
              <div className="relative">
                <div className="flex items-center bg-[#5e636614] rounded-lg px-3 py-1">
                  <span className="text-xs text-[#232323] mr-2">{itemsPerPage}</span>
                  <img src="/images/img_fichevrondown.svg" alt="Dropdown" className="w-4 h-4" />
                </div>
                <div className="ml-4 text-sm text-[#232323]">Items per page</div>
              </div>
              <div className="ml-6 text-sm text-[#232323]">{`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, trials.length)} of ${trials.length} items`}</div>
            </div>
            
            <div className="flex items-center">
              <div className="relative">
                <div className="flex items-center bg-[#5e636614] rounded-lg px-3 py-1">
                  <span className="text-xs text-[#232323] mr-2">{currentPage}</span>
                  <img src="/images/img_fichevrondown.svg" alt="Dropdown" className="w-4 h-4" />
                </div>
                <div className="ml-2 text-sm text-[#232323]">{`of ${Math.ceil(trials.length / itemsPerPage)} pages`}</div>
              </div>
              <div className="flex ml-4">
                <button className="p-1 disabled:opacity-50" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                  <img src="/images/img_actions_arrowdown.svg" alt="Previous" className="w-4 h-4 transform rotate-90" />
                </button>
                <button className="p-1 disabled:opacity-50" disabled={currentPage >= Math.ceil(trials.length / itemsPerPage)} onClick={() => handlePageChange(currentPage + 1)}>
                  <img src="/images/img_actions_arrowdown_16x16.svg" alt="Next" className="w-4 h-4 transform -rotate-90" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListView;
