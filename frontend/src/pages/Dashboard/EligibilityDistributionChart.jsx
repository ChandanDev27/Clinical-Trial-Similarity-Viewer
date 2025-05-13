import React, { useState, useMemo } from "react";
import Card from "../../components/ui/Card";
import { createBins } from '../../utils/dataHelpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const EligibilityDistributionChart = ({ trials = [] }) => {
  const [activeTab, setActiveTab] = useState("studyDuration");

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

  // Function to process eligibility data from trials
  const getEligibilityData = (trials) => {
    if (!trials || !Array.isArray(trials)) return {};

    return {
      studyDuration: createBins(trials.map((t) => t.eligibilityValues.studyDuration), 10),
      locations: createBins(trials.map((t) => t.eligibilityValues.locations), 10),
      enrollment: createBins(trials.map((t) => t.eligibilityValues.enrollment), 10),
      countries: createBins(trials.map((t) => t.eligibilityValues.countries), 5),
      timeline: createBins(trials.map((t) => t.eligibilityValues.timelines), 10),
      pregnant: createBins(trials.map((t) => t.eligibilityValues.pregnant), 10),
      age: createBins(trials.map((t) => t.eligibilityValues.age), 10),
      egfr: createBins(trials.map((t) => t.eligibilityValues.egfr), 10),
      hba1c: createBins(trials.map((t) => t.eligibilityValues.hba1c), 10),
      bmi: createBins(trials.map((t) => t.eligibilityValues.bmi), 10),
    };
  };

  // Memoized eligibility data processing
  const eligibilityData = useMemo(() => getEligibilityData(trials), [trials]);

  // Filter data based on active tab
  const chartData = eligibilityData[activeTab] || [];

  return (
    <Card className="p-5">
      <h2 className="text-base font-medium text-[#6d7194] mb-4">Eligibility Distribution</h2>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 text-xs rounded-lg border ${
              activeTab === tab.id
                ? "bg-[#f7f2fb] text-[#652995] font-semibold border-[#652995]"
                : "bg-transparent text-[#232323] font-medium border-[#e9eaef]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-[432px] h-[337px] gap-[10px] rounded-[12px] border border-[1px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="20%" barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="range" />
            <YAxis domain={[20000, 100000]} />
            <Tooltip />
            <Bar dataKey="maxValue" fill="#f4f5fa" radius={[50, 50, 50, 50]} barSize={12} />
            <Bar
              dataKey="value"
              fill="#FED3A6"
              radius={[50, 50, 50, 50]}
              isAnimationActive={true}
              animationDuration={1200}
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default EligibilityDistributionChart;
