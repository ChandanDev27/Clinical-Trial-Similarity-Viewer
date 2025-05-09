const express = require('express');
const router = express.Router();
const {
  getAllTrials,
  getTrialById,
  filterTrials,
  getDashboardData,
  getScoreViewData,
  getEligibilityDistribution,
  saveSelections,
  getSelections
} = require('../controllers/trialsController');

// Filter routes (handle with and without trailing slash)
router.get(['/filter', '/filter/'], filterTrials);
router.get('/', getAllTrials);
router.get('/test', (req, res) => {
  res.json({ message: 'Route test successful' });
});
router.get('/dashboard', getDashboardData);
router.get('/score-view', getScoreViewData);
router.get('/eligibility/:field', getEligibilityDistribution);
router.get('/selections', getSelections);
router.post('/selections', saveSelections);
router.get('/:id', getTrialById);

module.exports = router;
