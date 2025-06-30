'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRequest, postCreate, postRequest, postUpdate } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/shippingMethod-constant'

// Fetch Shipping Methods (GET Request)
export const fetchShippingMethod = createAsyncThunk(
  'shippingMethod/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_SHIPPING_METHOD)
      if (!response || !response.data) {
        throw new Error('Invalid shipping method data received')
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching shipping methods')
    }
  },
)

// Add Shipping Method (Post Create)
export const addShippingMethod = createAsyncThunk(
  'shippingMethod/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postCreate(API_ENDPOINTS.ADD_SHIPPING_METHOD, data)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error adding shipping method')
    }
  },
)

// Update Shipping Method (Post Update)
export const updateShippingMethod = createAsyncThunk(
  'shippingMethod/update',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postUpdate(API_ENDPOINTS.UPDATE_SHIPPING_METHOD, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating shipping method')
    }
  },
)

// Delete Shipping Method (Post Delete)
export const deleteShippingMethod = createAsyncThunk(
  'shippingMethod/delete',
  async ({ shippingMethodId }, { rejectWithValue }) => {
    try {
      const data = { shippingMethodId }
      const response = await postRequest(API_ENDPOINTS.DELETE_SHIPPING_METHOD, data)
      if (!response?.data) {
        return { statusCode: 200, message: 'Shipping Method deleted successfully.' };
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting shipping method')
    }
  },
)

// Create Slice
const shippingMethodSlice = createSlice({
  name: 'shippingMethod',
  initialState: {
    shippingMethod: [],
    loading: false,
    error: null,
    shippingMethodData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShippingMethod.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchShippingMethod.fulfilled, (state, action) => {
        state.shippingMethod = action.payload || []
        state.loading = false
      })
      .addCase(fetchShippingMethod.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(addShippingMethod.fulfilled, (state, action) => {
        state.shippingMethod.push(action.payload)
      })
      .addCase(addShippingMethod.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateShippingMethod.fulfilled, (state, action) => {
        const updatedShippingMethod = action.payload
        if (!updatedShippingMethod || !updatedShippingMethod.shippingMethodId) return
        const index = state.shippingMethod.findIndex(
          (method) => method.shippingMethodId === updatedShippingMethod.shippingMethodId,
        )
        if (index !== -1) state.shippingMethod[index] = updatedShippingMethod
      })
      .addCase(updateShippingMethod.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(deleteShippingMethod.fulfilled, (state, action) => {
        state.shippingMethod = state.shippingMethod.filter(
          (method) => method.shippingMethodId !== action.payload,
        )
      })
      .addCase(deleteShippingMethod.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default shippingMethodSlice.reducer