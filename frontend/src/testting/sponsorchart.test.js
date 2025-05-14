import React from 'react';
import SponsorsChart from '../pages/Dashboard/SponsorsChart';

const mockTrials = [
  { nctId: "NCT001", sponsor: "Pfizer" },
  { nctId: "NCT002", sponsor: "Johnson & Johnson" },
  { nctId: "NCT003", sponsor: "Novartis" },
  { nctId: "NCT004", sponsor: "Biogen" },
  { nctId: "NCT005", sponsor: "Pfizer" },
  { nctId: "NCT006", sponsor: "Unknown Sponsor" },
  // Add more if needed
];

export default function SponsorsChartDevPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h1>SponsorsChart Visual Test</h1>
      <SponsorsChart trials={mockTrials} selectedTrials={[]} />
    </div>
  );
}