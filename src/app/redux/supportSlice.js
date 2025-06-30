import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRequest} from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/support-constant'

// Fetch Support (GET Request)
export const fetchSupport = createAsyncThunk(
  'support/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_TICKET)
      if (!response || !response.data) {
        throw new Error('Invalid ticket data received')
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching tickets')
    }
  },
)

// Create Slice
const supportSlice = createSlice({
  name: 'support',
  initialState: {
    loading: false,
    error: null,
    supportData:[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupport.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSupport.fulfilled, (state, action) => {
        state.supportData = action.payload || []
        state.loading = false
      })
      .addCase(fetchSupport.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
  },
})

export default supportSlice.reducer
