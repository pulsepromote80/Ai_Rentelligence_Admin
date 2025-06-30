import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest, postRequest, postUpdate, getAdminUserId } from '@/app/pages/api/auth';
import { API_ENDPOINTS } from '@/app/constants/subcategorytype-constant';
// Fetch Active SubCategory Types for Users
export const fetchActiveSubCategoryTypeList = createAsyncThunk(
  'subcategoryType/fetchActiveSubCategoryTypeList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_ACTIVE_SUBCATEGORY_TYPE);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch User Active Category'
      );
    }
  }
);
// Fetch All SubCategory Types
export const getSubCategoryTypeList = createAsyncThunk(
  'subcategoryType/getSubCategoryType',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_SUB_CATEGORY_TYPE);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch subcategory types'
      );
    }
  }
);
// Add SubCategory Type
export const addSubCategoryType = createAsyncThunk(
  'subcategoryType/addSubCategoryType',
  async (subCategoryTypeData, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.ADD_SUB_CATEGORY_TYPE, subCategoryTypeData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add subcategory type'
      );
    }
  }
);

export const updateSubCategoryType = createAsyncThunk(
  'subcategoryType/updateSubCategoryType',
  async (subCategoryTypeData, { rejectWithValue }) => {
    try {
      if (!subCategoryTypeData.subCategoryTypeId) {
        console.error('Subcategory Type ID is missing');
        throw new Error('Subcategory Type ID is required for updating');
      }

      // Call postUpdate from auth.js
      const response = await postUpdate(API_ENDPOINTS.UPDATE_SUB_CATEGORY_TYPE, subCategoryTypeData);
      return { success: true, data: response }; 
    } catch (error) {
      console.error("UPDATE API Failed:", error.message);
      return rejectWithValue(error.message || 'Failed to update subcategory type');
    }
  }
);

export const deleteSubCategoryType = createAsyncThunk(
  'subcategoryType/deleteSubCategoryType',
  async (subCategoryTypeId, { rejectWithValue }) => {
    try {
      const payload = {
        subCategoryTypeId,
        updatedBy: getAdminUserId(),
      };

      const response = await postRequest(API_ENDPOINTS.DELETE_SUB_CATEGORY_TYPE, payload);

      return { success: true, data: response }; 
    } catch (error) {
      console.error('DELETE API Failed:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete subcategory type');
    }
  }
);


// Slice
const subCategoryTypeSlice = createSlice({
  name: 'subcategoryType',
  initialState: {
    loading: false,
    error: null,
    success: null,
    subCategoryTypeList: [],
    activeSubCategoryTypeData: [],
  },
  reducers: {
    setSubCategoryTypeData: (state, action) => {
      state.subCategoryTypeList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Active SubCategory Types for Users
      .addCase(fetchActiveSubCategoryTypeList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveSubCategoryTypeList.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSubCategoryTypeData = action.payload;
      })
      .addCase(fetchActiveSubCategoryTypeList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All SubCategory Types
      .addCase(getSubCategoryTypeList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubCategoryTypeList.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategoryTypeList = action.payload;
      })
      .addCase(getSubCategoryTypeList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add SubCategory Type
      .addCase(addSubCategoryType.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addSubCategoryType.fulfilled, (state) => {
        state.loading = false;
        state.success = 'Subcategory Type added successfully!';
      })
      .addCase(addSubCategoryType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })

      // Update SubCategory Type
      .addCase(updateSubCategoryType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSubCategoryType.fulfilled, (state) => {
        state.loading = false;
        state.success = 'Subcategory Type updated successfully!';
      })
      .addCase(updateSubCategoryType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete SubCategory Type (Fixed - Removed duplicate)
      .addCase(deleteSubCategoryType.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Subcategory Type deleted successfully!';
        
        // Ensure correct filtering based on subCategoryTypeId
        state.subCategoryTypeList = state.subCategoryTypeList.filter(
          (item) => item.subCategoryTypeId !== action.payload.subCategoryTypeId
        );
      })
      .addCase(deleteSubCategoryType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  },
});
export const { setSubCategoryTypeData } = subCategoryTypeSlice.actions;
export default subCategoryTypeSlice.reducer;
