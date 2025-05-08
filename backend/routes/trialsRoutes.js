// trialsRoutes.js (updated)
const express = require('express');
const {
    getAllTrials,
    getTrialById,
    filterTrials,
    getDashboardData,
    saveSelections,
    getSelections
} = require('../controllers/trialsController');

const router = express.Router();

router.get('/filter', filterTrials);
router.get('/dashboard', getDashboardData);
router.post('/selections', saveSelections);
router.get('/selections', getSelections);
router.get('/:id', getTrialById);
router.get('/', getAllTrials);


module.exports = router;
