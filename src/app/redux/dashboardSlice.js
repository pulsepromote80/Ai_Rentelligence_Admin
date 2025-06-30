import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest , getToken } from "../pages/api/auth";
import { } from "../pages/api/auth"; // getToken import karein

const API_ENDPOINTS = {
  DASHBOARD: "/AdminAuthentication/getAdminDashboardDetails",
};

// Fetch Dashboard Data with Token
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken(); // Token retrieve karein
      if (!token) throw new Error("No token found, please login again");

      const response = await postRequest(API_ENDPOINTS.DASHBOARD, {}, token);

      if (!response) throw new Error("Invalid API response: response is null");
      if (response.statusCode === 400) return rejectWithValue(response.message);
      return Array.isArray(response.data) ? response.data[0] : {};
    } catch (error) {
      console.error(" API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard data");
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: null,
    transactions: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = {
          totalJoining: action.payload.totalJoining || 0,
          totalTodayJoining: action.payload.totalTodayJoining || 0,
          totalactive: action.payload.totalactive || 0,
          totalBusiness: action.payload.totalBusiness || 0,
          todayBusiness: action.payload.todayBusiness || 0,
          totalIncomeWallet: action.payload.totalIncomeWallet || 0,
          totalDepositWallet: action.payload.totalDepositWallet || 0,
          todayDeposit: action.payload.todayDeposit || 0,
          totalWithdrawal: action.payload.totalWithdrawal || 0,
          totalROI: action.payload.totalROI || 0,
          workingIncomeToday: action.payload.workingIncomeToday || 0,
          workingIncomeTotal: action.payload.workingIncomeTotal || 0,
        };
        state.transactions = action.payload.todayOrderList || [];
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load data";
        console.error(" Dashboard API Call Failed:", state.error);
      });
  },
});

export default dashboardSlice.reducer;

