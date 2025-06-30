import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest, getToken } from "../pages/api/auth";

const API_ENDPOINTS = {
  GET_ADMIN_USER_DETAILS: "/AdminAuthentication/getAdminUserDetails",
  GET_ALL_ADMIN_LIST:"/AdminAuthentication/getAllAdminList",
  ADMIN_DEACTIVATE:"/AdminAuthentication/adminDeActivate",
  ADMIN_ACTIVATE:"/AdminAuthentication/adminActivate"
};

export const fetchAdminUserDetails = createAsyncThunk(
  "admin/fetchAdminUserDetails",
  async ({ adminUserId, username }, { rejectWithValue }) => 
    {
    try {
      const token = getToken(); 
      if (!token) throw new Error("No token found, please login again");

      const response = await postRequest(API_ENDPOINTS.GET_ADMIN_USER_DETAILS, { adminUserId, username }, token); 

      if (!response) throw new Error("Invalid API response: response is null");
      if (response.statusCode === 400) return rejectWithValue(response.message);

      return response.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch admin user details");
    }
  }
);

export const fetchActivateAdminUser = createAsyncThunk(
  'admin/fetchActivateAdminUser',
  async (adminUserId, { rejectWithValue }) => {
    try {
      const response = await postRequest(`${API_ENDPOINTS.ADMIN_ACTIVATE}?adminuserId=${adminUserId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || 'Error activating admin user');
    }
  }
);

export const fetchDeActivateAdminUser = createAsyncThunk(
  'admin/fetchDeActivateAdminUser',
  async (adminUserId, { rejectWithValue }) => {
    try {
      const response = await postRequest(`${API_ENDPOINTS.ADMIN_DEACTIVATE}?adminuserId=${adminUserId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || 'Error activating admin user');
    }
  }
);

export const fetchAllAdminUsersList = createAsyncThunk(
  'admin/fetchAllAdminUsersList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.GET_ALL_ADMIN_LIST);
      if (!response || !response.data) {
        throw new Error('Invalid admin user data received');
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching admin users');
    }
  }
);

const adminUserSlice = createSlice({
  name: "admin",
  initialState: {
    user: null,
    allAdminListData:[],
    activateStatus: null,
    deactivateStatus: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchAdminUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load data";
      })
      .addCase(fetchAllAdminUsersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAdminUsersList.fulfilled, (state, action) => {
        state.loading = false;
        state.allAdminListData = action.payload;
      })
      .addCase(fetchAllAdminUsersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load data";
      })

      .addCase(fetchActivateAdminUser.fulfilled, (state, action) => {
        state.activateStatus = action.payload;
      })
      .addCase(fetchActivateAdminUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(fetchDeActivateAdminUser.fulfilled, (state, action) => {
        state.activateStatus = action.payload;
      })
      .addCase(fetchDeActivateAdminUser.rejected, (state, action) => {
        state.error = action.payload;
      })
  },
});

export default adminUserSlice.reducer;
