const express = require('express');
const cors = require('cors');
const trialsRoutes = require('./routes/trialsRoutes');
const logger = require('./middleware/logger');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(logger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Mount the trials routes
app.use('/api/trials', trialsRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});