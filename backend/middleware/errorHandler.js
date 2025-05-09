const { AppError } = require('../utils/errorUtils');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Special case: Filter routes should never return errors for empty results
    if (req.originalUrl.includes('/filter')) {
        return res.status(200).json({
            success: true,
            data: [],
            meta: {
                total: 0,
                page: Math.max(1, parseInt(req.query.page || 1)),
                limit: Math.max(1, parseInt(req.query.limit || 10)),
                totalPages: 0
            }
        });
    }

    // Existing error handling
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            errors: err.errors
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            code: err.code,
            message: err.message,
            ...(process.env.NODE_ENV === 'development' && {
                details: err.details,
                stack: err.stack
            })
        });
    }

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message, stack: err.stack })
    });
};
const validateQueryParams = (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    
    if (isNaN(parseInt(page))) {
        return res.status(400).json({
            success: false,
            code: 'INVALID_PAGE',
            message: 'Page must be a number ≥ 1'
        });
    }
    
    if (isNaN(parseInt(limit))) {
        return res.status(400).json({
            success: false,
            code: 'INVALID_LIMIT',
            message: 'Limit must be a number ≥ 1'
        });
    }
    
    next();
};

router.get('/', validateQueryParams, getAllTrials);

module.exports = errorHandler;
