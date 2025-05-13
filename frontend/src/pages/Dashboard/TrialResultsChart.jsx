import React from 'react';
import Card from '../../components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const TrialResultsChart = ({ trials }) => {
  // Color scheme for the chart
  const COLORS = ['#652995', '#FF8042', '#FFBB28'];
  
  // Process the trial data to get results distribution
  const processResultsData = () => {
    const resultsCounts = {
      'Has result': 0,
      'No result': 0,
      'Others': 0
    };

    trials.forEach(trial => {
      if (trial.hasResults === true) {
        resultsCounts['Has result']++;
      } else if (trial.hasResults === false) {
        resultsCounts['No result']++;
      } else {
        resultsCounts['Others']++;
      }
    });

    return Object.entries(resultsCounts).map(([name, value]) => ({
      name,
      value
    }));
  };

  const resultsData = processResultsData();

  return (
    <Card className="p-5">
      <h2 className="text-base font-medium text-[#6d7194] mb-4">Trial Results</h2>
      
      <div className="flex flex-wrap mb-4">
        <div className="flex items-center mr-8">
          <div className="indicator-dot bg-[#652995]"></div>
          <span className="text-xs text-[#a5a7b1]">Has result</span>
        </div>
        <div className="flex items-center mr-8">
          <div className="indicator-dot bg-[#38e0ae]"></div>
          <span className="text-xs text-[#a5a7b1]">No result</span>
        </div>
        <div className="flex items-center">
          <div className="indicator-dot bg-[#fed3a6]"></div>
          <span className="text-xs text-[#a6a8b1]">Others</span>
        </div>
      </div>
      
      <div className="h-[205px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={resultsData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {resultsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} trials`, 'Count']}
            />
            <Legend 
              iconType="circle"
              formatter={(value) => `${value} (${resultsData.find(d => d.name === value)?.value || 0})`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TrialResultsChart;