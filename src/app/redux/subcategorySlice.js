
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRequest, postRequest, getAdminUserId, postUpdate, postformRequest } from '@/app/pages/api/auth';
import { API_ENDPOINTS } from '@/app/constants/subcategory-constant';

//  GET Request
export const getSubCategoryList = createAsyncThunk(
  'subcategory/getSubCategory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_SUB_CATEGORY);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch subcategories'
      );
    }
  }
);

//  POST Request 
export const addSubCategory = createAsyncThunk(
  'subcategory/postSubcategoryRequest',
  async (subcategoryData, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.ADD_SUB_CATEGORY, subcategoryData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add subcategory'
      );
    }
  }
);

//  DELETE Request
export const deleteSubCategory = createAsyncThunk(
  'subcategory/deleteSubCategory',
  async (subCategoryId, { rejectWithValue }) => {
    try {
      const payload = {
        subCategoryId,
        updatedBy: getAdminUserId(),
      };
      const response = await postRequest(
        API_ENDPOINTS.DELETE_SUB_CATEGORY,
        payload
      );
      return response;
    } catch (error) {
      console.error(" DELETE API Failed:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete subcategory'
      );
    }
  }
);


//  UPDATE Request
export const updateSubCategory = createAsyncThunk(
  'subcategory/updateSubcategoryRequest',
  async (subcategoryData, { rejectWithValue }) => {
    try {
      const response = await postformRequest(
        API_ENDPOINTS.UPDATE_SUB_CATEGORY,
        subcategoryData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update subcategory'
      );
    }
  }
);


export const fetchActiveSubCategoryList = createAsyncThunk(
  'subcategory/fetchActiveSubCategoryList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_ACTIVE_SUBCATEGORY);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch User Active Category'
      );
    }
  }
);

const subCategorySlice = createSlice({
  name: 'subcategory',
  initialState: {
    loading: false,
    error: null,
    success: null,
    subCategoryList: [],
    subCategoryData: [],
  },
  reducers: {
    setSubcategoryData: (state, action) => {
      state.subCategoryList = action.payload;
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(fetchActiveSubCategoryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveSubCategoryList.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategoryData = action.payload;
      })
      .addCase(fetchActiveSubCategoryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    //  GET Request Handling
    builder
      .addCase(getSubCategoryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubCategoryList.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategoryList = action.payload;
      })
      .addCase(getSubCategoryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //  POST Request Handling
    builder
      .addCase(addSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Subcategory added successfully!';
      })
      .addCase(addSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });

    //  DELETE Request Handling
    builder
      .addCase(deleteSubCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategoryList = state.subCategoryList.filter(
          (item) => item.id !== action.payload.id
        );
        state.success = action.payload.message;
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });

    //  UPDATE Request Handling
    builder
      .addCase(updateSubCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Subcategory updated successfully!';
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSubcategoryData } = subCategorySlice.actions;
export default subCategorySlice.reducer;
