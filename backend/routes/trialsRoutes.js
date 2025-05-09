const express = require('express');
const router = express.Router();
const validators = require('../middleware/validators');
const trialsController = require('../controllers/trialsController');

// API Endpoints
router.get(['/filter', '/filter/'], validators.validateQueryParams, trialsController.filterTrials);
router.get('/', validators.validateQueryParams, trialsController.getAllTrials);
router.get('/dashboard', validators.validateQueryParams, trialsController.getDashboardData);
router.get('/score-view', validators.validateQueryParams, trialsController.getScoreViewData);
router.get('/similar-trials', validators.validateQueryParams, trialsController.getSimilarTrials);
router.get('/eligibility/:field', validators.validateEligibilityField, trialsController.getEligibilityDistribution);
router.route('/selections')
  .get(trialsController.getSelections)
  .post(trialsController.saveSelections);
router.get('/:id', validators.validateTrialId, trialsController.getTrialById);

// Test endpoint
router.get('/test', (req, res) => res.json({ message: 'Route test successful' }));

module.exports = router;
