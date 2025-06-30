import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {getRequest, postRequest} from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/successOrder-constant'

export const fetchSuccessOrder = createAsyncThunk(
  'orders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_SUCCESSFULL_ORDER_ADMIN);
      if (!response || !response.data) {
        throw new Error('Invalid order data received');
      }
      
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching orders');
    }
  },
)

export const updateSuccessOrder = createAsyncThunk(
    'orders/updateSuccessOrder',
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(API_ENDPOINTS.UPDATE_ORDER_STATUS_ADMIN  , data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const successOrderSlice = createSlice({
  name: 'SuccessOrder',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuccessOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSuccessOrder.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(fetchSuccessOrder.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
    builder
      .addCase(updateSuccessOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSuccessOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateSuccessOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })  
      },
})

export default successOrderSlice.reducer