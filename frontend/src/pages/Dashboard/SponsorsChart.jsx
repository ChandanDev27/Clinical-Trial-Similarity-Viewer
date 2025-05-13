import React, { useMemo } from 'react';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/loading/LoadingSpinner';
import ErrorDisplay from '../../components/feedback/ErrorDisplay';
import sponsorLogos from '../../sponsorLogos';

const SponsorsChart = ({ trials, selectedTrials }) => {
  // Process sponsors directly without useEffect
  const sponsorsData = useMemo(() => {
  const sponsorsMap = new Map();

  // Filter trials based on selection
  const relevantTrials = selectedTrials?.length
    ? trials.filter(trial => selectedTrials.includes(trial.nctId))
    : trials;

  relevantTrials.forEach(trial => {
    const sponsorName = trial.sponsor || "Unknown";
    sponsorsMap.set(sponsorName, (sponsorsMap.get(sponsorName) || 0) + 1);
  });

  return Array.from(sponsorsMap.entries()).map(([name, count]) => ({
    name,
    count,
    logo: sponsorLogos[name] || sponsorLogos["default"], // Ensure fallback logo
  }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 4); // Show top 4 sponsors
}, [trials, selectedTrials]);

  const maxCount = Math.max(...sponsorsData.map(s => s.count), 1);

  const calculateBarWidth = (count) => {
    const maxBarWidth = 240; 
    return (count / maxCount) * maxBarWidth;
  };

  return (
    <Card className="p-5">
      <h2 className="text-base font-medium text-[#6d7194] mb-4">Top Sponsors</h2>
      <div className="flex items-center mb-4">
        <div className="indicator-dot bg-[#652995]"></div>
        <span className="text-xs text-[#a5a7b1]">Trial Count</span>
      </div>
      <div className="space-y-12">
        {sponsorsData.map((sponsor) => (
          <div key={sponsor.name} className="flex items-center">
            <img 
              src={sponsor.logo} 
              alt={sponsor.name} 
              className="w-8 h-8 object-contain mr-4" 
              onError={(e) => {
                e.target.src = '/images/default-sponsor.png';
              }}
            />
            <div className="flex-1 relative h-3">
              <div 
                className="absolute left-0 top-0 h-full bg-[#652995] rounded-md" 
                style={{ width: `${calculateBarWidth(sponsor.count)}px` }}
              ></div>
            </div>
            <span className="ml-4 text-sm font-medium text-[#6d7194] min-w-[30px] text-right">
              {sponsor.count}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SponsorsChart;
