import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationApi } from '../../api/aiApi';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationApi.getNotifications();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch notifications');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false
  },
  reducers: {
    decrementUnread: (state) => {
      if (state.unreadCount > 0) state.unreadCount -= 1;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.items = action.payload.notifications;
      state.unreadCount = action.payload.unreadCount;
    });
  }
});

export const { decrementUnread } = notificationsSlice.actions;
export default notificationsSlice.reducer;
