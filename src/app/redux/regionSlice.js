'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRequest } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/region-constant'

// Fetch Countries
export const fetchCountries = createAsyncThunk(
  'region/fetchCountries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_COUNTRY)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching countries')
    }
  }
)

// Fetch States by Country ID
export const fetchStates = createAsyncThunk(
  'region/fetchStates',
  async (countryId, { rejectWithValue }) => {
    try {
      const response = await getRequest(`${API_ENDPOINTS.GET_ALL_STATE}?Fk_CountryId=${countryId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching states')
    }
  }
)

// Fetch Cities by State ID
export const fetchCities = createAsyncThunk(
  'region/fetchCities',
  async (stateId, { rejectWithValue }) => {
    try {
      const response = await getRequest(`${API_ENDPOINTS.GET_ALL_CITY}?Fk_StateId=${stateId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching cities')
    }
  }
)

// Create Slice
const regionSlice = createSlice({
  name: 'region',
  initialState: {
    region: [],
    countries: [],
    states: [],
    cities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    
      // Fetch Countries
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countries = action.payload
        state.loading = false
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })

      // Fetch States
      .addCase(fetchStates.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.states = action.payload
        state.loading = false
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })

      // Fetch Cities
      .addCase(fetchCities.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.cities = action.payload
        state.loading = false
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
  },
})

export default regionSlice.reducer
