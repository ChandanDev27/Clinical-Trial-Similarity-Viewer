const express = require('express');
const router = express.Router();
const trialsController = require('../controllers/trialsController');

router.get('/', trialsController.getAllTrials);
router.get('/filter', trialsController.filterTrials);
router.get('/:id', trialsController.getTrialById);

module.exports = router;
