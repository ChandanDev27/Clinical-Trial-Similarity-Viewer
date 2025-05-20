import React from "react";
import PropTypes from "prop-types";
import Card from "../../components/ui/Card";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TrialResultsChart = ({ data = [] }) => {
  const chartData = {
    labels: data.map(item => item.result),
    datasets: [{
      data: data.map(item => item.count),
      backgroundColor: ['#652995', '#FF8042', '#FFBB28'],
      borderWidth: 0
    }]
  };

  const DONUT_SIZE = 172;
  const ELLIPSE_SIZE = 180;
  const CUTOUT_SIZE = ELLIPSE_SIZE * 0.4;
  const MARGIN = (ELLIPSE_SIZE - DONUT_SIZE) / 2;

  return (
    <Card className="p-5 flex flex-col items-center">
      <h2 className="text-base font-medium text-[#6d7194] mb-4">Trial Results</h2>

      <div className="flex flex-wrap justify-center mb-4 w-full">
        <div className="flex items-center mr-[80px]">
          <div className="w-2 h-2 rounded-full bg-[#652995] mr-2"></div>
          <span className="text-xs text-[#a5a7b1]">Has result</span>
        </div>
        <div className="flex items-center mr-[80px]">
          <div className="w-2 h-2 rounded-full bg-[#FF8042] mr-2"></div>
          <span className="text-xs text-[#a5a7b1]">No result</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#FFBB28] mr-2"></div>
          <span className="text-xs text-[#a5a7b1]">Others</span>
        </div>
      </div>

      <div className="relative" style={{ 
        width: `${ELLIPSE_SIZE}px`, 
        height: `${ELLIPSE_SIZE}px`
      }}>
        <svg 
          width={ELLIPSE_SIZE} 
          height={ELLIPSE_SIZE} 
          viewBox={`0 0 ${ELLIPSE_SIZE} ${ELLIPSE_SIZE}`}
          className="absolute"
        >
          <ellipse
            cx={ELLIPSE_SIZE/2}
            cy={ELLIPSE_SIZE/2}
            rx={ELLIPSE_SIZE/2}
            ry={ELLIPSE_SIZE/2}
            fill="#F4F5FA"
          />
          <circle
            cx={ELLIPSE_SIZE/2}
            cy={ELLIPSE_SIZE/2}
            r={CUTOUT_SIZE/2}
            fill="white"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <Doughnut
            data={chartData}
            options={{
              cutout: '70%',
              maintainAspectRatio: false,
              responsive: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} trials`,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </Card>
  );
};

TrialResultsChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      result: PropTypes.string,
      count: PropTypes.number
    })
  )
};

export default TrialResultsChart;