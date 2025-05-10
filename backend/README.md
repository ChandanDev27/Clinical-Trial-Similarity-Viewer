# Clinical Trial Similarity Viewer - Backend Service

## Overview

The Clinical Trial Similarity Viewer is a full-stack application designed to help medical researchers analyze and compare clinical trial data. This backend service provides the API layer that powers the frontend interface, handling data retrieval, filtering, and analysis of clinical trial information.

**Key Features:**
- Comprehensive clinical trial data management
- Advanced filtering and sorting capabilities
- Statistical analysis of trial similarity scores
- Geographic distribution visualization
- Eligibility criteria distribution analysis
- User selection persistence across sessions

## Tech Stack

- **Runtime**: Node.js (v14+ recommended)
- **Framework**: Express.js
- **Data Storage**: Local JSON file (`sample-data.json`)
- **Middleware**: CORS, JSON parsing, custom logging/error handling
- **Development Tools**: Postman (for API testing)

## Architecture

The backend follows a modular MVC architecture:

```
backend/
├── controllers/        # Business logic
├── middleware/         # Request processing
├── routes/             # API endpoints
├── utils/              # Shared utilities
├── data/               # JSON data files
└── server.js           # Application entry point
```

## Installation & Setup

1. **Prerequisites**:
   - Node.js (v14 or later)
   - npm/yarn

2. **Install dependencies**:
   ```bash
   npm install express cors dotenv
   ```

3. **Configuration**:
   - Create a `.env` file in the root directory:
     ```
     PORT=5000
     NODE_ENV=development
     ```

4. **Running the server**:
   ```bash
   node server.js
   ```
   The server will start on `http://localhost:5000`

## API Documentation

### Base URL
`http://localhost:5000/api/trials`

### Core Endpoints

#### 1. Get All Trials (Paginated)
```
GET /
```
**Parameters**:
- `page` (default: 1)
- `limit` (default: 10)
- `sortBy` (e.g., 'similarity_score')
- `sortOrder` ('asc' or 'desc')
- `search` (string filter)
- `minScore`/`maxScore` (score range filter)

**Example**:
```bash
curl "http://localhost:5000/api/trials?page=2&limit=5&sortBy=similarity_score&sortOrder=desc"
```

#### 2. Filter Trials
```
GET /filter
```
**Filter Parameters**:
- `phase` (e.g., 'PHASE3')
- `location` (country name)
- `sponsor` (sponsor name)
- `startDate`/`endDate` (date range)
- `hasResults` (boolean)

**Example**:
```bash
curl "http://localhost:5000/api/trials/filter?phase=PHASE3&location=Canada&sponsor=Novartis"
```

#### 3. Dashboard Data
```
GET /dashboard
```
Returns aggregated statistics for visualization including:
- Phase distribution
- Geographic distribution
- Eligibility criteria breakdown
- Similarity score distribution

#### 4. Score Analysis
```
GET /score-view
```
Provides similarity score distribution statistics with:
- Average, min, max scores
- Percentiles (25th, 50th, 75th)
- Histogram bins for visualization

#### 5. Trial Selections
```
POST /selections
```
**Request Body**:
```json
{
  "trialIds": ["NCT06065540", "NCT06065541"]
}
```
Persists user selections across sessions.

### Response Format

Successful responses follow this structure:
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "total": 100,
    "page": 2,
    "limit": 10,
    "totalPages": 10
  }
}
```

## Key Implementation Details

### Data Processing
- **Caching**: Trial data is cached after first load with file modification checks
- **Normalization**: Data is cleaned and normalized on load (e.g., fixing field name inconsistencies)
- **Validation**: Comprehensive input sanitization and validation

### Performance Optimizations
- Efficient pagination handling
- Pre-calculated statistics for dashboard views
- Smart sorting algorithms that handle edge cases

### Error Handling
- Custom error classes (`AppError`) with detailed error codes
- Development/production mode differentiation
- Graceful handling of empty filter results

### Geographic Features
- Country-to-region mapping
- Coordinate data for map visualization
- Region-based color coding

## Design Considerations

1. **State Management**:
   - User selections are persisted to a JSON file rather than using session storage
   - This allows selections to persist across server restarts

2. **Similarity Analysis**:
   - Implemented custom similarity grouping algorithm
   - Threshold-based clustering of similar trials
   - Representative trial selection for group summaries

3. **Filtering System**:
   - Supports complex multi-parameter filtering
   - Handles partial matches and case insensitivity
   - Returns available filter options with results

## Development Notes

- The Postman collection (`Clinical Trial Similarity Viewer.postman_collection.json`) provides ready-to-use API examples
- All routes are CORS-enabled for frontend development
- Extensive logging middleware helps with debugging

## Future Enhancements

1. Add database integration (MongoDB/PostgreSQL)
2. Implement user authentication
3. Add more advanced similarity algorithms
4. Support for larger datasets with streaming

## Troubleshooting

Common issues:
- **Data not loading**: Verify `sample-data.json` exists in `/data` directory
- **CORS errors**: Ensure frontend origin is allowed
- **Filter issues**: Check parameter formatting (dates should be YYYY-MM-DD)

For additional support, please review the server logs or contact the development team.