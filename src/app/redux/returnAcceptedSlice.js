import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRequest, postRequest } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/returnAcceptedOrder-constant'


export const fetchReturnAccepted = createAsyncThunk(
  'orders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.RETURN_ORDER_ACCEPTED_ADMIN);

      if (!response || !response.data) {
        throw new Error('Invalid order data received');
      }

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching orders');
    }
  },
)

export const updateReturnAccepted = createAsyncThunk(
  'orders/updateReturnAcceptedOrder',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.UPDATE_ORDER_STATUS_ADMIN, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const returnAcceptedSlice = createSlice({
  name: 'returnAcceptedOrder',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReturnAccepted.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReturnAccepted.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(fetchReturnAccepted.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
    builder
      .addCase(updateReturnAccepted.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReturnAccepted.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateReturnAccepted.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },

})

export default returnAcceptedSlice.reducer