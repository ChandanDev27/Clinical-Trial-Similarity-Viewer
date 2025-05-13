import React from "react";
import RegionalDistributionMap from "../pages/Dashboard/RegionalDistributionMap";

const testTrials = [
  { locations: ["United States", "Canada"] },
  { locations: ["Germany", "France"] },
  { locations: ["India"] },
  { locations: ["Brazil", "Argentina"] },
  { locations: ["Australia"] },
];

const regiontestpage = () => {
  return (
    <div className="p-10">
      <h1 className="text-xl font-semibold mb-5">Test Regional Distribution Map</h1>
      <RegionalDistributionMap trials={testTrials} /> {}
    </div>
  );
};

export default regiontestpage;
