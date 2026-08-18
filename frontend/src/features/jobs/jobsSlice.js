import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobApi } from '../../api/jobApi';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (params, { rejectWithValue }) => {
  try {
    const res = await jobApi.getJobs(params);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message || 'Failed to fetch jobs');
  }
});

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    items: [],
    pagination: { total: 0, page: 1, pages: 1 },
    selectedJob: null,
    loading: false,
    error: null
  },
  reducers: {
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.items = action.payload.jobs;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedJob } = jobsSlice.actions;
export default jobsSlice.reducer;
