import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {getRequest} from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/orderClosed-constant'


export const fetchReturnClosedOrder = createAsyncThunk(
  'orders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.RETURN_ORDER_COMPLETED_ADMIN);
     
      if (!response || !response.data) {
        throw new Error('Invalid order data received');
      }
      
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching orders');
    }
  },
)

const returnClosedSlice = createSlice({
  name: 'returnClosed',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReturnClosedOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReturnClosedOrder.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(fetchReturnClosedOrder.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      },
})

export default returnClosedSlice.reducer