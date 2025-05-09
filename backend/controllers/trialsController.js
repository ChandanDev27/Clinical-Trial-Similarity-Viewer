const fs = require('fs');
const path = require('path');
const { AppError, handleError } = require('../utils/errorUtils');

// Caching and file paths
let cachedData = null;
let lastModified = null;
const dataPath = path.join(__dirname, '../data/sample-data.json');
const selectionsPath = path.join(__dirname, 'selectedTrials.json');

// Country coordinates mapping
const countryCoordinates = {
    'Austria': { lat: 47.5162, lng: 14.5501 },
    'Belgium': { lat: 50.8503, lng: 4.3517 },
    'Croatia': { lat: 45.1000, lng: 15.2000 },
    'Czechia': { lat: 49.8175, lng: 15.4730 },
    'Estonia': { lat: 58.5953, lng: 25.0136 },
    'Finland': { lat: 61.9241, lng: 25.7482 },
    'France': { lat: 46.2276, lng: 2.2137 },
    'Germany': { lat: 51.1657, lng: 10.4515 },
    'Greece': { lat: 39.0742, lng: 21.8243 },
    'Hungary': { lat: 47.1625, lng: 19.5033 },
    'Italy': { lat: 41.8719, lng: 12.5674 },
    'Norway': { lat: 60.4720, lng: 8.4689 },
    'Poland': { lat: 51.9194, lng: 19.1451 },
    'Portugal': { lat: 39.3999, lng: -8.2245 },
    'Serbia': { lat: 44.0165, lng: 21.0059 },
    'Slovakia': { lat: 48.6690, lng: 19.6990 },
    'Slovenia': { lat: 46.1512, lng: 14.9955 },
    'Spain': { lat: 40.4637, lng: -3.7492 },
    'Sweden': { lat: 60.1282, lng: 18.6435 },
    'Ukraine': { lat: 48.3794, lng: 31.1656 },
    'United Kingdom': { lat: 55.3781, lng: -3.4360 },
    'Brazil': { lat: -14.2350, lng: -51.9253 },
    'Canada': { lat: 56.1304, lng: -106.3468 },
    'Puerto Rico': { lat: 18.2208, lng: -66.5901 },
    'United States': { lat: 37.0902, lng: -95.7129 },
    'South Africa': { lat: -30.5595, lng: 22.9375 },
    'China': { lat: 35.8617, lng: 104.1954 },
    'Hong Kong': { lat: 22.3193, lng: 114.1694 },
    'India': { lat: 20.5937, lng: 78.9629 },
    'Japan': { lat: 36.2048, lng: 138.2529 },
    'Korea (Republic of)': { lat: 35.9078, lng: 127.7669 },
    'Saudi Arabia': { lat: 23.8859, lng: 45.0792 },
    'Taiwan': { lat: 23.6978, lng: 120.9605 },
    'Turkey': { lat: 38.9637, lng: 35.2433 },
    'Australia': { lat: -25.2744, lng: 133.7751 }
};


// Country → Region mapping
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

const validatePaginationParams = (page, limit) => {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (isNaN(pageNum)) {
        throw new AppError('INVALID_FILTER', { 
            details: `Invalid page parameter: ${page}. Must be a number`,
            statusCode: 400
        });
    }
    
    if (pageNum < 1) {
        throw new AppError('INVALID_FILTER', { 
            details: `Page must be ≥ 1 (received: ${pageNum})`,
            statusCode: 400
        });
    }
    
    if (isNaN(limitNum)) {
        throw new AppError('INVALID_FILTER', { 
            details: `Invalid limit parameter: ${limit}. Must be a number`,
            statusCode: 400
        });
    }
    
    if (limitNum < 1) {
        throw new AppError('INVALID_FILTER', { 
            details: `Limit must be ≥ 1 (received: ${limitNum})`,
            statusCode: 400
        });
    }

    const MAX_LIMIT = 1000;
    if (limitNum > MAX_LIMIT) {
        throw new AppError('INVALID_FILTER', {
            details: `Limit cannot exceed ${MAX_LIMIT}`,
            statusCode: 400
        });
    }
    
    return { pageNum, limitNum };
};

const validateSortParams = (sortBy, sortOrder) => {
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
    
    return { 
        sortBy: validatedSortBy, 
        sortOrder: validatedSortOrder 
    };
};

// Helper function for percentiles
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

// Create histogram bins
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

// Load trial data with cache
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

// Load trial selections
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

// Save selections to file
const saveSelectionsToFile = (selections) => {
    try {
        fs.writeFileSync(selectionsPath, JSON.stringify(Array.from(selections)));
    } catch (error) {
        throw new AppError('DATA_LOAD', error);
    }
};

// Process each trial (fixing enrollmentment typo)
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

// Validate trial structure
const validateTrial = (trial) => {
    const requiredFields = ['nctId', 'similarity_score', 'phases', 'locations', 'sponsorType'];
    return requiredFields.every(field => trial[field] !== undefined);
};

// Trial selections (in-memory + file)
let selectedTrials = loadSelections();

// Add selection status to trial data
const addSelectionStatus = (trials) => {
    return trials.map(trial => ({
        ...trial,
        isSelected: selectedTrials.has(trial.nctId)
    }));
};

// controllers/trialsController.js
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

    // Validate parameters
    const { pageNum, limitNum } = validatePaginationParams(page, limit);
    const { sortBy: validatedSortBy, sortOrder: validatedSortOrder } = validateSortParams(sortBy, sortOrder);
    
    // Validate score range
    const minScoreNum = parseFloat(minScore);
    const maxScoreNum = parseFloat(maxScore);
    if (isNaN(minScoreNum)) {
      throw new AppError('INVALID_FILTER', { details: 'Minimum score must be a number' });
    }
    if (isNaN(maxScoreNum)) {
      throw new AppError('INVALID_FILTER', { details: 'Maximum score must be a number' });
    }
    if (minScoreNum > maxScoreNum) {
      throw new AppError('INVALID_FILTER', { details: 'Minimum score cannot be greater than maximum score' });
    }

    let data = loadDataWithCache();

    // Apply basic filtering
    let filteredData = data.filter(trial => {
      // Score range filter
      const scoreMatch = trial.similarity_score >= minScoreNum && trial.similarity_score <= maxScoreNum;
      
      // Search filter (case-insensitive)
      const searchLower = search.toLowerCase();
      const searchMatch = 
        trial.nctId.toLowerCase().includes(searchLower) ||
        (trial.sponsorType && trial.sponsorType.toLowerCase().includes(searchLower)) ||
        (trial.locations && trial.locations.some(loc => 
          loc && loc.toLowerCase().includes(searchLower)
        ));

      return scoreMatch && searchMatch;
    });

    // Sorting
    filteredData.sort((a, b) => {
      // Handle different sort fields
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

      // Handle null/undefined values
      if (valA == null) return 1;
      if (valB == null) return -1;
      
      // Handle different value types
      if (typeof valA === 'string' && typeof valB === 'string') {
        return validatedSortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      
      // Numeric comparison
      return validatedSortOrder === 'asc' 
        ? valA - valB 
        : valB - valA;
    });

    // Pagination
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limitNum);
    const paginatedData = filteredData.slice(
      (pageNum - 1) * limitNum,
      pageNum * limitNum
    );

    // Add selection status
    const enrichedData = addSelectionStatus(paginatedData);

    // Calculate summary stats
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

// Helper functions
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

// Get trial by ID
const getTrialById = (req, res) => {
    try {
        const data = loadDataWithCache();
        const trialId = req.params.id;
        
        // Normalize the ID by removing any non-alphanumeric characters and uppercase
        const normalizedId = trialId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const trial = data.find(t => {
            const trialIdNormalized = t.nctId?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            return trialIdNormalized === normalizedId;
        });

        if (!trial) {
            throw new AppError('TRIAL_NOT_FOUND');
        }

        res.status(200).json({ 
            success: true, 
            data: addSelectionStatus([trial])[0] 
        });
    } catch (error) {
        handleError(error, res);
    }
};

// Filter trials by criteria
const filterTrials = (req, res) => {
    try {
        const {
            phase, location, similarity_score, sponsor,
            startDate, endDate, hasResults,
            page = 1, limit = 10, sortBy, sortOrder = 'asc'
        } = req.query;
        const data = loadDataWithCache();

        console.log('Filter parameters:', req.query); // Debug logging

        let filtered = [...data];

        // Apply filters
        if (similarity_score) {
            const minScore = Number(similarity_score);
            if (!isNaN(minScore)) {
                filtered = filtered.filter(t => t.similarity_score >= minScore);
            }
        }

        if (phase) {
            const phaseUpper = phase.toUpperCase();
            console.log('Phase filter:', { input: phase, normalized: phaseUpper }); // Debug
            
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
            
            console.log('Post-phase filter count:', filtered.length); // Debug
        }

        if (location) {
            const locationLower = location.toLowerCase();
            filtered = filtered.filter(trial =>
                trial.locations.some(loc => loc?.toLowerCase() === locationLower)
            );
        }

        if (sponsor) {
            const sponsorLower = sponsor.toLowerCase();
            filtered = filtered.filter(t =>
                t.sponsorType?.toLowerCase().includes(sponsorLower)
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

        // Sorting
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

        // Pagination
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

// Score View Data
const getScoreViewData = (req, res) => {
    try {
        const data = loadDataWithCache();
        
        // Sort by similarity score (descending)
        const sortedData = [...data].sort((a, b) => b.similarity_score - a.similarity_score);
        
        // Add selection status
        const dataWithSelection = addSelectionStatus(sortedData);

        // Score analysis metrics
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

// Dashboard data
const getDashboardData = (req, res) => {
    try {
        const data = loadDataWithCache();

        // Enhanced geographic data
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

        const dashboardData = {
            phases: data.reduce((acc, t) => {
                t.phases.forEach(p => { acc[p] = (acc[p] || 0) + 1 });
                return acc;
            }, {}),
            regions: Object.entries(
                geographicData.reduce((acc, {region, count}) => {
                    acc[region] = (acc[region] || 0) + count;
                    return acc;
                }, {})
            ).map(([name, count]) => ({ name, count })),
            results: {
                hasResults: data.filter(t => t.hasResults).length,
                noResults: data.filter(t => !t.hasResults).length
            },
            sponsors: data.reduce((acc, t) => {
                acc[t.sponsorType] = (acc[t.sponsorType] || 0) + 1;
                return acc;
            }, {}),
            similarityDistribution: createBins(data.map(t => t.similarity_score), 5),
            enrollmentDistribution: createBins(data.map(t => t.enrollmentCount).filter(e => e > 0), 50),
            eligibilityDistribution: {
                studyDuration: createBins(data.map(t => t.eligibilityValues.studyDuration), 10),
                locations: createBins(data.map(t => t.eligibilityValues.locations), 10),
                enrollment: createBins(data.map(t => t.eligibilityValues.enrollment), 10),
                countries: createBins(data.map(t => t.eligibilityValues.countries), 5)
            },
            geographicDistribution: {
                countries: geographicData,
                regions: Object.entries(
                    geographicData.reduce((acc, {region, count}) => {
                        acc[region] = (acc[region] || 0) + count;
                        return acc;
                    }, {})
                ).map(([name, count]) => ({ name, count }))
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

// Eligibility field distribution
const getEligibilityDistribution = (req, res) => {
    try {
        const { field } = req.params;
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

// Save selections
const saveSelections = (req, res) => {
    try {
        const { trialIds } = req.body;
        if (!Array.isArray(trialIds)) {
            throw new AppError('INVALID_SELECTION');
        }

        const validIds = new Set(loadDataWithCache().map(t => t.nctId));
        selectedTrials = new Set(trialIds.filter(id => validIds.has(id)));

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

// Get selections
const getSelections = (req, res) => {
    res.json({ 
        success: true, 
        data: Array.from(selectedTrials),
        count: selectedTrials.size
    });
};

// Export controllers
module.exports = {
    getAllTrials,
    getTrialById,
    filterTrials,
    getDashboardData,
    getScoreViewData,
    getEligibilityDistribution,
    saveSelections,
    getSelections
};
