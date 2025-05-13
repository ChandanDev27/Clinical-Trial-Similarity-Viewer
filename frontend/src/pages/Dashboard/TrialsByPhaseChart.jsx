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

    return {
      labels: Object.keys(phaseCounts),
      datasets: [
        {
          label: "Trials Count",
          data: Object.values(phaseCounts),
          backgroundColor: ["#fed3a6", "#f7b267", "#f4845f", "#f04c4c"],
          borderSkipped: false,
          borderRadius: 100,
          barThickness: 12,
          maxBarThickness: 12,
        },
      ],
    };
  };

  const phaseChartData = processPhaseData();

  return (
    <Card className="p-5">
      <h2 className="text-base font-medium text-[#6d7194] mb-4">Trials by Phase</h2>

      {trials.length === 0 ? (
        <div className="text-sm text-[#6d7194]">No phase data available for selected trials</div>
      ) : (
        <div className="w-[392px] h-[229px] flex justify-center">
          <Bar
            data={phaseChartData}
            options={{
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
            }}
          />
        </div>
      )}
    </Card>
  );
};

export default TrialsByPhaseChart;
