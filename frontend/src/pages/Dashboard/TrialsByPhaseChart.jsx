import React from 'react';
import Card from '../../components/ui/Card';

const TrialsByPhaseChart = ({ trials }) => {
  // Handle loading/error states
  if (trials === undefined) {
    return <Card className="p-5"><div>Loading trial data...</div></Card>;
  }
  
  if (trials === null) {
    return <Card className="p-5"><div>Error loading trial data</div></Card>;
  }

  // Process the trial data to get phase distribution counts
  const processPhaseData = (trialsData) => {
    if (!Array.isArray(trialsData)) {
      return [];
    }

    const phaseCounts = {
      'Phase 1': 0,
      'Phase 2': 0,
      'Phase 3': 0,
      'Phase 4': 0
    };

    trialsData.forEach(trial => {
      const phase = trial.phase || '';
      if (phase.includes('1')) phaseCounts['Phase 1']++;
      if (phase.includes('2')) phaseCounts['Phase 2']++;
      if (phase.includes('3')) phaseCounts['Phase 3']++;
      if (phase.includes('4')) phaseCounts['Phase 4']++;
    });

    // Calculate maximum count for scaling
    const maxCount = Math.max(...Object.values(phaseCounts));
    const maxBarHeight = 178; // Maximum height in pixels for the tallest bar

    return Object.entries(phaseCounts).map(([phase, count]) => ({
      phase,
      count,
      barHeight: maxCount > 0 ? Math.round((count / maxCount) * maxBarHeight) : 0
    }));
  };

  const phaseData = processPhaseData(trials || []);

  return (
    <Card className="p-5">
      <h2 className="text-base font-medium text-[#6d7194] mb-4">Trials by Phase</h2>
      
      <div className="flex items-center mb-4">
        <div className="flex items-center mr-8">
          <div className="indicator-dot bg-[#fed3a6]"></div>
          <span className="text-xs text-[#a5a7b1]">Trials</span>
        </div>
        <div className="flex items-center">
          <div className="indicator-dot bg-[#f4f5fa]"></div>
          <span className="text-xs text-[#a5a7b1]">--</span>
        </div>
      </div>
      
      <div className="relative h-[220px] mb-4">
        {/* Y-axis labels */}
        {phaseData.some(item => item.count > 0) && (
          <>
            <div className="absolute -left-1 top-0 text-xs text-[#6d7194]">
              {Math.max(...phaseData.map(item => item.count)).toLocaleString()}
            </div>
            <div className="absolute -left-1 top-1/4 text-xs text-[#6d7194] text-right">
              {Math.round(Math.max(...phaseData.map(item => item.count)) * 0.75).toLocaleString()}
            </div>
            <div className="absolute -left-1 top-2/4 text-xs text-[#6d7194] text-right">
              {Math.round(Math.max(...phaseData.map(item => item.count)) * 0.5).toLocaleString()}
            </div>
            <div className="absolute -left-1 top-3/4 text-xs text-[#6d7194] text-right">
              {Math.round(Math.max(...phaseData.map(item => item.count)) * 0.25).toLocaleString()}
            </div>
          </>
        )}
        <div className="absolute -left-1 bottom-0 text-xs text-[#6d7194] text-right">0</div>
        
        {/* Chart bars */}
        <div className="flex justify-between items-end h-full pl-8">
          {phaseData.map((item, index) => (
            <div key={index} className="flex flex-col items-center w-1/4">
              <div className="w-full bg-[#f4f5fa] rounded-md relative" style={{ height: '178px' }}>
                <div 
                  className="absolute bottom-0 left-0 bg-[#fed3a6] w-full rounded-md" 
                  style={{ height: `${item.barHeight}px` }}
                ></div>
              </div>
              <div className="mt-2 text-xs text-[#6d7194]">{item.count.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between pl-8 mt-4">
        {phaseData.map((item, index) => (
          <div key={index} className="text-xs text-[#6d7194] text-center w-1/4">
            {item.phase}
          </div>
        ))}
      </div>
    </Card>
  );
};

TrialsByPhaseChart.defaultProps = {
  trials: []
};

export default TrialsByPhaseChart;
