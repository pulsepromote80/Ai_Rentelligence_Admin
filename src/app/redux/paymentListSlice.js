import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRequest } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/paymentList-constant'

export const fetchPaymentList = createAsyncThunk(
  'paymentList/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_PAYMENT_LIST);

      if (!response || !response.data) {
        throw new Error('Invalid order data received');
      }
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching orders');
    }
  },
)

const paymentListSlice = createSlice({
  name: 'paymentList',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPaymentList.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(fetchPaymentList.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
  },
})

export default paymentListSlice.reducer