import React from "react";
import PropTypes from "prop-types";
import Card from "../../components/ui/Card";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TrialsByPhaseChart = ({ data = [] }) => {
  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, "#fed3a6");
    gradient.addColorStop(0.5, "#f4845f");
    gradient.addColorStop(1, "#f04c4c");
    return gradient;
  };

  const chartData = {
    labels: data.map(item => item.phase),
    datasets: [
      {
        label: "Trials Count",
        data: data.map(item => item.count),
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return "#f04c4c";
          return createGradient(ctx, chartArea);
        },
        borderSkipped: false,
        borderRadius: 100,
        barThickness: 12,
        maxBarThickness: 12,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { display: true, color: "#6d7194", font: { weight: "bold" } },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        ticks: {
          precision: 0,
          stepSize: 5,
          font: { size: 11, weight: "bold" },
          color: "#6d7194"
        },
        grid: { display: false }
      }
    }
  };

  return (
    <Card className="h-full p-5 flex flex-col">
      <h2 className="text-base font-medium text-[#6d7194] mb-4">Trials by Phase</h2>

      <div className="flex flex-wrap mb-4">
        <div className="flex items-center mr-[123px]">
          <div className="w-2 h-2 rounded-full bg-[#FED3A6] mr-2"></div>
          <span className="text-xs text-[#a5a7b1]">Trials</span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-sm text-[#6d7194] flex-grow flex items-center justify-center">
          No phase data available
        </div>
      ) : (
        <div className="flex-grow flex justify-center">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </Card>
  );
};

TrialsByPhaseChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      phase: PropTypes.string,
      count: PropTypes.number
    })
  )
};

export default TrialsByPhaseChart;