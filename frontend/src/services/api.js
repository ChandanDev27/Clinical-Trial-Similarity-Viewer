const API_BASE = '/api/trials';

// Basic trial operations
export const fetchTrials = async (page = 1, limit = 20, filters = {}) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...filters
  }).toString();

  const response = await fetch(`${API_BASE}?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch trials');
  }
  return response.json();
};

export const fetchTrialById = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch trial');
  }
  return response.json();
};

// Filter endpoints
export const fetchFilteredTrials = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_BASE}/filter?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch filtered trials');
  }
  return response.json();
};

// Special views
export const fetchScoreViewData = async () => {
  const response = await fetch(`${API_BASE}/score-view`);
  if (!response.ok) {
    throw new Error('Failed to fetch score view data');
  }
  return response.json();
};

export const fetchDashboardData = async () => {
  const response = await fetch(`${API_BASE}/dashboard`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return response.json();
};

export const fetchSimilarTrials = async (threshold = 0.8) => {
  const response = await fetch(`${API_BASE}/similar-trials?threshold=${threshold}`);
  if (!response.ok) {
    throw new Error('Failed to fetch similar trials');
  }
  return response.json();
};

// Eligibility distributions
export const fetchAgeDistribution = async () => {
  const response = await fetch(`${API_BASE}/eligibility/age`);
  if (!response.ok) {
    throw new Error('Failed to fetch age distribution');
  }
  return response.json();
};

export const fetchBMIDistribution = async () => {
  const response = await fetch(`${API_BASE}/eligibility/bmi`);
  if (!response.ok) {
    throw new Error('Failed to fetch BMI distribution');
  }
  return response.json();
};

export const fetchStudyDurationDistribution = async () => {
  const response = await fetch(`${API_BASE}/eligibility/studyDuration`);
  if (!response.ok) {
    throw new Error('Failed to fetch study duration distribution');
  }
  return response.json();
};

// Selection operations
export const saveSelections = async (trialIds) => {
  const response = await fetch(`${API_BASE}/selections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ trialIds }),
  });
  if (!response.ok) {
    throw new Error('Failed to save selections');
  }
  return response.json();
};

export const fetchSelections = async () => {
  const response = await fetch(`${API_BASE}/selections`);
  if (!response.ok) {
    throw new Error('Failed to fetch selections');
  }
  return response.json();
};

export const clearSelections = async () => {
  const response = await fetch(`${API_BASE}/selections`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ trialIds: [] }),
  });
  if (!response.ok) {
    throw new Error('Failed to clear selections');
  }
  return response.json();
};
  