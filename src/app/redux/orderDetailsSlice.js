import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest } from '@/app/pages/api/auth';
import { API_ENDPOINTS } from '@/app/constants/orderDetails-constant';

// Fetch Customer Orders (GET Request)
export const fetchOrderDetails = createAsyncThunk(
    'orderDetails/fetch',
    async (searchValue, { rejectWithValue }) => {
      try {
        const response = await getRequest(`${API_ENDPOINTS.GET_ORDER_BY_SERACH_ADMIN}?searchValue=${searchValue}`);
        if (!response) {  
          throw new Error('Invalid Order Details data recieved');
        }
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Error fetching Order Details');
      }
    }
  ); 

const orderDetailsSlice = createSlice({
  name: 'order details',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default orderDetailsSlice.reducer;
