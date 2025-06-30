import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRequest, postRequest } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/arrivalOrder-constant'

export const fetchArrivalOrder = createAsyncThunk(
  'ArrivalOrder/fetchArrivalOrder',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_ARRIVED_TO_ORDER_LIST_ADMIN);
      if (!response || !response.data) {
        throw new Error('Invalid order data received');
      }

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching orders');
    }
  },
)

export const updateArrivalOrder = createAsyncThunk(
    'Arrivalorder/updateArrivalOrder',
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(API_ENDPOINTS.UPDATE_ORDER_STATUS_ADMIN, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


const ArrivalOrderSlice = createSlice({
  name: 'ArrivalOrder',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArrivalOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArrivalOrder.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(fetchArrivalOrder.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      builder
      .addCase(updateArrivalOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateArrivalOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateArrivalOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })  
  },
})

export default ArrivalOrderSlice.reducer