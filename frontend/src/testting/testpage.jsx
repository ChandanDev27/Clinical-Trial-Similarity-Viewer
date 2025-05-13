import React from "react";
import TrialResultsChart from "./pages/Dashboard/TrialResultsChart";

const testTrials = [
  { hasResults: true },
  { hasResults: false },
  { hasResults: true },
  { hasResults: false },
  { hasResults: true },
  { hasResults: false },
  { hasResults: undefined },
  { hasResults: undefined },
];

const TestPage = () => {
  return (
    <div className="p-10">
      <h1 className="text-xl font-semibold mb-5">Test Trial Results Chart</h1>
      <TrialResultsChart trials={testTrials} />
    </div>
  );
};

export default TestPage;
