# Clinical Trial Similarity Viewer

## Setup
1. Install dependencies: `npm install`
2. Start backend: `npm run server`
3. Start frontend: `npm start`

## Features
- List View: Browse and select trials
- Dashboard View: Visualize trial metrics
- Score View: Compare similarity scores

## API Endpoints
- GET /api/trials - Get all trials
- GET /api/trials/filter - Filter trials
- GET /api/trials/dashboard - Get dashboard data

## API Testing with Postman

A Postman collection is provided to help test the backend API.

- File: [`postman/ClinicalTrialViewer.postman_collection.json`](postman/ClinicalTrialViewer.postman_collection.json)
- Base URL: `http://localhost:5000/api/trials`

### How to Use

1. Open [Postman](https://www.postman.com/downloads/).
2. Click **Import** > **File**.
3. Select `ClinicalTrialViewer.postman_collection.json`.
4. Explore and run requests such as:
   - `GET /` — View all trials
   - `GET /:id` — View a trial by NCT ID
   - `GET /filter?phase=PHASE3&location=Canada&page=2&limit=5` — Filtered trials
   - `GET /dashboard` — View analytics dashboard
