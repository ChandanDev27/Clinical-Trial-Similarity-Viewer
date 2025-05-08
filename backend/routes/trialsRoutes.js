const express = require('express');
const router = express.Router();
const trialsController = require('../controllers/trialsController');

// Define routes
router.get('/', trialsController.getAllTrials);
router.get('/:id', trialsController.getTrialById);
router.get('/filter', trialsController.filterTrials);

module.exports = router;
