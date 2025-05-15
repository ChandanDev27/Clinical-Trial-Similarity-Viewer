import getCountryCoordinates from "./countryCoordinates";
const createBins = (values, binCount, minVal, maxVal) => {
  if (!values || !values.length) return [];
  
  const binSize = (maxVal - minVal) / binCount;
  const bins = Array(binCount).fill().map((_, i) => {
    const lower = minVal + i * binSize;
    const upper = lower + binSize;
    return {
      range: `${Math.round(lower)}-${Math.round(upper)}`,
      value: 0
    };
  });

  values.forEach(value => {
    if (value === null || value === undefined) return;
    const numValue = Number(value);
    if (isNaN(numValue)) return;
    
    const binIndex = Math.min(
      Math.floor((numValue - minVal) / binSize),
      binCount - 1
    );
    bins[binIndex].value++;
  });

  return bins;
};

// Helper function for categorical data
const countCategories = (values) => {
  const counts = {};
  values.forEach(value => {
    const key = value || 'Unknown';
    counts[key] = (counts[key] || 0) + 1;
  });
  
  return Object.entries(counts).map(([range, value]) => ({ range, value }));
};

export const getEligibilityData = (trials = []) => {
  if (!trials || !trials.length) return {};
  
  // Process each category with appropriate binning/ranges
  return {
    studyDuration: createBins(
      trials.map(t => t.eligibilityValues?.studyDuration),
      6, 0, 300
    ),
    locations: createBins(
      trials.map(t => t.eligibilityValues?.locations),
      6, 0, 300
    ),
    enrollment: createBins(
      trials.map(t => t.eligibilityValues?.enrollment),
      6, 0, 300
    ),
    countries: countCategories(
  trials.flatMap(t => {
    if (t.locations?.length === 1 && t.locations[0] === "Unknown") {
      return ["Unknown Country"];
    }
    return t.locations?.map(l => typeof l === 'string' ? l : l.country) || [];
  })
)
.sort((a, b) => b.value - a.value)
.slice(0, 5),
    timeline: countCategories(
      trials.map(t => t.startDate ? new Date(t.startDate).getFullYear() : null)
    ).sort((a, b) => a.range.localeCompare(b.range)),
    
    pregnant: createBins(
  trials.map(t => t.eligibilityValues?.pregnant),
  6,0,230
),
    age: createBins(
  trials.map(t => t.eligibilityValues?.age),
  6, 0, 300
),
    egfr: createBins(
      trials.map(t => t.eligibilityValues?.egfr),
      6, 0, 270
    ),
    hba1c: createBins(
      trials.map(t => t.eligibilityValues?.hba1c),
      6, 0, 280
    ),
    bmi: createBins(
      trials.map(t => t.eligibilityValues?.bmi),
      6, 0, 290
    )
  };
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

export const processSponsorsData = (trials = [], selectedTrials = []) => {
  const sponsorsMap = new Map();
  const relevantTrials = selectedTrials.length 
    ? trials.filter(trial => selectedTrials.includes(trial.nctId))
    : trials;

  relevantTrials.forEach(trial => {
    // Use sponsorType from your sample data
    const rawName = trial.sponsorType || 
                   trial.sponsor?.trim() || 
                   trial.leadSponsor?.name?.trim() || 
                   trial.sponsors?.[0]?.name?.trim() || 
                   trial.funder?.name?.trim() || 
                   null;

    if (!rawName) return;

    // Simplify the cleaning - just trim whitespace
    const cleanName = rawName.trim();

    if (cleanName && cleanName !== "Unknown") {
      sponsorsMap.set(cleanName, (sponsorsMap.get(cleanName) || 0) + 1);
    }
  });

  return Array.from(sponsorsMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

export const processPhaseData = (trials) => {
  if (!trials || !Array.isArray(trials)) return [];
  
  const phaseCounts = {
    "Phase 1": 0,
    "Phase 2": 0,
    "Phase 3": 0,
    "Phase 4": 0,
  };

  trials.forEach(trial => {
    trial.phases?.forEach(phase => {
      const phaseKey = `Phase ${phase.replace("PHASE", "").trim()}`;
      if (phaseCounts.hasOwnProperty(phaseKey)) {
        phaseCounts[phaseKey]++;
      }
    });
  });

  return Object.entries(phaseCounts).map(([phase, count]) => ({
    phase,
    count
  }));
};

export const processResultsData = (trials) => {
  if (!trials || !Array.isArray(trials)) return [];
  
  return [
    { result: "Has result", count: trials.filter(t => t.hasResults === true).length },
    { result: "No result", count: trials.filter(t => t.hasResults === false).length },
    { result: "Others", count: trials.filter(t => t.hasResults !== true && t.hasResults !== false).length }
  ];
};

export const processRegionalData = (trials) => {
  if (!trials || !Array.isArray(trials)) return [];
  
  const countryCounts = {};
  const countryToRegion = getCountryToRegionMapping();

  trials.forEach(trial => {
    if (!trial.locations || trial.locations.length === 0) {
      countryCounts['Unknown'] = (countryCounts['Unknown'] || 0) + 1;
      return;
    }

    trial.locations?.forEach(location => {
      const country = typeof location === 'string' ? location : (location.country || 'Unknown');
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
  });

  return Object.entries(countryCounts)
    .map(([country, count]) => {
      const coordinates = getCountryCoordinates(country);
      if (!coordinates) {
        console.warn(`No coordinates found for country: ${country}`);
        return null;
      }
      return {
        country,
        count,
        region: countryToRegion[country] || 'Unknown',
        coordinates
      };
    })
    .filter(Boolean);
};

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

