import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrials, selectFilteredTrials, selectSelectedTrials } from '../../features/trials/trialsSlice';
import { selectTrialsLoading, selectTrialsError } from '../../features/trials/trialsSlice';
import ErrorBoundary from '../../components/feedback/ErrorBoundary';
import LoadingSpinner from '../../components/loading/LoadingSpinner';
import ErrorDisplay from '../../components/feedback/ErrorDisplay';
import Header from '../../components/layout/Header';
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
} from '../../utils/dataUtils';
import { useNavigate } from 'react-router-dom';

const DashboardView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectTrialsLoading);
  const error = useSelector(selectTrialsError);
  const filteredTrials = useSelector(selectFilteredTrials);
  console.log("Filtered trials:", filteredTrials);
  const selectedTrials = useSelector(selectSelectedTrials);

  useEffect(() => {
    dispatch(fetchTrials());
  }, [dispatch]);

  const processedData = useMemo(() => ({
    eligibility: getEligibilityData(filteredTrials),
    sponsors: processSponsorsData(filteredTrials, selectedTrials),
    phases: processPhaseData(filteredTrials),
    results: processResultsData(filteredTrials),
    regional: processRegionalData(filteredTrials)
  }), [filteredTrials, selectedTrials]);

  const handleNavigateToList = () => {
    navigate('/listview');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#f7f2fb]">
        <Header />
        <main className="p-5">
          <div className="max-w-[1312px] mx-auto">
            <div className="bg-white rounded-t-xl p-6 border border-[#e9eaef]">
              <h1 className="text-[20px] font-semibold text-[#232323] mb-2">
                Clinical Trials Dashboard
              </h1>
              <p className="text-[14px] text-[#6d7194] mb-6">
                {selectedTrials.length > 0 
                  ? `${selectedTrials.length} trial(s) selected`
                  : "Showing all trials (select trials in List View to filter)"}
              </p>
              
              <div className="border-t border-[#e9eaef] pt-6 mb-6"></div>

              <ViewToggle 
                viewMode="dashboard"
                onViewChange={handleNavigateToList}
              />

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
                    <SponsorsChart data={processedData.sponsors} />
                  </div>
                  <div className="md:col-span-3 h-[400px]">
                    <EligibilityDistributionChart data={processedData.eligibility} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-b-xl p-6 border-t-0 border border-[#e9eaef] flex justify-between">
              <Button 
                variant="secondary"
                className="px-6 py-2 text-sm"
                onClick={handleNavigateToList}
              >
                Back to List View
              </Button>
            </div>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardView;
