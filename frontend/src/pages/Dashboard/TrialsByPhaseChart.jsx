import React from "react";
import Card from "../../components/ui/Card";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TrialsByPhaseChart = ({ trials = [] }) => {
  const processPhaseData = () => {
    const phaseCounts = {
      "Phase 1": 0,
      "Phase 2": 0,
      "Phase 3": 0,
      "Phase 4": 0,
    };

    trials.forEach((trial) => {
      trial.phases?.forEach((phase) => {
        const phaseKey = `Phase ${phase.replace("PHASE", "").trim()}`;
        if (phaseCounts.hasOwnProperty(phaseKey)) {
          phaseCounts[phaseKey]++;
        }
      });
    });

    return phaseCounts;
  };

  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, "#fed3a6");
    gradient.addColorStop(0.5, "#f4845f");
    gradient.addColorStop(1, "#f04c4c");
    return gradient;
  };

  const phaseCounts = processPhaseData();
  const phaseChartData = {
    labels: Object.keys(phaseCounts),
    datasets: [
      {
        label: "Trials Count",
        data: Object.values(phaseCounts),
        backgroundColor: (context) => {
          const { ctx, chartArea } = context.chart;
          return chartArea ? createGradient(ctx, chartArea) : "#f04c4c";
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
        grid: { display: false },
        border: { display: false },
        ticks: {
          display: true,
          color: "#6d7194",
          font: { weight: "bold" },
          autoSkip: false,
          stepSize: 5,
          min: 0,
          max: 20,
        },
        suggestedMax: 20,
      },
    },
  };

  return (
    <Card className="p-5">
      <h2 className="text-base font-medium text-[#6d7194] mb-4">Trials by Phase</h2>

      <div className="flex flex-wrap mb-4">
        <div className="flex items-center mr-[123px]">
          <div className="w-2 h-2 rounded-full bg-[#FED3A6] mr-2"></div>
          <span className="text-xs text-[#a5a7b1]">Trials</span>
        </div>
      </div>

      {trials.length === 0 ? (
        <div className="text-sm text-[#6d7194]">No phase data available for selected trials</div>
      ) : (
        <div className="w-[392px] h-[297px] flex justify-center">
          <Bar data={phaseChartData} options={chartOptions} />
        </div>
      )}
    </Card>
  );
};

export default TrialsByPhaseChart;
