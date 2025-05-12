const API_BASE = '/api/trials';

export const fetchTrials = async (page = 1, limit = 10, filters = {}) => {
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
