const { AppError } = require('../utils/errorUtils');

const validateQueryParams = (req, res, next) => {
    try {
        const { 
            page = '1',
            limit = '10',
            minScore = '0',
            maxScore = '100',
            threshold = '0.85'
        } = req.query;
        
        // Convert values to numbers with proper validation
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const minScoreNum = parseFloat(minScore);
        const maxScoreNum = parseFloat(maxScore);
        const thresholdNum = parseFloat(threshold);

        // Validate pagination parameters more thoroughly
        if (isNaN(pageNum)) {
            throw new AppError('INVALID_PAGE', {
                message: 'Page must be a valid integer ≥ 1',
                statusCode: 400,
                details: { received: page }
            });
        }
        
        if (pageNum < 1 || !Number.isInteger(pageNum)) {
            throw new AppError('INVALID_PAGE', {
                message: 'Page must be an integer ≥ 1',
                statusCode: 400,
                details: { received: page }
            });
        }

        if (isNaN(limitNum)) {
            throw new AppError('INVALID_LIMIT', {
                message: 'Limit must be a valid integer ≥ 1',
                statusCode: 400,
                details: { received: limit }
            });
        }

        if (limitNum < 1 || !Number.isInteger(limitNum)) {
            throw new AppError('INVALID_LIMIT', {
                message: 'Limit must be an integer ≥ 1',
                statusCode: 400,
                details: { received: limit }
            });
        }

        // Validate score ranges with better error messages
        if (isNaN(minScoreNum)) {
            throw new AppError('INVALID_SCORE', {
                message: 'Minimum score must be a valid number',
                statusCode: 400,
                details: { received: minScore }
            });
        }

        if (isNaN(maxScoreNum)) {
            throw new AppError('INVALID_SCORE', {
                message: 'Maximum score must be a valid number',
                statusCode: 400,
                details: { received: maxScore }
            });
        }

        if (minScoreNum < 0 || minScoreNum > 100) {
            throw new AppError('INVALID_SCORE', {
                message: 'Minimum score must be between 0 and 100',
                statusCode: 400,
                details: { received: minScore }
            });
        }

        if (maxScoreNum < 0 || maxScoreNum > 100) {
            throw new AppError('INVALID_SCORE', {
                message: 'Maximum score must be between 0 and 100',
                statusCode: 400,
                details: { received: maxScore }
            });
        }

        if (minScoreNum > maxScoreNum) {
            throw new AppError('INVALID_SCORE_RANGE', {
                message: 'Minimum score cannot be greater than maximum score',
                statusCode: 400,
                details: { minScore: minScoreNum, maxScore: maxScoreNum }
            });
        }

        // Validate similarity threshold with more precise checks
        if (isNaN(thresholdNum)) {
            throw new AppError('INVALID_THRESHOLD', {
                message: 'Similarity threshold must be a valid number between 0 and 1',
                statusCode: 400,
                details: { received: threshold }
            });
        }

        if (thresholdNum < 0 || thresholdNum > 1) {
            throw new AppError('INVALID_THRESHOLD', {
                message: 'Similarity threshold must be between 0 and 1 (inclusive)',
                statusCode: 400,
                details: { received: threshold }
            });
        }

        // Assign converted values to request object
        req.query.page = pageNum;
        req.query.limit = limitNum;
        req.query.minScore = minScoreNum;
        req.query.maxScore = maxScoreNum;
        req.query.threshold = thresholdNum;

        next();
    } catch (error) {
        next(error);
    }
};

const validateTrialId = (req, res, next) => {
    try {
        const { id } = req.params;
        
        if (!id || typeof id !== 'string' || id.trim() === '') {
            throw new AppError('INVALID_TRIAL_ID', {
                message: 'Clinical Trial ID is required and must be a non-empty string',
                statusCode: 400,
                details: {
                    example: 'NCT04150042',
                    format: 'Alphanumeric String',
                    received: id
                }
            });
        }

        if (!/^[a-zA-Z0-9]+$/.test(id)) {
            throw new AppError('INVALID_TRIAL_ID', {
                message: 'Invalid Clinical Trial ID format',
                details: {
                    required_format: 'Alphanumeric characters only',
                    example_valid_ids: ['NCT04150042'],
                    received: id
                }
            });
        }
        
        next();
    } catch (error) {
        next(error);
    }
};

const validateEligibilityField = (req, res, next) => {
    try {
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
                statusCode: 400,
                details: { received: req.params.field }
            });
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    validateQueryParams,
    validateTrialId,
    validateEligibilityField
};
