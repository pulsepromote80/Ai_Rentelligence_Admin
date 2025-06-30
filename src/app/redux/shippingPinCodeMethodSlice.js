'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAdminUserId, getRequest, postCreate, postRequest, postUpdate } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/shippingPinCodeMethod-constant'

// Fetch Shipping Methods (GET Request)
export const fetchShippingPinCodeMethod = createAsyncThunk(
  'shippingPinCodeMethod/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_PIN_CODE_SHIPPING)
      if (!response || !response.data) {
        throw new Error('Invalid shipping Pin code method data received')
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching shipping methods')
    }
  },
)

// Add Shipping Method (Post Create)
export const addShippingPinCodeMethod = createAsyncThunk(
  'shippingPinCodeMethod/add',
  async (shippingPinCodeData, { rejectWithValue }) => {
    try {
      const response = await postCreate(API_ENDPOINTS.ADD_PIN_CODE_SHIPPING, shippingPinCodeData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error adding shipping method')
    }
  },
)

// Update Shipping Method (Post Update)
export const updateShippingPinCodeMethod = createAsyncThunk(
  'shippingPinCodeMethod/update',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postUpdate(API_ENDPOINTS.UPDATE_PIN_CODE_SHIPPING, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating shipping method')
    }
  },
)

export const deleteShippingPinCodeMethod = createAsyncThunk(
    'shippingPinCodeMethod/delete',
    async (pinCodeShippingId, { rejectWithValue }) => {
      try {
        const payload = {
          pinCodeShippingId,
          updatedBy: getAdminUserId(),
        };
        const response = await postRequest(
          API_ENDPOINTS.DELETE_PIN_CODE_SHIPPING,
          payload
        ); 
        return response;
      } catch (error) {
        console.error(" DELETE API Failed:", error.response?.data || error.message); 
        return rejectWithValue(
          error.response?.data?.message || 'Failed to delete shipping pin code'
        );
      }
    }
  );

// Create Slice
const shippingPinCodeMethod = createSlice({
  name: 'shippingPinCodeMethod',
  initialState: {
    shippingPinCodeMethod: [],
    loading: false,
    error: null,
    shippingMethodData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShippingPinCodeMethod.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(fetchShippingPinCodeMethod.fulfilled, (state, action) => {
        state.shippingMethodData = action.payload 
        state.loading = false
      })
      .addCase(fetchShippingPinCodeMethod.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })

      .addCase(addShippingPinCodeMethod.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(addShippingPinCodeMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingPinCodeMethod = action.payload || []
      })
      .addCase(addShippingPinCodeMethod.rejected, (state, action) => {
        state.error = action.payload
      })

      .addCase(updateShippingPinCodeMethod.pending, (state) => {
        state.loading =true;
      })

      .addCase(updateShippingPinCodeMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload
        state.success = 'Shipping Pin Code updated successfully!';
      })

      .addCase(updateShippingPinCodeMethod.rejected, (state, action) => {
        state.error = action.payload
      })

      .addCase(deleteShippingPinCodeMethod.fulfilled, (state, action) => {
        state.shippingPinCodeMethod = state.shippingPinCodeMethod.filter(
          (method) => method.shippingMethodId !== action.payload,
        )
      })
      .addCase(deleteShippingPinCodeMethod.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default shippingPinCodeMethod.reducer