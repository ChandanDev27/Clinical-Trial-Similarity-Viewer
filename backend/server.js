const express = require('express');
const cors = require('cors');
const trialsRoutes = require('./routes/trialsRoutes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

const validateParams = (req, res, next) => {
 
    ['page', 'limit'].forEach(param => {
        if (req.query[param] && isNaN(req.query[param])) {
            return res.status(400).json({
                success: false,
                message: `Invalid ${param} value`
            });
        }
    });
    next();
};

app.use('/api/trials', validateParams, trialsRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
