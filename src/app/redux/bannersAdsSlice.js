import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAdminUserId, getRequest, postformRequest, postRequest } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/bannerAds-constant'

export const getBanner = createAsyncThunk(
    'banner/fetch',
    async (_, { rejectWithValue }) => {
      try {
        const adminUserId = getAdminUserId();
        const response = await getRequest(`${API_ENDPOINTS.GET_ALL_BANNER}?adminUserId=${adminUserId}`);
        if (!response || !response.data) {
          throw new Error('Invalid customer data received');
        }
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Error fetching banners');
      }
    }
  );
  

export const addBanner = createAsyncThunk(
    'banner/addBanner',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await postformRequest(API_ENDPOINTS.ADD_BANNER, formData);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Something went wrong'
            );
        }
    }
);

export const updateBanner = createAsyncThunk(
    'banner/updateBanner',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await postformRequest(API_ENDPOINTS.UPDATE_BANNER, formData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteBanner = createAsyncThunk(
    'banner/deleteBanner',
    async (bannerId, { rejectWithValue }) => {
        try {
            const payload = {
                bannerId,
                updatedBy: getAdminUserId(),
            };
            const response = await postRequest(API_ENDPOINTS.DELETE_BANNER, payload);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Failed to delete category'
            );
        }
    }
);

const BannerSlice = createSlice({
    name: 'banner',
    initialState: {
        bannerData: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBanner.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(getBanner.fulfilled, (state, action) => {
                state.bannerData = action.payload
                state.loading = false
            })
            .addCase(getBanner.rejected, (state, action) => {
                state.error = action.payload
                state.loading = false
            })

        builder
            .addCase(addBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(addBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.message;
                state.error = null;
            })
            .addCase(addBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = null;
            });

        builder
            .addCase(updateBanner.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBanner.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        builder
            .addCase(deleteBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.message;
                state.error = null;
            })
            .addCase(deleteBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = null;
            });
    },
})

export default BannerSlice.reducer