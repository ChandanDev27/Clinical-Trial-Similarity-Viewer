const fs = require('fs');
const path = require('path');

// Load sample data from JSON file
const loadSampleData = () => {
    const dataPath = path.join(__dirname, '../data/sample-data.json');
    const jsonData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(jsonData);
};

// Controller function to get all clinical trials
exports.getAllTrials = (req, res) => {
    try {
        const sampleData = loadSampleData();
        res.json(sampleData);
    } catch (error) {
        console.error('Error loading sample data:', error);
        res.status(500).json({ message: 'Error loading data' });
    }
};

// Controller function to get a specific trial by ID
exports.getTrialById = (req, res) => {
    const trialId = req.params.id;
    const sampleData = loadSampleData();
    const trial = sampleData.find(t => t.nctId === trialId);
    if (trial) {
        res.json(trial);
    } else {
        res.status(404).json({ message: 'Trial not found' });
    }
};

// Controller function to filter trials based on query parameters
exports.filterTrials = (req, res) => {
    const { phase, location } = req.query;
    const sampleData = loadSampleData();
    let filteredTrials = sampleData;

    console.log('Initial Sample Data:', sampleData);

    if (phase) {
        const normalizedPhase = phase.toLowerCase();
        filteredTrials = filteredTrials.filter(trial => 
            Array.isArray(trial.phases) && trial.phases.some(p => p.toLowerCase() === normalizedPhase)
        );
        console.log('Filtered Trials after Phase Filter:', filteredTrials);
    }

    if (location) {
        const normalizedLocation = location.toLowerCase();
        filteredTrials = filteredTrials.filter(trial => 
            Array.isArray(trial.locations) && trial.locations.some(loc => loc.toLowerCase() === normalizedLocation)
        );
        console.log('Filtered Trials after Location Filter:', filteredTrials);
    } 

    console.log('Final Filtered Trials:', filteredTrials);

    res.json(filteredTrials);
};

