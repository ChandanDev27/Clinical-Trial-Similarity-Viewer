import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrials, selectTrial, deselectTrial } from '../../features/trials/trialsSlice';
import ErrorBoundary from '../../components/feedback/ErrorBoundary';
import LoadingSpinner from '../../components/loading/LoadingSpinner';
import ErrorDisplay from '../../components/feedback/ErrorDisplay';
import Header from '../../components/layout/Header';
import TitleSection from '../../components/layout/TitleSection';
import Button from '../../components/ui/Button';
import ViewToggle from '../../components/navigation/ViewToggle';
import RegionalDistributionMap from './RegionalDistributionMap';
import EligibilityDistributionChart from './EligibilityDistributionChart';
import TrialsByPhaseChart from './TrialsByPhaseChart';
import TrialResultsChart from './TrialResultsChart';
import SponsorsChart from './SponsorsChart';
import { getEligibilityData } from '../../utils/dataUtils';
import useViewMode from '../../hooks/useViewMode';

const DashboardView = () => {
  const { viewMode, setViewMode, isDashboardView } = useViewMode();
  const dispatch = useDispatch();
  const { trials, selectedTrials, loading, error } = useSelector(state => state.trials);

  useEffect(() => {
    dispatch(fetchTrials());
  }, [dispatch]);

  // Memoized filter for selected trials
  const filteredTrials = useMemo(() => 
    (trials || []).filter(trial => selectedTrials.includes(trial.nctId)),
    [trials, selectedTrials]
  );

  // Memoized eligibility data calculation
  const eligibilityData = useMemo(() => getEligibilityData(trials), [trials]);

  // Extract trial IDs from selected trials
  const selectedTrialIds = useMemo(() => selectedTrials.map(trial => trial.nctId), [selectedTrials]);

  // Memoized trial selection handler
  const handleSelectTrial = useCallback((trialId) => {
    if (selectedTrials.includes(trialId)) {
      dispatch(deselectTrial(trialId));
    } else {
      dispatch(selectTrial(trialId));
    }
  }, [selectedTrials, dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error || 'Something went wrong'} />;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#f7f2fb]">
        <Header />
        <main className="p-5">
          <div className="max-w-[1312px] mx-auto">
            <div className="bg-white rounded-t-xl p-6 border border-[#e9eaef]">
              <h1 className="text-[20px] font-semibold text-[#232323] mb-2">
                Select Similar Trials
              </h1>
              <p className="text-[14px] text-[#6d7194] mb-6">
                {selectedTrials.length} trial(s) selected
              </p>
              <div className="border-t border-[#e9eaef] pt-6 mb-6"></div>

              <ViewToggle 
                viewMode={isDashboardView ? 'dashboard' : 'list'} 
                onViewChange={setViewMode}
                className="mb-8"
              />

              {isDashboardView ? (
                <div className="flex flex-col gap-6 w-full">

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white shadow-md rounded-lg border p-4 h-[337px]">
                      <TrialsByPhaseChart trials={filteredTrials} />
                    </div>
                    
                    <div className="bg-white shadow-md rounded-lg border p-4 h-[337px]">
                      <TrialResultsChart trials={filteredTrials} />
                    </div>

                    <div className="bg-white shadow-md rounded-lg border p-4 h-[337px]">
                      <RegionalDistributionMap trials={filteredTrials} />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-[360px] bg-white shadow-md rounded-lg border p-4 h-[400px]">
                      <SponsorsChart trials={filteredTrials} selectedTrials={selectedTrialIds} />
                    </div>

                    <div className="w-full md:w-[886px] bg-white shadow-md rounded-lg border p-4 h-[400px]">
                      <EligibilityDistributionChart data={eligibilityData} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {trials.map(trial => (
                    <div 
                      key={trial.nctId} 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedTrials.includes(trial.nctId)
                          ? 'border-[#652995] bg-[#f7f2fb]'
                          : 'border-[#e9eaef] hover:bg-[#f7f7f7]'
                      }`}
                      onClick={() => handleSelectTrial(trial.nctId)}
                    >
                      <h3 className="font-medium">{trial.title}</h3>
                      <p className="text-sm text-[#6d7194]">
                        Phase: {trial.phase} | Location: {trial.location}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-b-xl p-6 border-t-0 border border-[#e9eaef] flex justify-between">
              <Button 
                variant="secondary"
                className="px-6 py-2 text-sm"
                onClick={() => console.log('Back clicked')}
              >
                Back
              </Button>

              <Button 
                variant="primary"
                className="px-6 py-2 text-sm"
                onClick={() => console.log('Next clicked')}
              >
                Next
              </Button>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardView;
