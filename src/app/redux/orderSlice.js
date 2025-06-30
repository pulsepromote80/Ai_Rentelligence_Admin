import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {getRequest} from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/order-constant'

export const fetchAllOrder = createAsyncThunk(
  'orders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_ORDER_LIST_ADMIN);
     
      if (!response || !response.data) {
        throw new Error('Invalid order data received');
      }
      
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching orders');
    }
  },
)

const getOrderSlice = createSlice({
  name: 'ViewAllOrder',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllOrder.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(fetchAllOrder.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      },
})

export default getOrderSlice.reducer