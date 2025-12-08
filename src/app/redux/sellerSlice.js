'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRequest,postCreate,postRequest,postUpdate,} from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/seller-constant'

// Fetch Sellers (GET Request)
export const fetchSellers = createAsyncThunk(
  'sellers/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_SELLER)
      if (!response || !response.data) {
        throw new Error('Invalid seller data received')
      }
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching sellers')
    }
  },
)

// Add Seller (Post Create)
export const addSeller = createAsyncThunk(
  'sellers/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postCreate(API_ENDPOINTS.ADD_SELLER, data)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error adding seller')
    }
  },
)

// Update Seller (Post Update)
export const updateSeller = createAsyncThunk(
  'sellers/update',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postUpdate(API_ENDPOINTS.UPDATE_SELLER, data)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating seller')
    }
  },
)

// Delete Seller (Post Delete)
export const deleteSeller = createAsyncThunk(
  'sellers/delete',
  async ({ sellerId }, { rejectWithValue }) => {
    try {
      const data = { sellerId }
      await postRequest(API_ENDPOINTS.DELETE_SELLER, data)
      return sellerId
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting seller')
    }
  },
)
export const fetchActiveSellerList = createAsyncThunk(
    'sellers/fetchActiveSellerList',
    async (_, { rejectWithValue }) => {
      try {
        const response = await getRequest(API_ENDPOINTS.GET_ALL_ACTIVE_SELLER);
        return response.data;
        
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || error.message || 'Failed to fetch User Active Category'
        );
      }
    }
  );

  export const fetchSellerIsActive = createAsyncThunk(
      'sellers/fetchIsActive',
      async (sellerId, { rejectWithValue }) => {
        try {
          const response = await getRequest(`${API_ENDPOINTS.SELLER_IS_ACTIVE}?selllerId=${sellerId}`);
          if (!response || !response.data) {
            throw new Error('Invalid seller active status data received');
          }
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data || 'Error fetching seller active status');
        }
      }
    ); 
  

// Create Slice
const sellerSlice = createSlice({
  name: 'seller',
  initialState: {
    sellers: [],
    loading: false,
    error: null,
    sellerData:[],
    sellerIsActive: null,
  },
  reducers: {},
  extraReducers: (builder) => {
      builder
              .addCase(fetchActiveSellerList.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(fetchActiveSellerList.fulfilled, (state, action) => {
                state.loading = false;
                state.sellerData = action.payload;
              })
              .addCase(fetchActiveSellerList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              });
    builder
      .addCase(fetchSellers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSellers.fulfilled, (state, action) => {
        state.sellers = action.payload || []
        state.loading = false
      })
      .addCase(fetchSellers.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(addSeller.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addSeller.fulfilled, (state, action) => {
        state.loading = false
        state.sellers.push(action.payload)
      })
      .addCase(addSeller.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateSeller.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateSeller.fulfilled, (state, action) => {
        state.loading = false
        const updatedSeller = action.payload
        if (!updatedSeller || !updatedSeller.sellerId) return
        const index = state.sellers.findIndex(
          (seller) => seller.sellerId === updatedSeller.sellerId,
        )
        if (index !== -1) state.sellers[index] = updatedSeller
      })
      .addCase(updateSeller.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteSeller.fulfilled, (state, action) => {
        state.sellers = state.sellers.filter(
          (seller) => seller.sellerId !== action.payload,
        )
      })
      .addCase(deleteSeller.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(fetchSellerIsActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerIsActive.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerIsActive = action.payload;
      })
      .addCase(fetchSellerIsActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
})

export default sellerSlice.reducer
