const { AppError } = require('../utils/errorUtils');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Handle empty filter results specially
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

    // Handle different error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            errors: err.errors
        });
    }

    if (err instanceof AppError) {
        const response = {
            success: false,
            code: err.code,
            message: err.message
        };
        
        if (process.env.NODE_ENV === 'development') {
            response.details = err.details;
            response.stack = err.stack;
        }
        
        return res.status(err.statusCode).json(response);
    }

    // Fallback for unhandled errors
    const response = {
        success: false,
        message: 'Internal Server Error'
    };
    
    if (process.env.NODE_ENV === 'development') {
        response.error = err.message;
        response.stack = err.stack;
    }
    
    res.status(500).json(response);
};

module.exports = errorHandler;
