import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { fetchTrials as fetchTrialsAPI, saveSelections as saveSelectionsAPI, fetchSelections as fetchSelectionsAPI } from '../../services/api';
import getCountryCoordinates from '../../utils/countryCoordinates';
import { getCountryToRegionMapping } from '../../utils/dataUtils';

const processRegionalData = (trials) => {
  const countryCounts = {};
  
  trials.forEach(trial => {
    if (!trial.locations || trial.locations.length === 0) {
      countryCounts['Unknown'] = (countryCounts['Unknown'] || 0) + 1;
      return;
    }

    trial.locations?.forEach(location => {
      const country = typeof location === 'string' ? location : (location.country || 'Unknown');
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
  });

  return Object.entries(countryCounts).map(([country, count]) => {
    const coordinates = getCountryCoordinates(country) || { lat: 20, lng: 0 };
    return {
      country,
      count,
      coordinates,
      region: getCountryToRegionMapping()[country] || 'Unknown'
    };
  });
};

// Async Thunks
export const fetchTrials = createAsyncThunk('trials/fetchTrials', async () => {
  const response = await fetchTrialsAPI();
  return response.data;
});

export const fetchSelections = createAsyncThunk('trials/fetchSelections', async () => {
  const response = await fetchSelectionsAPI();
  return response.trials || [];
});

export const toggleTrialSelection = createAsyncThunk(
  'trials/toggleTrialSelection',
  async (trialId, { dispatch, getState }) => {
    dispatch(trialsSlice.actions._toggleTrialSelection(trialId));
    const { selectedTrials } = getState().trials;
    await saveSelectionsAPI(selectedTrials);
  }
);

export const selectAllTrials = createAsyncThunk(
  'trials/selectAllTrials',
  async (trialIds, { dispatch }) => {
    dispatch(trialsSlice.actions._selectAllTrials(trialIds));
    await saveSelectionsAPI(trialIds);
  }
);

export const clearSelectedTrials = createAsyncThunk(
  'trials/clearSelectedTrials',
  async (_, { dispatch }) => {
    dispatch(trialsSlice.actions._clearSelectedTrials());
    await saveSelectionsAPI([]);
  }
);

const trialsSlice = createSlice({
  name: 'trials',
  initialState: {
    trials: [],
    selectedTrials: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    _toggleTrialSelection: (state, action) => {
      const trialId = action.payload;
      const index = state.selectedTrials.indexOf(trialId);
      if (index !== -1) {
        state.selectedTrials.splice(index, 1);
      } else {
        state.selectedTrials.push(trialId);
      }
    },
    _selectAllTrials: (state, action) => {
      state.selectedTrials = action.payload;
    },
    _clearSelectedTrials: (state) => {
      state.selectedTrials = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrials.fulfilled, (state, action) => {
        state.loading = false;
        state.trials = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchTrials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSelections.fulfilled, (state, action) => {
        state.selectedTrials = action.payload;
      });
  },
});

export const { _toggleTrialSelection, _selectAllTrials, _clearSelectedTrials } = trialsSlice.actions;

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
export const selectMapData = createSelector(
  [selectAllTrialsData, selectSelectedTrials],
  (trials, selectedTrials) => {
    const trialsToProcess = selectedTrials.length > 0
      ? trials.filter(trial => selectedTrials.includes(trial.nctId))
      : trials;
    return processRegionalData(trialsToProcess);
  }
);

export default trialsSlice.reducer;
