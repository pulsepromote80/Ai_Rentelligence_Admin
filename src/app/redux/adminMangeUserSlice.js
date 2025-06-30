const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
import {postRequest} from "@/app/pages/api/auth";
const API_ENDPOINTS = {
  SEARCH_ALL_USERS: "/AdminManageUser/SearchAllUsers"
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

  const adminManageUserSlice = createSlice({
  name: "adminManageUser",
  initialState: {
    status: null,
    loading: false,
    error: null,
    searchData:null
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
       
    }
  }
);

export default adminManageUserSlice.reducer;