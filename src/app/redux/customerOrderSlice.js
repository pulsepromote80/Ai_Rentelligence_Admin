import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest } from '@/app/pages/api/auth';
import { API_ENDPOINTS } from '@/app/constants/customerOrder-constant';

// Fetch Customer Orders (GET Request)
export const fetchCustomerOrders = createAsyncThunk(
    'customerOrder/fetch',
    async (username, { rejectWithValue }) => {
      try {
        const response = await getRequest(`${API_ENDPOINTS.GET_ALL_ORDER_BY_USER}?username=${username}`);
  
        if (!response) {
          throw new Error('Invalid customer order data received');
        }
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Error fetching customer orders');
      }
    }
  ); 

  export const fetchCustomerContactUs = createAsyncThunk(
    'customerOrder/fetchContactUs',
    async (_, { rejectWithValue }) => {
      try {
        const response = await getRequest(API_ENDPOINTS.GET_ALL_CONTACT_US);
        if (!response) {
          throw new Error('Invalid customer order data received');
        }
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Error fetching customer orders');
      }
    }
  ); 

const customerOrderSlice = createSlice({
  name: 'customerOrder',
  initialState: {
    data: [],
    contactList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

       .addCase(fetchCustomerContactUs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerContactUs.fulfilled, (state, action) => {
        state.contactList = action.payload;
        state.loading = false;
      })
      .addCase(fetchCustomerContactUs.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default customerOrderSlice.reducer;
