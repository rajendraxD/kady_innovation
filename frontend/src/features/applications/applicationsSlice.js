import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { applicationApi } from '../../api/applicationApi';

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (params, { rejectWithValue }) => {
    try {
      const res = await applicationApi.getApplications(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch applications');
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    items: [],
    pagination: { total: 0, page: 1, pages: 1 },
    selectedApplication: null,
    drawerOpen: false,
    loading: false,
    error: null
  },
  reducers: {
    setSelectedApplication: (state, action) => {
      state.selectedApplication = action.payload;
      state.drawerOpen = !!action.payload;
    },
    closeDrawer: (state) => {
      state.drawerOpen = false;
      state.selectedApplication = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.items = action.payload.applications;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedApplication, closeDrawer } = applicationsSlice.actions;
export default applicationsSlice.reducer;
