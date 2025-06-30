import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postformRequest, getRequest, postRequest, getAdminUserId } from '@/app/pages/api/auth';
import { API_ENDPOINTS } from '@/app/constants/category-constant'

//  GET Request
export const getCategory = createAsyncThunk(
  'category/getcategory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.CATEGORY);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch categories'
      );
    }
  }
);


export const fetchActiveCategoryList = createAsyncThunk(
  'subcategory/fetchActiveCategoryList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_ACTIVE_CATEGORY);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch User Active Category'
      );
    }
  }
);

//  POST Request
export const addCategory = createAsyncThunk(
  'category/addCategory',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postformRequest(API_ENDPOINTS.ADD_CATEGORY, formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Something went wrong'
      );
    }
  }
);

//  DELETE Request 
export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const payload = {
        categoryId,
        updatedBy: getAdminUserId(),
      };

      const response = await postRequest(API_ENDPOINTS.DELETE_CATEGORY, payload);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete category'
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postformRequest(API_ENDPOINTS.UPDATE_CATEGORY, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    loading: false,
    error: null,
    success: null,
    data: [],
    categoryData: []
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveCategoryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveCategoryList.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryData = action.payload;
      })
      .addCase(fetchActiveCategoryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //  POST REQUEST HANDLING
    builder
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });

    //  GET REQUEST HANDLING
    builder
      .addCase(getCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.error = null;
      })
      .addCase(getCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    //  Update Category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updatedIndex = state.data.findIndex(
          (item) => item.categoryId === action.payload.categoryId
        );
        if (updatedIndex !== -1) {
          state.data[updatedIndex] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    //  DELETE REQUEST HANDLING (New)
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;

        //  Deleted item ko state se remove kar rahe hain
        state.data = state.data.filter(
          (item) => item.id !== action.meta.arg
        );

        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  },
});
export const { setData } = categorySlice.actions;
export default categorySlice.reducer;
