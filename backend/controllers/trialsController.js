const fs = require('fs');
const path = require('path');

let cachedData = null;
let lastModified = null;
const dataPath = path.join(__dirname, '../data/sample-data.json');

// Load data with caching mechanism
const loadDataWithCache = () => {
    try {
        const stats = fs.statSync(dataPath);
        if (!cachedData || stats.mtime > lastModified) {
            const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
            cachedData = rawData.map(processTrial).filter(validateTrial);
            lastModified = stats.mtime;
        }
        return cachedData;
    } catch (error) {
        console.error('Data loading failed:', error);
        return [];
    }
};

// Process trial data with adjustments
const processTrial = (trial) => ({
    ...trial,
    eligibilityValues: {
        ...trial.eligibilityValues,
        enrollment: trial.eligibilityValues.enrollmentment || trial.eligibilityValues.enrollment,
        enrollmentment: undefined
    },
    hasResults: trial.endDate ? new Date(trial.endDate) < new Date() : false
});

// Validate trial entries before use
const validateTrial = (trial) => {
    const requiredFields = ['nctId', 'similarity_score', 'phases', 'locations'];
    return requiredFields.every(field => trial[field] !== undefined);
};

// Mapping countries to their respective regions
const countryToRegion = {
    'Austria': 'Europe', 'Belgium': 'Europe', 'Croatia': 'Europe', 'Czechia': 'Europe',
    'Estonia': 'Europe', 'Finland': 'Europe', 'France': 'Europe', 'Germany': 'Europe',
    'Greece': 'Europe', 'Hungary': 'Europe', 'Italy': 'Europe', 'Norway': 'Europe',
    'Poland': 'Europe', 'Portugal': 'Europe', 'Serbia': 'Europe', 'Slovakia': 'Europe',
    'Slovenia': 'Europe', 'Spain': 'Europe', 'Sweden': 'Europe', 'Ukraine': 'Europe',
    'Brazil': 'Americas', 'Canada': 'Americas', 'Puerto Rico': 'Americas',
    'United States': 'Americas', 'South Africa': 'Americas',
    'China': 'Asia', 'Hong Kong': 'Asia', 'India': 'Asia', 'Japan': 'Asia',
    'Korea, Republic of': 'Asia', 'Saudi Arabia': 'Asia',
    'Unknown': 'Unknown'
};

// Get all clinical trials with pagination
exports.getAllTrials = (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const data = loadDataWithCache();
        
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, parseInt(limit));
        const paginatedData = data.slice((pageNum - 1) * limitNum, pageNum * limitNum);
        
        res.status(200).json({
            success: true,
            total: data.length,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(data.length / limitNum),
            data: paginatedData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error loading data', error: error.message });
    }
};

// Retrieve a clinical trial by ID
exports.getTrialById = (req, res) => {
    try {
        const data = loadDataWithCache();
        const trialId = req.params.id;
        
        const trial = data.find(t => t.nctId && t.nctId.toString().toUpperCase() === trialId.toString().toUpperCase());
        
        trial 
            ? res.status(200).json({ success: true, data: trial })
            : res.status(404).json({ success: false, message: 'Trial not found', requestedId: trialId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error loading data', error: error.message });
    }
};

// Filter clinical trials based on criteria
exports.filterTrials = (req, res) => {
    try {
        const { phase, location, similarity_score, page = 1, limit = 10 } = req.query;
        const data = loadDataWithCache();

        let filtered = [...data];

        if (similarity_score) {
            const minScore = parseInt(similarity_score);
            if (!isNaN(minScore)) filtered = filtered.filter(t => t.similarity_score >= minScore);
        }

        if (phase) {
            const phaseUpper = phase.toUpperCase();
            filtered = filtered.filter(trial => {
                const trialPhases = Array.isArray(trial.phases) ? trial.phases : [trial.phases];
                return trialPhases.some(p => p && p.toUpperCase() === phaseUpper);
            });
        }

        if (location) {
            const locationLower = location.toLowerCase();
            filtered = filtered.filter(trial => trial.locations.some(loc => loc && loc.toLowerCase() === locationLower));
        }

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, parseInt(limit));
        const paginated = filtered.slice((pageNum-1)*limitNum, pageNum*limitNum);

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
        res.status(500).json({ success: false, message: 'Filtering failed', error: error.message });
    }
};

// Generate aggregated data for dashboard analytics
exports.getDashboardData = (req, res) => {
    try {
        const data = loadDataWithCache();

        const dashboardData = {
            phases: data.reduce((acc, t) => {
                t.phases.forEach(p => { acc[p] = (acc[p] || 0) + 1 });
                return acc;
            }, {}),
            regions: data.flatMap(t => t.locations)
                .map(l => countryToRegion[l] || 'Unknown')
                .reduce((acc, r) => {
                    acc[r] = (acc[r] || 0) + 1;
                    return acc;
                }, {}),
            results: {
                hasResults: data.filter(t => t.hasResults).length,
                noResults: data.filter(t => !t.hasResults).length
            },
            sponsors: data.reduce((acc, t) => {
                acc[t.sponsorType] = (acc[t.sponsorType] || 0) + 1;
                return acc;
            }, {})
        };

        res.json({ success: true, data: dashboardData });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Dashboard generation failed', error: error.message });
    }
};

let selectedTrials = new Set();

// Save selected trials
exports.saveSelections = (req, res) => {
    try {
        const { trialIds } = req.body;
        if (!Array.isArray(trialIds)) throw new Error('Invalid trial IDs format');
        
        const validIds = new Set(loadDataWithCache().map(t => t.nctId));
        selectedTrials = new Set(trialIds.filter(id => validIds.has(id)));

        res.json({ success: true, selectedCount: selectedTrials.size });

    } catch (error) {
        res.status(400).json({ success: false, message: 'Selection update failed', error: error.message });
    }
};

// Retrieve saved trial selections
exports.getSelections = (req, res) => {
    res.json({ success: true, data: Array.from(selectedTrials) });
};
