import React from "react";
import Card from "../../components/ui/Card";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TrialResultsChart = ({ data = [] }) => {
  const chartData = {
    labels: data.map(item => item.result),
    datasets: [{
      data: data.map(item => item.count),
      backgroundColor: ['#652995', '#FF8042', '#FFBB28']
    }]
  };

  return (
    <Card className="p-5">
      <h2 className="text-base font-medium text-[#6d7194] mb-4">Trial Results</h2>

      <div className="flex flex-wrap mb-4">
        {/* Has result */}
        <div className="flex items-center mr-[80px]">
          <div className="w-2 h-2 rounded-full bg-[#652995] mr-2"></div>
          <span className="text-xs text-[#a5a7b1]">Has result</span>
        </div>

        {/* No result */}
        <div className="flex items-center mr-[80px]">
          <div className="w-2 h-2 rounded-full bg-[#FF8042] mr-2"></div>
          <span className="text-xs text-[#a5a7b1]">No result</span>
        </div>

        {/* Others */}
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#FFBB28] mr-2"></div>
          <span className="text-xs text-[#a5a7b1]">Others</span>
        </div>
      </div>

      {/* Donut Chart */}
      <div
        className="flex justify-center items-center"
        style={{
          width: "152px",
          height: "152px",
        }}
      >
        <Doughnut
          data={chartData}
          options={{
            cutout: "70%",
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) =>
                    `${tooltipItem.label}: ${tooltipItem.raw} trials`,
                },
              },
            },
          }}
        />
      </div>
    </Card>
  );
};

export default TrialResultsChart;
