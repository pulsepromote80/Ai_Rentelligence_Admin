import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRequest, postRequest } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/shippedOrder-constant'

export const fetchShippedOrder = createAsyncThunk(
  'orders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_SHIPPING);

      if (!response || !response.data) {
        throw new Error('Invalid order data received');
      }

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching orders');
    }
  },
)

export const updateShippingOrder = createAsyncThunk(
    'orders/updateShippingOrder',
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(API_ENDPOINTS.UPDATE_ORDER_STATUS_ADMIN, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const ShippedOrderSlice = createSlice({
  name: 'ShippedOrder',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShippedOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchShippedOrder.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(fetchShippedOrder.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      builder
      .addCase(updateShippingOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateShippingOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateShippingOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })  
  },
})

export default ShippedOrderSlice.reducer