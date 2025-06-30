import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest } from "../pages/api/auth";
const API_ENDPOINTS = {
  GET_PRODUCT_SEARCH_BY_FILTER_NEW:"/Filter/getProductSearchByFilterNew"
};

export const getProductSearchByFilterNew = createAsyncThunk(
    "searchFilter/getProductSearchByFilterNew",
    async (data, { rejectWithValue }) => {
      try {
        const response = await postRequest(API_ENDPOINTS.GET_PRODUCT_SEARCH_BY_FILTER_NEW, data);
        if (!response || !response.data) {
          throw new Error("Invalid filter data received");
        }
        return response.data; 

      } catch (error) {
        return rejectWithValue(error.response?.data || "Error fetching brands");
      }
    }
  );

  const searchFilterSlice = createSlice({
    name: "searchFilter",
    initialState: {
      loading: false,
      error: null,
      searchFilterData:[]
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getProductSearchByFilterNew.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getProductSearchByFilterNew.fulfilled, (state, action) => {
          state.loading = false;
          state.searchFilterData= action.payload;
        })
        .addCase(getProductSearchByFilterNew.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        });
    },
  });
  export default searchFilterSlice.reducer;