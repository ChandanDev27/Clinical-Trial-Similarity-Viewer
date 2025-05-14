import React from "react";
import TrialsByPhaseChart from "../pages/Dashboard/TrialsByPhaseChart";

const testTrials = [
  { phases: ["PHASE 1"] },
  { phases: ["PHASE 2"] },
  { phases: ["PHASE 3"] },
  { phases: ["PHASE 2", "PHASE 3"] },
  { phases: ["PHASE 1", "PHASE 4"] },
  { phases: ["PHASE 2"] },
];

const PhaseTest = () => {
  return (
    <div className="p-10">
      <h1 className="text-xl font-semibold mb-5">Test Trials By Phase Chart</h1>
      <TrialsByPhaseChart trials={testTrials} />
    </div>
  );
};

export default PhaseTest;
