const fs = require('fs');
const path = require('path');

// Utility: Load JSON data safely
const loadSampleData = () => {
    try {
        const dataPath = path.join(__dirname, '../data/sample-data.json');
        const jsonData = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Failed to load or parse sample data:', error);
        return [];
    }
};

// Get all clinical trials
exports.getAllTrials = (req, res) => {
    try {
        const data = loadSampleData();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error loading data' });
    }
};

// Get a clinical trial by ID (nctId)
exports.getTrialById = (req, res) => {
    try {
        const data = loadSampleData();
        const trialId = req.params.id;
        const trial = data.find(t => t.nctId === trialId);
        if (trial) {
            res.status(200).json(trial);
        } else {
            res.status(404).json({ message: 'Trial not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error loading data' });
    }
};

// Filter trials by phase and/or location
exports.filterTrials = (req, res) => {
    try {
        const data = loadSampleData();
        const { phase, location } = req.query;

        let filtered = data;

        if (phase) {
            const phaseNormalized = phase.toLowerCase();
            filtered = filtered.filter(trial =>
                Array.isArray(trial.phases) &&
                trial.phases.some(p => p.toLowerCase() === phaseNormalized)
            );
        }

        if (location) {
            const locationNormalized = location.toLowerCase();
            filtered = filtered.filter(trial =>
                Array.isArray(trial.locations) &&
                trial.locations.some(loc => loc.toLowerCase() === locationNormalized)
            );
        }

        res.status(200).json(filtered);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering data' });
    }
};
