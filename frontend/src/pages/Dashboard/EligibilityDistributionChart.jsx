import React, { useState, useEffect } from "react";
import Card from "../../components/ui/Card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const tabs = [
  { id: "studyDuration", label: "Study Duration" },
  { id: "locations", label: "No. of Locations" },
  { id: "enrollment", label: "Enrollment Info" },
  { id: "countries", label: "Countries" },
  { id: "timeline", label: "Timeline" },
  { id: "pregnant", label: "Pregnant" },
  { id: "age", label: "Age" },
  { id: "egfr", label: "EGFR" },
  { id: "hba1c", label: "HBA1C" },
  { id: "bmi", label: "BMI" },
];

const EligibilityDistributionChart = ({ data = {}, isLoading = false }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [animationValues, setAnimationValues] = useState([]);

  // Get the active tab data or empty array if not found
  const activeData = data[activeTab] || [];

  // Create placeholder data for animation
  useEffect(() => {
    if (isLoading) {
      // Start with all values at 0
      setAnimationValues(Array(5).fill(0));
      
      // Animate each bar one by one with slight delay between them
      const interval = setInterval(() => {
        setAnimationValues(prev => {
          const newValues = [...prev];
          const randomIndex = Math.floor(Math.random() * newValues.length);
          newValues[randomIndex] = Math.min(
            newValues[randomIndex] + Math.random() * 5, 
            20 + Math.random() * 30
          );
          return newValues;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      // When loading is complete, animate to actual values
      setAnimationValues(activeData.map(item => item.value || 0));
    }
  }, [isLoading, activeTab, activeData]);

  // Prepare chart data
  const chartData = {
    labels: activeData.map(item => item.range || 'Unknown'),
    datasets: [{
      label: "Number of Trials",
      data: isLoading ? animationValues : activeData.map(item => item.value || 0),
      backgroundColor: isLoading 
        ? "rgba(254, 211, 166, 0.5)"
        : "#DCC0F1",
      borderColor: isLoading 
        ? "rgba(253, 170, 121, 0.5)" 
        : "#FDAA79",
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: isLoading ? 0 : 1000,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: !isLoading,
        callbacks: {
          title: (items) => {
            const item = items[0];
            const label = item.label;
            return `${tabs.find(t => t.id === activeTab)?.label}: ${label}`;
          },
          label: (tooltipItem) => `${tooltipItem.raw} trial${tooltipItem.raw !== 1 ? 's' : ''}`,
        },
        displayColors: false,
        backgroundColor: "#2D3748",
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        padding: 8,
        cornerRadius: 12
      }
    },
    scales: {
      x: {
        title: { display: false },
        grid: { display: false },
        border: { display: false },
        ticks: { font: { size: 11 } }
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        title: { display: false },
        ticks: {
          precision: 0,
          stepSize: 1,
          font: { size: 11 }
        },
        grid: { display: false }
      }
    },
    elements: {
      bar: {
        borderRadius: 12,
        borderSkipped: false,
        barThickness: 8,
        maxBarThickness: 10,
        backgroundColor: "#FED3A6",
        hoverBackgroundColor: "#FDAA79",
        hoverBorderColor: "#FDAA79"
      }
    }
  };

  return (
    <Card className="p-4 md:p-6 w-full max-w-full overflow-hidden">
      <div className="flex flex-col gap-6 w-full">
        {/* Header section */}
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-base font-medium text-[#6d7194]">Eligibility Distribution</h2>
          
          {/* Scrollable tabs container */}
          <div className="w-full overflow-x-auto pb-2">
            <div className="flex flex-wrap gap-3 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => !isLoading && setActiveTab(tab.id)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#f7f2fb] text-[#652995] font-semibold border-[#652995]"
                      : "bg-transparent text-[#232323] font-medium border-[#e9eaef] hover:bg-gray-50"
                  } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isLoading}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart container */}
        <div className="w-full" style={{ height: "225px", minHeight: "225px" }}>
          {!isLoading && activeData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[#718096] text-sm">
              No data available for this category
            </div>
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </div>
      </div>
    </Card>
  );
};

export default EligibilityDistributionChart;