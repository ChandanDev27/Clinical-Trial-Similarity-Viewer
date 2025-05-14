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
import { 
  getEligibilityData,
  processSponsorsData,
  processPhaseData,
  processResultsData,
  processRegionalData
} from '../../utils/dataUtils'; // Import all processing functions
import useViewMode from '../../hooks/useViewMode';

const DashboardView = () => {
  const { viewMode, setViewMode, isDashboardView } = useViewMode();
  const dispatch = useDispatch();
  const { trials, selectedTrials, loading, error } = useSelector(state => state.trials);
  
  // Memoized filter for selected trials
  const filteredTrials = useMemo(() => 
  (trials || []).filter(trial => 
    (selectedTrials || []).includes(trial.nctId)
  ),
  [trials, selectedTrials]
);

  const processedData = useMemo(() => ({
  eligibility: getEligibilityData(trials),
  sponsors: processSponsorsData(trials || [], selectedTrials || []),
  phases: processPhaseData(filteredTrials || []),
  results: processResultsData(filteredTrials || []),
  regional: processRegionalData(filteredTrials || [])
}), [trials, selectedTrials, filteredTrials]);

  useEffect(() => {
    dispatch(fetchTrials());
  }, [dispatch]);

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
          <div className="h-[337px]">
            <TrialsByPhaseChart data={processedData.phases} />
          </div>
          <div className="h-[337px]">
            <TrialResultsChart data={processedData.results} />
          </div>
          <div className="h-[337px]">
            <RegionalDistributionMap data={processedData.regional} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2 h-[400px]">
            <SponsorsChart data={processedData.sponsors || []} />
          </div>
          <div className="md:col-span-3 h-[400px]">
            <EligibilityDistributionChart data={processedData.eligibility} />
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
