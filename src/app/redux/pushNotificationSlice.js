import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAdminUserId, getRequest, postRequest, postUpdate } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/pushNotification-constant'
export const fetchPushNotification = createAsyncThunk(
  'notification/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_NOTIFICATION);
      if (!response || !response.data) {
        throw new Error('Invalid Notification data received');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching Notification');
    }
  },
)
export const addPushNotification = createAsyncThunk(
  'notification/add',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.ADD_NOTIFICATION, notificationData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add Notification'
      );
    }
  }
);
export const updatePushNotification = createAsyncThunk(
  'notification/update',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await postUpdate(
        API_ENDPOINTS.UPDATE_NOTIFICATION,
        notificationData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update Notification'
      );
    }
  }
);
export const deletePushNotification = createAsyncThunk(
  'notification/delete',
  async (notificationId, { rejectWithValue }) => {
    try {
      const payload = {
        notificationId,
        updatedBy: getAdminUserId(),
      };
      const response = await postRequest(
        API_ENDPOINTS.DELETE_NOTIFICATION,
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete Notification '
      );
    }
  }
);
const pushNotificationSlice = createSlice({
  name: 'notification',
  initialState: {
    NotificationData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPushNotification.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPushNotification.fulfilled, (state, action) => {
        state.NotificationData = action.payload
        state.loading = false
      })
      .addCase(fetchPushNotification.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
    builder
      .addCase(addPushNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addPushNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Notification added successfully!';
      })
      .addCase(addPushNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
    builder
      .addCase(updatePushNotification.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePushNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Notification updated successfully!';
      })
      .addCase(updatePushNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deletePushNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deletePushNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(deletePushNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  },
})
export default pushNotificationSlice.reducer