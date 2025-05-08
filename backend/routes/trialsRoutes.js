const express = require('express');
const { getAllTrials, getTrialById, filterTrials } = require('../controllers/trialsController');
const router = express.Router();

// Define routes
router.get('/', getAllTrials);
router.get('/:id', getTrialById);
router.get('/filter', filterTrials);

module.exports = router;
