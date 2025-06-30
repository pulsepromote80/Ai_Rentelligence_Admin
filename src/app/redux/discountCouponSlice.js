import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAdminUserId, getRequest, postRequest, postUpdate } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/discountCoupon-constant'

export const fetchCoupon = createAsyncThunk(
  'coupon/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_COUPON);

      if (!response || !response.data) {
        throw new Error('Invalid Coupon data received');
      }

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching Coupon');
    }
  },
)

export const addCoupon = createAsyncThunk(
  'coupon/add',
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.ADD_COUPON, couponData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add Coupon'
      );
    }
  }
);

export const updateCoupon = createAsyncThunk(
  'coupon/update',
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await postUpdate(
        API_ENDPOINTS.UPDATE_COUPON,
        couponData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update Coupon'
      );
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  'coupon/delete',
  async (couponId, { rejectWithValue }) => {
    try {
      const payload = {
        couponId,
        updatedBy: getAdminUserId(),
      };
      const response = await postRequest(
        API_ENDPOINTS.DELETE_COUPON,
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete Coupon '
      );
    }
  }
);

const couponSlice = createSlice({
  name: 'coupon',
  initialState: {
    CouponData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupon.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCoupon.fulfilled, (state, action) => {
        state.CouponData = action.payload
        state.loading = false
      })
      .addCase(fetchCoupon.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
    builder
      .addCase(addCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.CouponData = action.payload
        state.success = 'Coupon added successfully!';
      })
      .addCase(addCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
    builder
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Coupon updated successfully!';
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  },
})

export default couponSlice.reducer