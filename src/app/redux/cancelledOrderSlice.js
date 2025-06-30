import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRequest } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/cancelledOrder-constant'

export const fetchCancelledOrder = createAsyncThunk(
  'orders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.CANCEL_ORDER_LIST_ADMIN);

      if (!response || !response.data) {
        throw new Error('Invalid order data received');
      }

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching orders');
    }
  },
)

const CancelledOrderSlice = createSlice({
  name: 'CancelledOrder',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCancelledOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCancelledOrder.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(fetchCancelledOrder.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
  },
})

export default CancelledOrderSlice.reducer