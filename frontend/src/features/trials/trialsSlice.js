import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTrials as fetchTrialsAPI } from '../../services/api';

// Fetch trials asynchronously
export const fetchTrials = createAsyncThunk(
  'trials/fetchTrials',
  async () => {
    const response = await fetchTrialsAPI();
    console.log("Fetched Trials:", response.data);
    return response.data;
  }
);

// Load selected trials from localStorage
const loadSelectedTrials = () => {
  try {
    const storedTrials = localStorage.getItem('selectedTrials');
    return storedTrials ? JSON.parse(storedTrials) : [];
  } catch (error) {
    console.error('Failed to parse selected trials from localStorage', error);
    return [];
  }
};

// Save selected trials to localStorage
const saveSelectedTrials = (selectedTrials) => {
  try {
    localStorage.setItem('selectedTrials', JSON.stringify(selectedTrials));
  } catch (error) {
    console.error('Failed to save selected trials to localStorage', error);
  }
};

const trialsSlice = createSlice({
  name: 'trials',
  initialState: {
    trials: [],
    selectedTrials: loadSelectedTrials(),
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    selectTrial: (state, action) => {
      if (!state.selectedTrials.includes(action.payload)) {
        state.selectedTrials = [...state.selectedTrials, action.payload];
        saveSelectedTrials(state.selectedTrials);
      }
    },
    deselectTrial: (state, action) => {
      state.selectedTrials = state.selectedTrials.filter(id => id !== action.payload);
      saveSelectedTrials(state.selectedTrials);
    },
    toggleTrialSelection: (state, action) => {
      const trialId = action.payload;
      if (state.selectedTrials.includes(trialId)) {
        state.selectedTrials = state.selectedTrials.filter(id => id !== trialId);
      } else {
        state.selectedTrials = [...state.selectedTrials, trialId];
      }
      saveSelectedTrials(state.selectedTrials);
    },
    clearSelectedTrials: (state) => {
      state.selectedTrials = [];
      localStorage.removeItem('selectedTrials');
    },
    selectAllTrials: (state, action) => {
      const trialIds = action.payload;
      if (state.selectedTrials.length === trialIds.length) {
        state.selectedTrials = [];
      } else {
        state.selectedTrials = [...new Set([...state.selectedTrials, ...trialIds])];
      }
      saveSelectedTrials(state.selectedTrials);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrials.fulfilled, (state, action) => {
        console.log("Payload from API:", action.payload);
        state.loading = false;
        state.trials = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchTrials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { 
  selectTrial, 
  deselectTrial, 
  clearSelectedTrials,
  toggleTrialSelection,
  selectAllTrials
} = trialsSlice.actions;

// Selectors
export const selectAllTrialsData = (state) => state.trials.trials;
export const selectSelectedTrials = (state) => state.trials.selectedTrials;
export const selectFilteredTrials = (state) => {
  const { trials, selectedTrials } = state.trials;
  return selectedTrials.length > 0 
    ? trials.filter(trial => selectedTrials.includes(trial.nctId))
    : trials;
};
export const selectTrialsLoading = (state) => state.trials.loading;
export const selectTrialsError = (state) => state.trials.error;

export default trialsSlice.reducer;
