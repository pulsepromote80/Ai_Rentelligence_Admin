import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postRequest, getRequest } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/similarproduct-constant'



export const addSimilarProduct = createAsyncThunk(
  'similarProduct/addSimilarProduct',
  async (similarProductData, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.ADD_SIMILAR_PRODUCT, similarProductData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add Coupon'
      );
    }
  }
);

export const fetchSimilarProduct = createAsyncThunk(
  'similarProduct/fetchSimilarProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getRequest(`${API_ENDPOINTS.GET_ALL_SIMILAR_PRODUCT_BY_PRODUCTID}?productId=${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add Coupon'
      );
    }
  }
);

export const updateSimilarProduct = createAsyncThunk(
  'similarProduct/updateSimilarProduct',
  async (similarProductData, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.UPDATE_SIMILAR_PRODUCT, similarProductData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update Similar Product'
      );
    }
  }
);

const similarProductSlice = createSlice({
  name: 'similarProduct',
  initialState: {
    similarProductData: [],
    similarProductId: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSimilarProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addSimilarProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProductData = action.payload;
      })
      .addCase(addSimilarProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(fetchSimilarProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSimilarProduct.fulfilled, (state, action) => {
        state.similarProductId = action.payload || []
        state.loading = false
      })
      .addCase(fetchSimilarProduct.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(updateSimilarProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateSimilarProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        state.similarProductData = state.similarProductData.map((product) =>
          product.similarProductId === updatedProduct.similarProductId ? updatedProduct : product
        );
      })
      .addCase(updateSimilarProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });

  },
})

export default similarProductSlice.reducer