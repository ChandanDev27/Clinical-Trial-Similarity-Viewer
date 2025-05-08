const fs = require('fs');
const path = require('path');

// Utility: Load JSON data safely
const loadSampleData = () => {
    try {
        const dataPath = path.join(__dirname, '../data/sample-data.json');
        const jsonData = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(jsonData);
        
        // Fix data consistency issues
        return data.map(trial => ({
            ...trial,
            eligibilityValues: {
                ...trial.eligibilityValues,
                enrollment: trial.eligibilityValues.enrollmentment || trial.eligibilityValues.enrollment,
                // Remove the duplicate enrollmentment field
                ...(trial.eligibilityValues.enrollmentment && { enrollmentment: undefined })
            }
        }));
    } catch (error) {
        console.error('Failed to load or parse sample data:', error);
        return [];
    }
};

// Get all clinical trials with pagination
exports.getAllTrials = (req, res) => {  // Fixed typo in function name (was getAllTrials)
    try {
        const { page = 1, limit = 10 } = req.query;
        const data = loadSampleData();
        
        // Convert and validate pagination parameters
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, parseInt(limit));
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = pageNum * limitNum;
        
        const paginatedData = data.slice(startIndex, endIndex);
        
        res.status(200).json({
            success: true,
            total: data.length,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(data.length / limitNum),
            data: paginatedData
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error loading data', 
            error: error.message 
        });
    }
};

// Get a clinical trial by ID (nctId)
exports.getTrialById = (req, res) => {
    try {
        const data = loadSampleData();
        const trialId = req.params.id;
        
        // Case-insensitive search and handle missing nctId
        const trial = data.find(t => 
            t.nctId && t.nctId.toString().toUpperCase() === trialId.toString().toUpperCase()
        );
        
        if (trial) {
            res.status(200).json({
                success: true,
                data: trial
            });
        } else {
            res.status(404).json({ 
                success: false,
                message: 'Trial not found',
                requestedId: trialId
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error loading data', 
            error: error.message 
        });
    }
};

// Filter trials by phase and/or location with pagination
exports.filterTrials = (req, res) => {
    try {
        const { phase, location, page = 1, limit = 10 } = req.query;
        const data = loadSampleData();

        let filtered = [...data]; // Create a copy to avoid mutating original
        let filterMessages = [];

        // PHASE FILTERING
        if (phase) {
            const phaseUpper = phase.toUpperCase();
            const originalCount = filtered.length;
            
            filtered = filtered.filter(trial => {
                if (!trial.phases) return false;
                
                // Handle both array and string phases
                const trialPhases = Array.isArray(trial.phases) 
                    ? trial.phases 
                    : [trial.phases];
                
                return trialPhases.some(p => 
                    p && p.toUpperCase() === phaseUpper
                );
            });

            if (filtered.length === 0) {
                filterMessages.push(`No trials found for phase: ${phase}`);
            } else if (filtered.length === originalCount) {
                filterMessages.push(`All trials are phase: ${phaseUpper}`);
            }
        }

        // LOCATION FILTERING
        if (location) {
            const locationLower = location.toLowerCase();
            const originalCount = filtered.length;
            
            filtered = filtered.filter(trial => {
                if (!trial.locations) return locationLower === 'unknown';
                
                if (locationLower === 'unknown') {
                    return trial.locations.includes('Unknown') || 
                           trial.locations.length === 0;
                }
                
                return trial.locations.some(loc => 
                    loc && loc.toLowerCase() === locationLower
                );
            });

            if (filtered.length === 0) {
                filterMessages.push(`No trials found for location: ${location}`);
            }
        }

        // PAGINATION
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, parseInt(limit));
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = pageNum * limitNum;
        
        const paginatedData = filtered.slice(
            Math.min(startIndex, filtered.length),
            Math.min(endIndex, filtered.length)
        );

        res.status(200).json({
            success: true,
            total: filtered.length,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(filtered.length / limitNum),
            messages: filterMessages.length ? filterMessages : undefined,
            data: paginatedData
        });

    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error filtering data',
            error: error.message
        });
    }
};

// Get data for dashboard view
exports.getDashboardData = (req, res) => {
    try {
        const data = loadSampleData();
        
        // Aggregate data for dashboard
        const dashboardData = {
            totalTrials: data.length,
            phases: countOccurrences(data.flatMap(t => t.phases || [])),
            locations: countOccurrences(data.flatMap(t => t.locations || []).filter(l => l !== 'Unknown')),
            sponsors: countOccurrences(data.map(t => t.sponsorType || 'Unknown')),
            eligibilityMetrics: aggregateEligibilityMetrics(data),
            lastUpdated: new Date().toISOString()
        };
        
        res.status(200).json({
            success: true,
            data: dashboardData
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error generating dashboard data', 
            error: error.message 
        });
    }
};

// Helper functions
function countOccurrences(items) {
    return items.reduce((acc, item) => {
        if (item !== undefined && item !== null) {
            acc[item] = (acc[item] || 0) + 1;
        }
        return acc;
    }, {});
}

function aggregateEligibilityMetrics(trials) {
    const metrics = {};
    const eligibilityKeys = trials[0]?.eligibilityValues ? Object.keys(trials[0].eligibilityValues) : [];
    
    eligibilityKeys.forEach(key => {
        const values = trials
            .map(trial => trial.eligibilityValues?.[key])
            .filter(val => typeof val === 'number');
            
        if (values.length > 0) {
            metrics[key] = {
                sum: values.reduce((sum, val) => sum + val, 0),
                avg: values.reduce((sum, val) => sum + val, 0) / values.length,
                min: Math.min(...values),
                max: Math.max(...values),
                count: values.length
            };
        }
    });
    
    return metrics;
}
