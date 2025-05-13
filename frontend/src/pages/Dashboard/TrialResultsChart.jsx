import React from 'react';
import Card from '../../components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const TrialResultsChart = ({ trials = [] }) => {
  // Define color scheme for the pie chart
  const COLORS = ['#652995', '#FF8042', '#FFBB28'];

  // Process the trial results data
  const processResultsData = () => {
    if (!trials || !Array.isArray(trials)) {
      console.error("Invalid trials data:", trials);
      return [];
    }

    const resultsCounts = {
      'Has result': 0,
      'No result': 0,
      'Others': 0,
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

    return Object.entries(resultsCounts).map(([name, value]) => ({ name, value }));
  };

  const resultsData = processResultsData();

  return (
    <Card className="p-5 relative">
      <h2 className="text-base font-medium text-[#6d7194] mb-4">Trial Results</h2>

      {/* Legend Section */}
      <div className="flex flex-wrap mb-4">
        <div className="flex items-center mr-8">
          <div className="w-2 h-2 rounded-full bg-[#652995] mr-2"></div>
          <span className="text-xs text-[#a5a7b1]">Has result</span>
        </div>
        <div className="flex items-center mr-8">
          <div className="w-2 h-2 rounded-full bg-[#FF8042] mr-2"></div>
          <span className="text-xs text-[#a5a7b1]">No result</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#FFBB28] mr-2"></div>
          <span className="text-xs text-[#a6a8b1]">Others</span>
        </div>
      </div>

      {/* Pie Chart with an Ellipse Overlay */}
      <div className="relative">
        {/* Ellipse Overlay */}
        <div className="absolute bg-[#f4f5fa] rounded-full opacity-50"
          style={{
            width: "205px",
            height: "205px",
            top: "68px",
            left: "57.5px",
            position: "absolute",
          }}
        ></div>

        {/* Donut Pie Chart */}
        <div className="absolute"
          style={{
            width: "172px",
            height: "172px",
            top: "85px",
            left: "74.5px",
            position: "absolute",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={resultsData}
                cx="50%"
                cy="50%"
                innerRadius={50}  // Creates the donut effect
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {resultsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} trials`, 'Count']} />
              <Legend 
                iconType="circle" 
                formatter={(value) => `${value} (${resultsData.find(d => d.name === value)?.value || 0})`} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

export default TrialResultsChart;
