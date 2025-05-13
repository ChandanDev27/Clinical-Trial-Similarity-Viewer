// dataUtils.js
export const getEligibilityData = (trials) => {
  if (!trials || !Array.isArray(trials)) return {};

  // Initialize data structure for all eligibility categories
  const eligibilityData = {
    studyDuration: [],
    locations: [],
    enrollment: [],
    countries: [],
    timeline: [],
    pregnant: [],
    age: [],
    egfr: [],
    hba1c: [],
    bmi: []
  };

  // Process study duration
  const durationCounts = {};
  trials.forEach(trial => {
    const duration = trial.duration || 'Unknown';
    durationCounts[duration] = (durationCounts[duration] || 0) + 1;
  });
  eligibilityData.studyDuration = Object.entries(durationCounts).map(([range, value]) => ({
    range,
    value
  }));

  // Process number of locations
  const locationCounts = {};
  trials.forEach(trial => {
    const count = trial.locations?.length || 0;
    const range = count === 0 ? '0' :
                 count <= 5 ? '1-5' :
                 count <= 10 ? '6-10' : '10+';
    locationCounts[range] = (locationCounts[range] || 0) + 1;
  });
  eligibilityData.locations = Object.entries(locationCounts).map(([range, value]) => ({
    range,
    value
  }));

  // Process enrollment numbers
  const enrollmentCounts = {};
  trials.forEach(trial => {
    const enrollment = trial.enrollment || 0;
    const range = enrollment === 0 ? '0' :
                  enrollment <= 50 ? '1-50' :
                  enrollment <= 100 ? '51-100' :
                  enrollment <= 500 ? '101-500' : '500+';
    enrollmentCounts[range] = (enrollmentCounts[range] || 0) + 1;
  });
  eligibilityData.enrollment = Object.entries(enrollmentCounts).map(([range, value]) => ({
    range,
    value
  }));

  // Process countries (top 5)
  const countryCounts = {};
  trials.forEach(trial => {
    trial.locations?.forEach(location => {
      const country = location.country || 'Unknown';
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
  });
  const sortedCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  eligibilityData.countries = sortedCountries.map(([country, count]) => ({
    range: country,
    value: count
  }));

  // Process timeline (start year)
  const timelineCounts = {};
  trials.forEach(trial => {
    const startDate = trial.startDate ? new Date(trial.startDate) : null;
    const year = startDate ? startDate.getFullYear().toString() : 'Unknown';
    timelineCounts[year] = (timelineCounts[year] || 0) + 1;
  });
  eligibilityData.timeline = Object.entries(timelineCounts).map(([year, count]) => ({
    range: year,
    value: count
  }));

  // Process pregnancy eligibility
  const pregnancyCounts = {
    'Yes': 0,
    'No': 0,
    'Unknown': 0
  };
  trials.forEach(trial => {
    const pregnant = trial.eligibility?.pregnant;
    if (pregnant === true) pregnancyCounts['Yes']++;
    else if (pregnant === false) pregnancyCounts['No']++;
    else pregnancyCounts['Unknown']++;
  });
  eligibilityData.pregnant = Object.entries(pregnancyCounts).map(([range, value]) => ({
    range,
    value
  }));

  // Process age ranges
  const ageCounts = {};
  trials.forEach(trial => {
    const minAge = trial.eligibility?.minAge || 0;
    const maxAge = trial.eligibility?.maxAge || 0;
    
    let range;
    if (maxAge <= 18) range = '0-18';
    else if (minAge >= 19 && maxAge <= 65) range = '19-65';
    else if (minAge > 65) range = '65+';
    else range = 'Mixed';
    
    ageCounts[range] = (ageCounts[range] || 0) + 1;
  });
  eligibilityData.age = Object.entries(ageCounts).map(([range, value]) => ({
    range,
    value
  }));

  // Process EGFR ranges
  const egfrCounts = {};
  trials.forEach(trial => {
    const egfr = trial.eligibility?.egfr;
    if (egfr === undefined || egfr === null) {
      egfrCounts['Unknown'] = (egfrCounts['Unknown'] || 0) + 1;
      return;
    }
    
    const range = egfr < 30 ? '<30' :
                  egfr < 60 ? '30-59' :
                  '≥60';
    egfrCounts[range] = (egfrCounts[range] || 0) + 1;
  });
  eligibilityData.egfr = Object.entries(egfrCounts).map(([range, value]) => ({
    range,
    value
  }));

  // Process HbA1c ranges
  const hba1cCounts = {};
  trials.forEach(trial => {
    const hba1c = trial.eligibility?.hba1c;
    if (hba1c === undefined || hba1c === null) {
      hba1cCounts['Unknown'] = (hba1cCounts['Unknown'] || 0) + 1;
      return;
    }
    
    const range = hba1c < 6.5 ? '<6.5' :
                  hba1c < 8 ? '6.5-7.9' :
                  '≥8';
    hba1cCounts[range] = (hba1cCounts[range] || 0) + 1;
  });
  eligibilityData.hba1c = Object.entries(hba1cCounts).map(([range, value]) => ({
    range,
    value
  }));

  // Process BMI ranges
  const bmiCounts = {};
  trials.forEach(trial => {
    const bmi = trial.eligibility?.bmi;
    if (bmi === undefined || bmi === null) {
      bmiCounts['Unknown'] = (bmiCounts['Unknown'] || 0) + 1;
      return;
    }
    
    const range = bmi < 18.5 ? 'Underweight (<18.5)' :
                  bmi < 25 ? 'Normal (18.5-24.9)' :
                  bmi < 30 ? 'Overweight (25-29.9)' :
                  'Obese (≥30)';
    bmiCounts[range] = (bmiCounts[range] || 0) + 1;
  });
  eligibilityData.bmi = Object.entries(bmiCounts).map(([range, value]) => ({
    range,
    value
  }));

  return eligibilityData;
};

// Helper function to process country to region mapping (consistent with RegionalDistributionMap)
export const getCountryToRegionMapping = () => ({
  'Austria': 'Europe', 'Belgium': 'Europe', 'Croatia': 'Europe', 'Czechia': 'Europe',
    'Estonia': 'Europe', 'Finland': 'Europe', 'France': 'Europe', 'Germany': 'Europe',
    'Greece': 'Europe', 'Hungary': 'Europe', 'Italy': 'Europe', 'Norway': 'Europe',
    'Poland': 'Europe', 'Portugal': 'Europe', 'Serbia': 'Europe', 'Slovakia': 'Europe',
    'Slovenia': 'Europe', 'Spain': 'Europe', 'Sweden': 'Europe', 'Ukraine': 'Europe', 'United Kingdom': 'Europe',
    'Brazil': 'Americas', 'Canada': 'Americas', 'Puerto Rico': 'Americas',
    'United States': 'Americas', 'South Africa': 'Africa',
    'China': 'Asia', 'Hong Kong': 'Asia', 'India': 'Asia', 'Japan': 'Asia',
    'Korea (Republic of)': 'Asia', 'Saudi Arabia': 'Asia', 'Turkey': 'Asia',
    'Australia': 'Oceania', 'Taiwan': 'Asia', 'Unknown': 'Unknown'
});

// Helper function to get region color (consistent with RegionalDistributionMap)
export const getRegionColor = (region) => {
  const colors = {
    'Europe': '#8884d8',
    'Americas': '#82ca9d',
    'Asia': '#ffc658',
    'Africa': '#ff8042',
    'Oceania': '#0088FE',
    'Unknown': '#FFBB28'
  };
  return colors[region] || '#8884d8';
};