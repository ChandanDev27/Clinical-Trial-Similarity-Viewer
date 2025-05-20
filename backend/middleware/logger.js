const fs = require('fs');
const path = require('path');

// Make sure the logs directory exists—otherwise, create it.
// This prevents issues when trying to write logs to a non-existent folder.
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true }); // Creates parent directories if needed
}

// Set up a writable stream to keep a running log of requests.
// 'a' mode means logs are appended rather than overwritten.
const logStream = fs.createWriteStream(
    path.join(logsDir, 'server.log'),
    { flags: 'a' }
);

const logger = (req, res, next) => {
    const start = Date.now(); // Capture when the request starts
    const startTimestamp = new Date().toISOString();
    
    res.on('finish', () => {
        // Calculate how long the request took
        const duration = Date.now() - start;

        // Structure the log entry with useful details
        const logEntry = {
            timestamp_start: startTimestamp,
            timestamp_end: new Date().toISOString(),
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.headers['user-agent'], // Helps track client type
            ip: req.ip, // Useful for debugging client-specific issues
            requestBody: req.body ? JSON.stringify(req.body) : 'N/A' // Logs request body if present
        };

        // Print a simple, readable log statement to the console
        console.log(`${logEntry.timestamp_start} -> ${logEntry.timestamp_end} | ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);

        // Save log entry to a file, handling any errors gracefully
        logStream.write(JSON.stringify(logEntry) + '\n', (err) => {
            if (err) console.error('Oops! Error writing log:', err);
        });
    });

    next(); // Move on to the next middleware or route handler
};

module.exports = logger;
