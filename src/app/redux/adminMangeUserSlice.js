const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
import {postRequest, getRequest} from "@/app/pages/api/auth";
const API_ENDPOINTS = {
  SEARCH_ALL_USERS: "/AdminManageUser/SearchAllUsers",
  GENERATE_WALLET_ADDRESS:"/Self/GenerateWalletAddress",
  GET_ALL_WALLET_ADDRESS:"/Self/getAllWalletAddress"
};

export const addAdminManageUser = createAsyncThunk(
  "adminManageUser/addAdminManageUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequest(
        API_ENDPOINTS.SEARCH_ALL_USERS,
        data
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(errorMessage);
    }
  }
);

export const generateWalletAddress = createAsyncThunk(
  "adminManageUser/generateWalletAddress",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequest(
        API_ENDPOINTS.GENERATE_WALLET_ADDRESS,
        data
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getAllWalletAddress = createAsyncThunk(
  "adminManageUser/getAllWalletAddress",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequest(
        API_ENDPOINTS.GET_ALL_WALLET_ADDRESS,
        data
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(errorMessage);
    }
  }
);

  const adminManageUserSlice = createSlice({
  name: "adminManageUser",
  initialState: {
    status: null,
    loading: false,
    error: null,
    searchData:null,
    walletAddressData:null,
    allWalletData:null
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(addAdminManageUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAdminManageUser.fulfilled, (state, action) => {
        state.loading = false;
        state.searchData = action.payload;
        state.error = null;
      })
      .addCase(addAdminManageUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       
         .addCase(generateWalletAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateWalletAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.walletAddressData = action.payload;
        state.error = null;
      })
      .addCase(generateWalletAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
        .addCase(getAllWalletAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWalletAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.allWalletData = action.payload;
        state.error = null;
      })
      .addCase(getAllWalletAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    }
  }
);

export default adminManageUserSlice.reducer;