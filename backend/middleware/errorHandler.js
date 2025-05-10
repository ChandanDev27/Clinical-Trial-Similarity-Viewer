const { AppError, errorMessages } = require('../utils/errorUtils');

const errorHandler = (err, req, res, next) => {

    const errorCode = err.code || 'UNKNOWN_ERROR';

    // Build response - PRESERVE THE ORIGINAL CODE
    const response = {
        success: false,
        code: errorCode,
        message: err.message || 'Internal Server Error'
    };

    // Add details if they exist
    if (err.details) {
        response.details = err.details;
    }

    // Development only fields
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
        if (!err.isOperational) {
            response.internalError = {
                name: err.name,
                message: err.message,
                stack: err.stack
            };
        }
    }

    // Special case for empty filter results
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

    // Determine status code
    const statusCode = err.statusCode || 
                      (errorMessages[errorCode] && errorMessages[errorCode].statusCode) || 
                      500;

    // 8. Send response
    res.status(statusCode).json(response);
};

module.exports = errorHandler;
