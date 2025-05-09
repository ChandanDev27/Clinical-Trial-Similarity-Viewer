const errorMessages = {
    DATA_LOAD: {
        code: 'DATA_LOAD_FAILED',
        message: 'Failed to load trial data. Please try again later.',
        statusCode: 500
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
    UNKNOWN_ERROR: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred.',
        statusCode: 500
    }
};

class AppError extends Error {
    constructor(errorType, details = null) {
        const errorInfo = errorMessages[errorType] || errorMessages.UNKNOWN_ERROR;
        super(errorInfo.message);
        this.code = errorInfo.code;
        this.statusCode = errorInfo.statusCode;
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

    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
        if (err.details) response.details = err.details;
    }

    res.status(statusCode).json(response);
};

const emptyFilterResponse = (req) => ({
    success: true,
    data: [],
    meta: {
        total: 0,
        page: Math.max(1, parseInt(req.query.page || 1)),
        limit: Math.max(1, parseInt(req.query.limit || 10)),
        totalPages: 0
    }
});

module.exports = {
    AppError,
    handleError,
    emptyFilterResponse,
    errorTypes: Object.keys(errorMessages)
};
