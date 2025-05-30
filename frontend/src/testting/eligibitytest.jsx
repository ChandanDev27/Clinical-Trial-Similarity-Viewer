import React, { useState } from "react";
import EligibilityDistributionChart from "../pages/Dashboard/EligibilityDistributionChart";

// Sample test data for visualization
const sampleData = [
  {
    "nctId": "NCT06065540",
    "module": "identificationModule",
    "similarity_score": 94,
    "locations": ["Slovenia", "Poland", "Spain", "Australia", "Turkey", "Canada", "Germany"],
    "phases": ["PHASE3"],
    "enrollmentCount": 2700,
    "startDate": "2019-01-10",
    "endDate": "2022-03-15",
    "sponsorType": "Johnson & Johnson",
    "eligibilityValues": {
      "studyDuration": 15,
      "locations": 100,
      "enrollmentment": 5,
      "countries": 18,
      "timelines": 2,
      "pregnant": 94,
      "age": 300,
      "egfr": 89,
      "hba1c": 212,
      "bmi": 45
    }
  },
  {
    "nctId": "NCT06065541",
    "module": "identificationModule",
    "similarity_score": 92,
    "locations": ["Italy", "Poland", "United States", "Saudi Arabia", "Serbia", "Hungary", "China"],
    "phases": ["PHASE3"],
    "enrollmentCount": 180,
    "startDate": "2018-09-05",
    "endDate": "2020-12-20",
    "sponsorType": "Pfizer",
    "eligibilityValues": {
      "studyDuration": 87,
      "locations": 221,
      "enrollmentment": 199,
      "countries": 173,
      "timelines": 23,
      "pregnant": 154,
      "age": 244,
      "egfr": 113,
      "hba1c": 19,
      "bmi": 287
    }
  },
  {
    "nctId": "NCT06065542",
    "module": "identificationModule",
    "similarity_score": 91,
    "locations": ["Ukraine", "Greece", "Czechia", "Poland", "United States", "Canada", "Japan", "Puerto Rico"],
    "phases": ["PHASE3"],
    "enrollmentCount": 961,
    "startDate": "2017-07-12",
    "endDate": "2020-10-01",
    "sponsorType": "Novartis",
    "eligibilityValues": {
      "studyDuration": 121,
      "locations": 200,
      "enrollmentment": 150,
      "countries": 34,
      "timelines": 112,
      "pregnant": 17,
      "age": 98,
      "egfr": 46,
      "hba1c": 265,
      "bmi": 18
    }
  },
  {
    "nctId": "NCT06065543",
    "module": "identificationModule",
    "similarity_score": 90,
    "locations": ["Poland", "United States", "Canada", "Portugal", "Slovakia", "Hungary"],
    "phases": ["PHASE3"],
    "enrollmentCount": 720,
    "startDate": "2016-04-10",
    "endDate": "2019-06-05",
    "sponsorType": "Pfizer",
    "eligibilityValues": {
      "studyDuration": 200,
      "locations": 89,
      "enrollmentment": 79,
      "countries": 12,
      "timelines": 244,
      "pregnant": 55,
      "age": 165,
      "egfr": 266,
      "hba1c": 37,
      "bmi": 229
    }
  },
  {
    "nctId": "NCT06065544",
    "module": "identificationModule",
    "similarity_score": 88,
    "locations": ["Unknown"],
    "phases": ["PHASE3"],
    "enrollmentCount": 101,
    "startDate": "2015-08-20",
    "endDate": "2017-11-30",
    "sponsorType": "Biogen",
    "eligibilityValues": {
      "studyDuration": 299,
      "locations": 133,
      "enrollmentment": 122,
      "countries": 275,
      "timelines": 90,
      "pregnant": 86,
      "age": 14,
      "egfr": 252,
      "hba1c": 8,
      "bmi": 179
    }
  },
  {
    "nctId": "NCT06065545",
    "module": "identificationModule",
    "similarity_score": 89,
    "locations": ["Korea (Republic of)", "Hong Kong", "Brazil", "China"],
    "phases": ["PHASE3"],
    "enrollmentCount": 279,
    "startDate": "2019-03-25",
    "endDate": "2021-09-30",
    "sponsorType": "Johnson & Johnson",
    "eligibilityValues": {
      "studyDuration": 49,
      "locations": 297,
      "enrollmentment": 57,
      "countries": 132,
      "timelines": 268,
      "pregnant": 144,
      "age": 218,
      "egfr": 108,
      "hba1c": 256,
      "bmi": 134
    }
  },
  {
    "nctId": "NCT06065546",
    "module": "identificationModule",
    "similarity_score": 87,
    "locations": ["Slovenia", "Croatia", "Czechia", "Australia", "United States", "Estonia", "Poland"],
    "phases": ["PHASE3"],
    "enrollmentCount": 0,
    "startDate": "2020-02-11",
    "endDate": "2022-06-30",
    "sponsorType": "Novartis",
    "eligibilityValues": {
      "studyDuration": 195,
      "locations": 15,
      "enrollmentment": 67,
      "countries": 288,
      "timelines": 121,
      "pregnant": 110,
      "age": 272,
      "egfr": 188,
      "hba1c": 92,
      "bmi": 276
    }
  },
  {
    "nctId": "NCT06065547",
    "module": "identificationModule",
    "similarity_score": 90,
    "locations": ["Austria", "United States", "Sweden", "Finland"],
    "phases": ["PHASE3"],
    "enrollmentCount": 375,
    "startDate": "2017-05-22",
    "endDate": "2019-08-14",
    "sponsorType": "Biogen",
    "eligibilityValues": {
      "studyDuration": 203,
      "locations": 101,
      "enrollmentment": 13,
      "countries": 199,
      "timelines": 55,
      "pregnant": 221,
      "age": 165,
      "egfr": 78,
      "hba1c": 247,
      "bmi": 143
    }
  },
  {
    "nctId": "NCT07065540",
    "module": "identificationModule",
    "similarity_score": 93,
    "locations": ["France", "Belgium", "Germany", "Australia", "Turkey", "Canada", "Norway"],
    "phases": ["PHASE3"],
    "enrollmentCount": 2650,
    "startDate": "2019-02-18",
    "endDate": "2022-05-21",
    "sponsorType": "Pfizer",
    "eligibilityValues": {
      "studyDuration": 35,
      "locations": 120,
      "enrollmentment": 14,
      "countries": 33,
      "timelines": 20,
      "pregnant": 88,
      "age": 288,
      "egfr": 75,
      "hba1c": 190,
      "bmi": 65
    }
  },
  {
    "nctId": "NCT07065541",
    "module": "identificationModule",
    "similarity_score": 91,
    "locations": ["Spain", "Italy", "United States", "Saudi Arabia", "Hungary", "China", "Japan"],
    "phases": ["PHASE3"],
    "enrollmentCount": 190,
    "startDate": "2018-11-22",
    "endDate": "2021-01-10",
    "sponsorType": "Johnson & Johnson",
    "eligibilityValues": {
      "studyDuration": 76,
      "locations": 205,
      "enrollmentment": 177,
      "countries": 160,
      "timelines": 50,
      "pregnant": 132,
      "age": 228,
      "egfr": 124,
      "hba1c": 47,
      "bmi": 274
    }
  },
  {
    "nctId": "NCT07065542",
    "module": "identificationModule",
    "similarity_score": 89,
    "locations": ["Ukraine", "Portugal", "Czechia", "United States", "Canada", "Japan", "France"],
    "phases": ["PHASE3"],
    "enrollmentCount": 940,
    "startDate": "2017-06-18",
    "endDate": "2020-08-10",
    "sponsorType": "Biogen",
    "eligibilityValues": {
      "studyDuration": 109,
      "locations": 188,
      "enrollmentment": 141,
      "countries": 27,
      "timelines": 130,
      "pregnant": 38,
      "age": 87,
      "egfr": 52,
      "hba1c": 240,
      "bmi": 27
    }
  },
  {
    "nctId": "NCT07065543",
    "module": "identificationModule",
    "similarity_score": 88,
    "locations": ["Poland", "United States", "Canada", "Slovakia", "South Africa", "Hungary"],
    "phases": ["PHASE3"],
    "enrollmentCount": 690,
    "startDate": "2016-05-07",
    "endDate": "2019-07-20",
    "sponsorType": "Novartis",
    "eligibilityValues": {
      "studyDuration": 180,
      "locations": 78,
      "enrollmentment": 88,
      "countries": 10,
      "timelines": 215,
      "pregnant": 73,
      "age": 179,
      "egfr": 242,
      "hba1c": 56,
      "bmi": 219
    }
  },
  {
    "nctId": "NCT07065544",
    "module": "identificationModule",
    "similarity_score": 87,
    "locations": ["Unknown"],
    "phases": ["PHASE3"],
    "enrollmentCount": 115,
    "startDate": "2015-09-12",
    "endDate": "2018-01-11",
    "sponsorType": "Biogen",
    "eligibilityValues": {
      "studyDuration": 278,
      "locations": 141,
      "enrollmentment": 113,
      "countries": 260,
      "timelines": 98,
      "pregnant": 72,
      "age": 33,
      "egfr": 245,
      "hba1c": 11,
      "bmi": 167
    }
  },
  {
    "nctId": "NCT07065545",
    "module": "identificationModule",
    "similarity_score": 86,
    "locations": ["Korea (Republic of)", "Hong Kong", "Brazil", "China"],
    "phases": ["PHASE3"],
    "enrollmentCount": 260,
    "startDate": "2019-05-15",
    "endDate": "2022-01-05",
    "sponsorType": "Pfizer",
    "eligibilityValues": {
      "studyDuration": 54,
      "locations": 290,
      "enrollmentment": 60,
      "countries": 125,
      "timelines": 255,
      "pregnant": 140,
      "age": 201,
      "egfr": 118,
      "hba1c": 230,
      "bmi": 122
    }
  },
  {
    "nctId": "NCT07065546",
    "module": "identificationModule",
    "similarity_score": 85,
    "locations": ["Slovenia", "Croatia", "Estonia", "Australia", "United States", "India", "Poland"],
    "phases": ["PHASE3"],
    "enrollmentCount": 0,
    "startDate": "2020-03-18",
    "endDate": "2022-07-11",
    "sponsorType": "Novartis",
    "eligibilityValues": {
      "studyDuration": 182,
      "locations": 28,
      "enrollmentment": 49,
      "countries": 280,
      "timelines": 110,
      "pregnant": 92,
      "age": 260,
      "egfr": 180,
      "hba1c": 104,
      "bmi": 260
    }
  },
  {
    "nctId": "NCT07065547",
    "module": "identificationModule",
    "similarity_score": 89,
    "locations": ["Austria", "United States", "Norway", "Finland"],
    "phases": ["PHASE3"],
    "enrollmentCount": 380,
    "startDate": "2017-06-19",
    "endDate": "2019-09-30",
    "sponsorType": "Biogen",
    "eligibilityValues": {
      "studyDuration": 188,
      "locations": 111,
      "enrollmentment": 22,
      "countries": 185,
      "timelines": 64,
      "pregnant": 209,
      "age": 156,
      "egfr": 96,
      "hba1c": 230,
      "bmi": 155
    }
  }
];

const EligibilityDistributionChartTest = () => {
  const [trialCount, setTrialCount] = useState(sampleData.length);
  const [activeTab, setActiveTab] = useState("studyDuration");

  // Filtered trials based on selected trial count
  const filteredTrials = sampleData.slice(0, trialCount);

  return (
  <div className="p-8 max-w-6xl mx-auto">
    <h1 className="text-2xl font-bold mb-6">Eligibility Distribution Chart - Visual Test</h1>

    {/* Chart Visualization FIRST */}
    <div className="border rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Chart Visualization</h2>
      <EligibilityDistributionChart trials={filteredTrials} />
    </div>

    {/* Test Controls Section */}
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Test Controls</h2>
      <div className="flex flex-wrap gap-4">
        {/* Trial Count Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Number of Trials</label>
          <select
            value={trialCount}
            onChange={(e) => setTrialCount(Number(e.target.value))}
            className="border rounded p-2"
          >
            <option value={1}>1 Trial</option>
            <option value={5}>5 Trials</option>
            <option value={sampleData.length}>All Trials ({sampleData.length})</option>
          </select>
        </div>

        {/* Tab Selector Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Default Tab</label>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="border rounded p-2"
          >
            <option value="studyDuration">Study Duration</option>
            <option value="locations">No. of Locations</option>
            <option value="enrollment">Enrollment Info</option>
            <option value="countries">Countries</option>
            <option value="timelines">Timelines</option>
            <option value="pregnant">Pregnant</option>
            <option value="age">Age</option>
            <option value="egfr">EGFR</option>
            <option value="hba1c">HBA1C</option>
            <option value="bmi">BMI</option>
          </select>
        </div>
      </div>
    </div>

    {/* Data Preview Section (optional) */}
    <div className="border rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Sample Data Preview</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
        {JSON.stringify(filteredTrials, null, 2)}
      </pre>
    </div>
  </div>
);
};

export default EligibilityDistributionChartTest;
