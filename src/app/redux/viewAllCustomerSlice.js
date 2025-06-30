import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRequest} from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/viewAllCustomer-constant' // ✅ Update this import

// Fetch Customers (GET Request)
export const fetchAllCustomers = createAsyncThunk(
    'customers/fetch',
    async (_, { rejectWithValue }) => {
      try {
        const response = await getRequest(API_ENDPOINTS.GET_ALL_CUSTOMER);
        
        if (!response || !response.data) {
          throw new Error('Invalid customer data received');
        }
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Error fetching customers');
      }
    }
  );

const viewAllCustomerSlice = createSlice({
  name: 'viewAllCustomer',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
  },
})

export default viewAllCustomerSlice.reducer

