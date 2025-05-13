import React, { useMemo } from 'react';
import Card from '../../components/ui/Card';

const TrialsByPhaseChart = ({ trials = [] }) => {
  const { phaseData, maxCount } = useMemo(() => {
    const phaseCounts = {
      'Phase 1': 0,
      'Phase 2': 0,
      'Phase 3': 0,
      'Phase 4': 0,
    };

    trials.forEach(trial => {
      if (!trial.phases || !trial.phases.length) return;

      trial.phases.forEach(phase => {
        const phaseKey = `Phase ${phase.replace('PHASE', '').trim()}`;
        if (phaseCounts.hasOwnProperty(phaseKey)) {
          phaseCounts[phaseKey]++;
        }
      });
    });

    const filteredPhases = Object.entries(phaseCounts)
      .filter(([_, count]) => count > 0)
      .map(([phase, count]) => ({ phase, count }));

    const maxValue = Math.max(...filteredPhases.map(item => item.count), 0);

    return {
      phaseData: filteredPhases,
      maxCount: maxValue
    };
  }, [trials]);

  if (phaseData.length === 0) {
    return (
      <Card className="p-5">
        <h2 className="text-base font-medium text-[#6d7194] mb-4">Trials by Phase</h2>
        <div className="text-sm text-[#6d7194]">No phase data available for selected trials</div>
      </Card>
    );
  }

  const maxBarHeight = 178;
  const chartData = phaseData.map(item => ({
    ...item,
    barHeight: maxCount > 0 ? Math.round((item.count / maxCount) * maxBarHeight) : 0
  }));

  return (
    <Card className="p-5">
      <h2 className="text-base font-medium text-[#6d7194] mb-4">Trials by Phase</h2>

      <div className="relative h-[220px] mb-4">
        {maxCount > 0 && (
          <>
            <div className="absolute -left-1 top-0 text-xs text-[#6d7194]">
              {maxCount.toLocaleString()}
            </div>
            <div className="absolute -left-1 bottom-0 text-xs text-[#6d7194]">0</div>
          </>
        )}

        <div className="flex justify-between items-end h-full pl-8">
          {chartData.map((item, index) => (
            <div key={index} className="flex flex-col items-center" style={{ width: `${90/chartData.length}%` }}>
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
    </Card>
  );
};

export default TrialsByPhaseChart;
