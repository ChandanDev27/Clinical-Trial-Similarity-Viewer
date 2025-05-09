const { AppError } = require('../utils/errorUtils');

const validateQueryParams = (req, res, next) => {
    const { 
        page = 1, 
        limit = 10,
        minScore = 0,
        maxScore = 100,
        threshold = 0.85
    } = req.query;
    
    // Validate pagination
    if (isNaN(page) || !Number.isInteger(Number(page))) {
        throw new AppError('INVALID_PAGE', {
            message: 'Page must be an integer ≥ 1',
            statusCode: 400
        });
    }
    
    if (isNaN(parseInt(page))) {
        throw new AppError('INVALID_PAGE', {
            message: 'Page must be a number ≥ 1',
            statusCode: 400
        });
    }
    
    if (isNaN(parseInt(limit))) {
        throw new AppError('INVALID_LIMIT', {
            message: 'Limit must be a number ≥ 1',
            statusCode: 400
        });
    }

    if (parseInt(page) < 1) {
        throw new AppError('INVALID_PAGE', {
            message: 'Page must be ≥ 1',
            statusCode: 400
        });
    }

    if (parseInt(limit) < 1) {
        throw new AppError('INVALID_LIMIT', {
            message: 'Limit must be ≥ 1',
            statusCode: 400
        });
    }

    // Validate score ranges
    if (isNaN(parseFloat(minScore))) {
        throw new AppError('INVALID_SCORE', {
            message: 'Minimum score must be a number',
            statusCode: 400
        });
    }

    if (isNaN(parseFloat(maxScore))) {
        throw new AppError('INVALID_SCORE', {
            message: 'Maximum score must be a number',
            statusCode: 400
        });
    }

    if (parseFloat(minScore) > parseFloat(maxScore)) {
        throw new AppError('INVALID_SCORE_RANGE', {
            message: 'Minimum score cannot be greater than maximum score',
            statusCode: 400
        });
    }

    // Validate similarity threshold
    if (isNaN(parseFloat(threshold))) {
        throw new AppError('INVALID_THRESHOLD', {
            message: 'Similarity threshold must be a number between 0 and 1',
            statusCode: 400
        });
    }

    if (parseFloat(threshold) < 0 || parseFloat(threshold) > 1) {
        throw new AppError('INVALID_THRESHOLD', {
            message: 'Similarity threshold must be between 0 and 1',
            statusCode: 400
        });
    }

    next();
};

const validateTrialId = (req, res, next) => {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
        throw new AppError('INVALID_TRIAL_ID', {
            message: 'Trial ID must be a valid string',
            statusCode: 400
        });
    }
    next();
};

const validateEligibilityField = (req, res, next) => {
    const validFields = [
        'studyDuration',
        'locations',
        'enrollment',
        'countries',
        'timeline',
        'pregnant',
        'age',
        'egfr',
        'hbac',
        'bmi'
    ];
    
    if (!validFields.includes(req.params.field)) {
        throw new AppError('INVALID_ELIGIBILITY_FIELD', {
            message: `Invalid eligibility field. Must be one of: ${validFields.join(', ')}`,
            statusCode: 400
        });
    }
    next();
};

module.exports = {
    validateQueryParams,
    validateTrialId,
    validateEligibilityField
};
