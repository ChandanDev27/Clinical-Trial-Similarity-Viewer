const express = require('express');
const { 
    getAllTrials, 
    getTrialById, 
    filterTrials,
    getDashboardData
} = require('../controllers/trialsController');
const router = express.Router();

// REORDERED ROUTES - specific paths first
router.get('/filter', filterTrials);  // This must come first
router.get('/dashboard', getDashboardData);
router.get('/', getAllTrials);
router.get('/:id', getTrialById);    // Parameterized route last

module.exports = router;
