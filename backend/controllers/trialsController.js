const fs = require('fs');
const path = require('path');
const { AppError, handleError } = require('../utils/errorUtils');
const _ = require('lodash');
const fetch = require("node-fetch");

// Key Data Structures
let cachedData = null;
let lastModified = null;
const dataPath = path.join(__dirname, '../data/sample-data.json');
const selectionsPath = path.join(__dirname, 'selectedTrials.json');

// Country coordinates mapping

const getCountryCoordinates = async () => {
  try {
    const response = await fetch("http://localhost:3000/data/countryCoordinates.json");
    if (!response.ok) throw new Error("Failed to fetch country coordinates");

    return await response.json();
  } catch (error) {
    console.error("Error fetching country coordinates:", error);
    return {};
  }
};


// country to region mapping
const countryToRegion = {
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
};

// Percentile calculation logic
const percentile = (arr, p) => {
    if (!arr.length) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const pos = (sorted.length - 1) * p / 100;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

// Histogram bin creation logic
const createBins = (values, binSize) => {
    const bins = {};
    values.forEach(value => {
        if (value !== null && value !== undefined) {
            const bin = Math.floor(value / binSize) * binSize;
            bins[bin] = (bins[bin] || 0) + 1;
        }
    });
    return bins;
};

// Data Management Functions

// Cached data loading with file system checks
const loadDataWithCache = () => {
    try {
        const stats = fs.statSync(dataPath);
        if (!cachedData || stats.mtime > lastModified) {
            const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            cachedData = rawData.map(processTrial).filter(validateTrial);
            lastModified = stats.mtime;
        }
        return cachedData || []; // Ensure always returns array
    } catch (error) {
        console.error('Data loading failed:', error);
        return [];
    }
};

 // Load selected trials from file
const loadSelections = () => {
    try {
        if (fs.existsSync(selectionsPath)) {
            return new Set(JSON.parse(fs.readFileSync(selectionsPath, 'utf8')));
        }
        return new Set();
    } catch (error) {
        throw new AppError('DATA_LOAD', error);
    }
};

// Persist selections to file
const saveSelectionsToFile = (selections) => {
    try {
        fs.writeFileSync(selectionsPath, JSON.stringify(Array.from(selections)));
    } catch (error) {
        throw new AppError('DATA_LOAD', error);
    }
};

/// Data normalization and cleanup
const processTrial = (trial) => {
    const { enrollmentment, ...rest } = trial.eligibilityValues ?? {};
    return {
        ...trial,
        eligibilityValues: {
            ...rest,
            enrollment: trial.eligibilityValues?.enrollment ?? enrollmentment
        },
        hasResults: trial.endDate ? new Date(trial.endDate) < new Date() : false
    };
};

// Validate required trial fields
const validateTrial = (trial) => {
    const requiredFields = ['nctId', 'similarity_score', 'phases', 'locations', 'sponsorType'];
    return requiredFields.every(field => trial[field] !== undefined);
};

// State Management
let selectedTrials = loadSelections();

// Enhance trials with selection status
const addSelectionStatus = (trials) => {
    return trials.map(trial => ({
        ...trial,
        isSelected: selectedTrials.has(trial.nctId)
    }));
};
// Helper functions

// Count trials by phase
const countByPhase = (trials) => {
  return trials.reduce((acc, trial) => {
    if (trial.phases) {
      trial.phases.forEach(phase => {
        acc[phase] = (acc[phase] || 0) + 1;
      });
    }
    return acc;
  }, {});
};

// Count trials by region
const countByRegion = (trials) => {
  return trials.reduce((acc, trial) => {
    if (trial.locations) {
      trial.locations.forEach(location => {
        const region = countryToRegion[location] || 'Unknown';
        acc[region] = (acc[region] || 0) + 1;
      });
    }
    return acc;
  }, {});
};

// Return available sort function
const getAvailableSortFields = () => {
  return [
    { value: 'similarity_score', label: 'Similarity Score' },
    { value: 'nctId', label: 'Trial ID' },
    { value: 'sponsorType', label: 'Sponsor' },
    { value: 'enrollmentCount', label: 'Enrollment Count' },
    { value: 'startDate', label: 'Start Date' },
    { value: 'endDate', label: 'End Date' },
    { value: 'locations', label: 'Location Count' },
    { value: 'phases', label: 'Phase' }
  ];
};

// Get unique phase options 
const getPhaseOptions = (trials) => {
  const phaseSet = new Set();
  trials.forEach(trial => {
    if (trial.phases) {
      trial.phases.forEach(phase => phaseSet.add(phase));
    }
  });
  return Array.from(phaseSet).map(phase => ({
    value: phase,
    label: phase.charAt(0).toUpperCase() + phase.slice(1).toLowerCase()
  }));
};

// Get unique location options
const getLocationOptions = (trials) => {
  const locationSet = new Set();
  trials.forEach(trial => {
    if (trial.locations) {
      trial.locations.forEach(loc => {
        if (loc && loc !== 'Unknown') locationSet.add(loc);
      });
    }
  });
  return Array.from(locationSet).map(location => ({
    value: location,
    label: location
  }));
};

// Get color codding for region 
const getRegionColor = (region) => {
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

const sanitizeInput = (input) => {
    if (input === null || input === undefined) return '';
    return input.toString().replace(/[^a-zA-Z0-9-_]/g, '');
};

// Similarity Analysis
const calculateSimilarityGroups = (trials, threshold = 0.85) => {
    if (!trials.length) return [];

    const sortedTrials = [...trials].sort((a, b) => b.similarity_score - a.similarity_score);
    
    const groups = [];
    const usedIds = new Set();
    
    sortedTrials.forEach(trial => {
        if (usedIds.has(trial.nctId)) return;
        
        const group = [trial];
        usedIds.add(trial.nctId);

        sortedTrials.forEach(otherTrial => {
            if (!usedIds.has(otherTrial.nctId) && 
                areTrialsSimilar(trial, otherTrial, threshold)) {
                group.push(otherTrial);
                usedIds.add(otherTrial.nctId);
            }
        });
        
        if (group.length > 1) {
            groups.push({
                id: `group-${groups.length + 1}`,
                trials: group,
                averageScore: group.reduce((sum, t) => sum + t.similarity_score, 0) / group.length,
                representativeTrial: findRepresentativeTrial(group)
            });
        }
    });
    
    return groups;
};

const areTrialsSimilar = (trial1, trial2, threshold) => {
    const scoreDiff = Math.abs(trial1.similarity_score - trial2.similarity_score);
    const phaseMatch = trial1.phases.some(p => trial2.phases.includes(p));
    const sponsorMatch = trial1.sponsorType === trial2.sponsorType;
    
    return (scoreDiff < (100 * (1 - threshold)) && phaseMatch && sponsorMatch);
};

const findRepresentativeTrial = (trials) => {
    const sorted = [...trials].sort((a, b) => a.similarity_score - b.similarity_score);
    return sorted[Math.floor(sorted.length / 2)];
};
// Controller function 

/**
 * Retrieves paginated and filtered list of clinical trials
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - 'asc' or 'desc'
 * @returns {Object} Paginated trial data with metadata
 */
// Enhanced list view with pagination, sorting, filtering
const getAllTrials = (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'similarity_score', 
      sortOrder = 'desc',
      search = '',
      minScore = 0,
      maxScore = 100
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const minScoreNum = parseFloat(minScore);
    const maxScoreNum = parseFloat(maxScore);

    const validSortFields = [
      'similarity_score', 'nctId', 'sponsorType', 
      'enrollmentCount', 'startDate', 'endDate', 
      'locations', 'phases'
    ];
    const validatedSortBy = validSortFields.includes(sortBy) 
      ? sortBy 
      : 'similarity_score';
    const validatedSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) 
      ? sortOrder.toLowerCase() 
      : 'desc';

    let data = loadDataWithCache();
    let filteredData = data.filter(trial => {
      const scoreMatch = trial.similarity_score >= minScoreNum && trial.similarity_score <= maxScoreNum;
      const searchLower = search.toLowerCase();
      const searchMatch = 
        trial.nctId.toLowerCase().includes(searchLower) ||
        (trial.sponsorType && trial.sponsorType.toLowerCase().includes(searchLower)) ||
        (trial.locations && trial.locations.some(loc => 
          loc && loc.toLowerCase().includes(searchLower)
        ));

      return scoreMatch && searchMatch;
    });

    filteredData.sort((a, b) => {
      let valA, valB;
      
      if (validatedSortBy === 'locations') {
        valA = a.locations?.length || 0;
        valB = b.locations?.length || 0;
      } else if (validatedSortBy === 'phases') {
        valA = a.phases?.join(', ') || '';
        valB = b.phases?.join(', ') || '';
      } else {
        valA = a[validatedSortBy];
        valB = b[validatedSortBy];
      }
      
      if (valA == null) return 1;
      if (valB == null) return -1;
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return validatedSortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      
      return validatedSortOrder === 'asc' 
        ? valA - valB 
        : valB - valA;
    });

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limitNum);
    const paginatedData = filteredData.slice(
      (pageNum - 1) * limitNum,
      pageNum * limitNum
    );
    const enrichedData = addSelectionStatus(paginatedData);
    const scores = filteredData.map(t => t.similarity_score);
    const scoreStats = {
      min: Math.min(...scores),
      max: Math.max(...scores),
      average: scores.reduce((sum, score) => sum + score, 0) / scores.length
    };

    res.status(200).json({
      success: true,
      data: enrichedData,
      meta: {
        total: totalItems,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1
      },
      stats: {
        score: scoreStats,
        phases: countByPhase(filteredData),
        regions: countByRegion(filteredData)
      },
      filters: {
        applied: {
          search,
          minScore,
          maxScore,
          sortBy: validatedSortBy,
          sortOrder: validatedSortOrder
        },
        available: {
          sortFields: getAvailableSortFields(),
          phaseOptions: getPhaseOptions(filteredData),
          locationOptions: getLocationOptions(filteredData)
        }
      }
    });
  } catch (error) {
    handleError(error, res);
  }
};

// Get single trial by ID with normalization
const getTrialById = (req, res, next) => {
    try {
        const data = loadDataWithCache();
        const trialId = req.params.id;

        if (!trialId) {
            throw new AppError('INVALID_TRIAL_ID', {
                message: 'Trial ID is required',
                statusCode: 400
            });
        }

        const trial = data.find(t => t.nctId === trialId);
        
        if (!trial) {
            throw new AppError('TRIAL_NOT_FOUND', {
                message: `Trial with ID ${trialId} not found`,
                statusCode: 404,
                details: { searchedId: trialId }
            });
        }

        res.status(200).json({ 
            success: true, 
            data: addSelectionStatus([trial])[0] 
        });
    } catch (error) {
        next(error);
    }
};

// Comprehensive filtering endpoint
const filterTrials = (req, res) => {
    try {
        const {
            phase, location, similarity_score, sponsor,
            startDate, endDate, hasResults, search,
            page = 1, limit = 10, sortBy, sortOrder = 'asc'
        } = req.query;
        const data = loadDataWithCache();

        console.log('Filter parameters:', req.query);

        let filtered = [...data];

        if (similarity_score) {
            const minScore = Number(similarity_score);
            if (!isNaN(minScore)) {
                filtered = filtered.filter(t => t.similarity_score >= minScore);
            }
        }

        if (phase) {
            const phaseUpper = sanitizeInput(phase).toUpperCase();
            console.log('Phase filter:', { input: phase, normalized: phaseUpper });
            
            filtered = filtered.filter(trial => {
                if (!trial.phases) return false;
                
                const trialPhases = Array.isArray(trial.phases) 
                    ? trial.phases 
                    : [trial.phases];
                    
                return trialPhases.some(p => 
                    p && typeof p === 'string' && 
                    p.toUpperCase() === phaseUpper
                );
            });
            
            console.log('Post-phase filter count:', filtered.length);
        }

        if (location) {
            const locationLower = sanitizeInput(location).toLowerCase();
            filtered = filtered.filter(trial =>
                trial.locations.some(loc => loc && sanitizeInput(loc).toLowerCase() === locationLower)
            );
        }

        if (sponsor) {
            const sponsorLower = sanitizeInput(sponsor).toLowerCase();
            filtered = filtered.filter(t =>
                t.sponsorType && sanitizeInput(t.sponsorType).toLowerCase().includes(sponsorLower)
            );
        }

        if (search) {
            const searchLower = sanitizeInput(search).toLowerCase();
            filtered = filtered.filter(trial => 
                (trial.nctId && sanitizeInput(trial.nctId).toLowerCase().includes(searchLower)) ||
                (trial.sponsorType && sanitizeInput(trial.sponsorType).toLowerCase().includes(searchLower)) ||
                (trial.locations && trial.locations.some(loc => 
                    loc && sanitizeInput(loc).toLowerCase().includes(searchLower)
                ))
            );
        }

        if (startDate && !isNaN(Date.parse(startDate))) {
            filtered = filtered.filter(t => 
                t.startDate && new Date(t.startDate) >= new Date(startDate)
            );
        }

        if (endDate && !isNaN(Date.parse(endDate))) {
            filtered = filtered.filter(t => 
                t.endDate && new Date(t.endDate) <= new Date(endDate)
            );
        }

        if (hasResults) {
            filtered = filtered.filter(t => 
                t.hasResults === (hasResults === 'true')
            );
        }

        if (filtered.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                meta: {
                    total: 0,
                    page: Math.max(1, parseInt(page)),
                    limit: Math.max(1, parseInt(limit)),
                    totalPages: 0
                },
                message: 'No trials match your criteria'
            });
        }

        if (sortBy) {
            filtered.sort((a, b) => {
                const valA = a[sortBy];
                const valB = b[sortBy];
                if (valA == null) return 1;
                if (valB == null) return -1;
                if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
                if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
                return 0;
            });
        }

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, parseInt(limit));
        const paginated = addSelectionStatus(
            filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum)
        );

        res.json({
            success: true,
            data: paginated,
            meta: {
                total: filtered.length,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(filtered.length / limitNum)
            }
        });

    } catch (error) {
        console.error('Filter error:', error);
        res.status(200).json({
            success: true,
            data: [],
            meta: {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 0
            }
        });
    }
};

// Score analysis with distribution stats
const getScoreViewData = (req, res) => {
    try {
        const data = loadDataWithCache();
        const sortedData = [...data].sort((a, b) => b.similarity_score - a.similarity_score);
        const dataWithSelection = addSelectionStatus(sortedData);
        const scores = data.map(t => t.similarity_score);
        const scoreStats = {
            average: scores.reduce((sum, score) => sum + score, 0) / scores.length,
            min: Math.min(...scores),
            max: Math.max(...scores),
            percentile25: percentile(scores, 25),
            percentile50: percentile(scores, 50),
            percentile75: percentile(scores, 75),
            bins: createBins(scores, 5)
        };

        res.json({
            success: true,
            data: dataWithSelection,
            stats: scoreStats
        });
    } catch (error) {
        handleError(error, res);
    }
};

const getDashboardData = (req, res) => {
    try {
        const data = loadDataWithCache();
        const countries = data.flatMap(t => t.locations);
        const uniqueCountries = [...new Set(countries)];
        
        const geographicData = uniqueCountries.map(country => {
            const count = countries.filter(c => c === country).length;
            return {
                country,
                count,
                region: countryToRegion[country] || 'Unknown',
                coordinates: countryCoordinates[country] || null
            };
        });

        const enhancedEligibilityDistribution = {
            studyDuration: createBins(data.map(t => t.eligibilityValues.studyDuration), 10),
            noOfLocations: createBins(data.map(t => t.eligibilityValues.locations), 10),
            enrollment: createBins(data.map(t => t.eligibilityValues.enrollment), 10),
            countries: createBins(data.map(t => t.eligibilityValues.countries), 5),
            timeline: createBins(data.map(t => t.eligibilityValues.timeline), 10),
            pregnant: createBins(data.map(t => t.eligibilityValues.pregnant), 10),
            age: createBins(data.map(t => t.eligibilityValues.age), 10),
            egfr: createBins(data.map(t => t.eligibilityValues.egfr), 10),
            hbac: createBins(data.map(t => t.eligibilityValues.hba1c), 10),
            bmi: createBins(data.map(t => t.eligibilityValues.bmi), 10)
        };

        const regionData = Object.entries(
            geographicData.reduce((acc, {region, count}) => {
                acc[region] = (acc[region] || 0) + count;
                return acc;
            }, {})
        ).map(([name, count]) => ({ 
            name, 
            value: count,

            fill: getRegionColor(name)
        }));

        const dashboardData = {
            phases: data.reduce((acc, t) => {
                t.phases.forEach(p => { 
                    acc[p] = (acc[p] || 0) + 1 
                });
                return acc;
            }, {}),
            regions: regionData,
            results: {
                hasResults: data.filter(t => t.hasResults).length,
                noResults: data.filter(t => !t.hasResults).length
            },
            sponsors: data.reduce((acc, t) => {
                acc[t.sponsorType] = (acc[t.sponsorType] || 0) + 1;
                return acc;
            }, {}),
            similarityDistribution: createBins(data.map(t => t.similarity_score), 5),
            enrollmentDistribution: createBins(
                data.map(t => t.enrollmentCount).filter(e => e > 0), 
                50
            ),
            eligibilityDistribution: enhancedEligibilityDistribution,
            geographicDistribution: {
                countries: geographicData,
                regions: regionData
            },
            selectedTrials: {
                count: selectedTrials.size,
                phases: data.filter(t => selectedTrials.has(t.nctId))
                    .reduce((acc, t) => {
                        t.phases.forEach(p => { acc[p] = (acc[p] || 0) + 1 });
                        return acc;
                    }, {})
            }
        };

        res.json({ success: true, data: dashboardData });
    } catch (error) {
        handleError(error, res);
    }
};

const getSimilarTrials = (req, res) => {
    try {
        const { threshold = 0.85 } = req.query;
        const data = loadDataWithCache();
        
        const similarGroups = calculateSimilarityGroups(data, parseFloat(threshold));
        const enrichedGroups = similarGroups.map(group => ({
            ...group,
            trials: addSelectionStatus(group.trials)
        }));
        
        res.json({
            success: true,
            data: enrichedGroups,
            meta: {
                totalGroups: similarGroups.length,
                totalTrials: similarGroups.reduce((sum, group) => sum + group.trials.length, 0),
                averageGroupSize: similarGroups.length > 0 
                    ? similarGroups.reduce((sum, group) => sum + group.trials.length, 0) / similarGroups.length
                    : 0
            }
        });
    } catch (error) {
        handleError(error, res);
    }
};

// Field-specific eligibility distribution
const getEligibilityDistribution = (req, res) => {
    try {
        const field = sanitizeInput(req.params.field);
        const data = loadDataWithCache();

        if (!data[0]?.eligibilityValues?.[field]) {
            throw new AppError('INVALID_ELIGIBILITY_FIELD');
        }

        const values = data.map(t => t.eligibilityValues[field]);
        res.json({ 
            success: true, 
            data: createBins(values, 10),
            field 
        });
    } catch (error) {
        handleError(error, res);
    }
};

// Save user selections with validation
const saveSelections = (req, res) => {
    try {
        const { trialIds } = req.body;
        if (!Array.isArray(trialIds)) {
            throw new AppError('INVALID_SELECTION');
        }

        // Sanitize all trial IDs before processing
        const sanitizedTrialIds = trialIds.map(id => sanitizeInput(id));
        const validIds = new Set(loadDataWithCache().map(t => t.nctId));
        
        // Filter to only include valid, sanitized IDs
        selectedTrials = new Set(
            sanitizedTrialIds.filter(id => 
                id && validIds.has(id) && id.length > 0
            )
        );

        saveSelectionsToFile(selectedTrials);
        res.json({ 
            success: true, 
            selectedCount: selectedTrials.size,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        handleError(error, res);
    }
};

// Retrieve current selections
const getSelections = (req, res) => {
  try {
    const selectedTrials = JSON.parse(fs.readFileSync('selectedTrials.json', 'utf-8'));
    res.json({ success: true, trials: selectedTrials });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving selections" });
  }
};

module.exports = {
    getAllTrials,
    getTrialById,
    filterTrials,
    getDashboardData,
    getScoreViewData,
    getSimilarTrials,
    getEligibilityDistribution,
    saveSelections,
    getSelections
};
