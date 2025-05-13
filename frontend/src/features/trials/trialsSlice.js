import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTrials as fetchTrialsAPI } from '../../services/api';

// Fetch trials asynchronously
export const fetchTrials = createAsyncThunk(
  'trials/fetchTrials',
  async () => {
    const response = await fetchTrialsAPI();
    return response.data;
  }
);

// Load selected trials from localStorage
const loadSelectedTrials = () => {
  const storedTrials = localStorage.getItem('selectedTrials');
  return storedTrials ? JSON.parse(storedTrials) : [];
};

const trialsSlice = createSlice({
  name: 'trials',
  initialState: {
    trials: [],
    selectedTrials: loadSelectedTrials(),
    loading: false,
    error: null,
  },
  reducers: {
    selectTrial: (state, action) => {
      state.selectedTrials = [...state.selectedTrials, action.payload];
      localStorage.setItem('selectedTrials', JSON.stringify(state.selectedTrials));
    },
    deselectTrial: (state, action) => {
      state.selectedTrials = state.selectedTrials.filter(id => id !== action.payload);
      localStorage.setItem('selectedTrials', JSON.stringify(state.selectedTrials));
    },
    clearSelectedTrials: (state) => {
      state.selectedTrials = [];
      localStorage.removeItem('selectedTrials');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrials.fulfilled, (state, action) => {
        state.loading = false;
        state.trials = action.payload;
      })
      .addCase(fetchTrials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { selectTrial, deselectTrial, clearSelectedTrials } = trialsSlice.actions;
export default trialsSlice.reducer;
