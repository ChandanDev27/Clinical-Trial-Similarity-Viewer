const errorMessages = {
    DATA_LOAD: {
        code: 'DATA_LOAD_FAILED',
        message: 'Failed to load trial data. Please try again later.',
        statusCode: 500
    },
    INVALID_TRIAL_ID: {
        code: 'INVALID_TRIAL_ID',
        message: 'Invalid Clinical Trial ID format',
        statusCode: 400
    },
    INVALID_FILTER: {
        code: 'INVALID_FILTER_PARAM',
        message: 'One or more filter parameters are invalid. Check details for specific issues.',
        statusCode: 400
    },
    INVALID_ELIGIBILITY_FIELD: {
        code: 'INVALID_ELIGIBILITY_FIELD',
        message: 'The requested eligibility field does not exist.',
        statusCode: 400
    },
    TRIAL_NOT_FOUND: {
        code: 'TRIAL_NOT_FOUND',
        message: 'The requested trial was not found.',
        statusCode: 404
    },
    INVALID_SELECTION: {
        code: 'INVALID_SELECTION',
        message: 'Invalid trial selection data provided.',
        statusCode: 400
    },
    INVALID_PAGE: {
        code: 'INVALID_PAGE',
        message: 'Invalid page number provided.',
        statusCode: 400
    },
    INVALID_LIMIT: {
        code: 'INVALID_LIMIT',
        message: 'Invalid limit parameter provided.',
        statusCode: 400
    },
    INVALID_SCORE: {
        code: 'INVALID_SCORE',
        message: 'Invalid score parameter provided.',
        statusCode: 400
    },
    INVALID_THRESHOLD: {
        code: 'INVALID_THRESHOLD',
        message: 'Invalid threshold parameter provided.',
        statusCode: 400
    },
    UNKNOWN_ERROR: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred.',
        statusCode: 500
    }
};

class AppError extends Error {
    constructor(errorType, { message, statusCode, details } = {}) {
        const errorInfo = errorMessages[errorType] || errorMessages.UNKNOWN_ERROR;
        
        // Log unhandled error types
        if (!errorMessages[errorType]) {
            console.warn(`Unhandled error type: ${errorType}`);
        }

        super(message || errorInfo.message);
        this.code = errorInfo.code;
        this.statusCode = statusCode || errorInfo.statusCode;
        this.details = details;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const handleError = (err, res) => {
    const statusCode = err.statusCode || 500;
    const response = {
        success: false,
        code: err.code || 'UNKNOWN_ERROR',
        message: err.message || 'An unexpected error occurred'
    };

    // Capture additional debugging information
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
        if (err.details) response.details = err.details;
    }

    // Detect specific system errors
    if (err.code === 'ECONNREFUSED') {
        response.code = 'DATABASE_CONNECTION_FAILED';
        response.message = 'Could not connect to the database';
    }

    res.status(statusCode).json(response);
};

// Improved safe parsing logic for query parameters
const safeParseInt = (value, fallback) => {
    return Number.isInteger(parseInt(value)) ? parseInt(value) : fallback;
};

// Empty filter response handling
const emptyFilterResponse = (req) => ({
    success: true,
    data: [],
    meta: {
        total: 0,
        page: safeParseInt(req.query.page, 1),
        limit: safeParseInt(req.query.limit, 10),
        totalPages: 0
    }
});

module.exports = {
    AppError,
    handleError,
    emptyFilterResponse,
    errorMessages
};
