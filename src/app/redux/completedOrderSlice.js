import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRequest } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/completedOrder-constant'
import { getAdminUserId } from '@/app/pages/api/auth'

export const fetchCompletedOrder = createAsyncThunk(
  'orders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const adminUserId = getAdminUserId()
      const response = await getRequest(`${API_ENDPOINTS.GET_ALL_COMPLETED_ORDER_ADMIN}?adminUserId=${adminUserId}`);
      if (!response || !response.data) {
        throw new Error('Invalid order data received');
      }

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching orders');
    }
  },
)

const CompletedOrderSlice = createSlice({
  name: 'CompletedOrder',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompletedOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCompletedOrder.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(fetchCompletedOrder.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
  },
})

export default CompletedOrderSlice.reducer