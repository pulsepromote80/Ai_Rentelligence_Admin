// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { postformRequestCloudImage, getRequestCloudImage,postRequest } from "@/app/pages/api/auth";
// import { API_ENDPOINTS } from "@/app/constants/cloud-constant";

// // 🔹 GET Cloud Images
// export const getCloud = createAsyncThunk(
//   "cloud/getCloudImages",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getRequestCloudImage(API_ENDPOINTS.CLOUD);
//       return response;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || "Failed to fetch cloud images"
//       );
//     }
//   }
// );

// // 🔹 ADD Cloud Image
// export const addCloud = createAsyncThunk(
//   "cloud/addCloudImages",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await postformRequestCloudImage(API_ENDPOINTS.ADD_CLOUD, formData);
//       return response;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || "Something went wrong while uploading"
//       );
//     }
//   }
// );

// export const deleteCloudImage = createAsyncThunk(
//   'cloud/deleteCloudImage',
//   async (Id, { rejectWithValue }) => {
//     try {
//       const endpoint = `${API_ENDPOINTS.DELETE_CLOUD_IMAGE}?Id=${Id}`;
//       const response = await postRequest(endpoint);
//       return response;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || 'Failed to delete event images'
//       );
//     }
//   }
// );

// const cloudSlice = createSlice({
//   name: "cloud",
//   initialState: {
//     loading: false,
//     error: null,
//     success: null,
//     data: [],
//   },
//     reducers: {
//     resetDeleteState: (state) => {
//       state.deleteLoading = false;
//       state.deleteSuccess = false;
//       state.deleteError = null;
//     }
//   },
//   extraReducers: (builder) => {
//     // ADD Cloud
//     builder
//       .addCase(addCloud.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = null;
//       })
//       .addCase(addCloud.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = action.payload.message;
//       })
//       .addCase(addCloud.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });

//     // GET Cloud
//     builder
//       .addCase(getCloud.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getCloud.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload.data || [];
//       })
//       .addCase(getCloud.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//        builder
//       .addCase(deleteCloudImage.pending, (state) => {
//         state.deleteLoading = true;
//         state.deleteError = null;
//         state.deleteSuccess = false;
//       })
//       .addCase(deleteCloudImage.fulfilled, (state, action) => {
//         state.deleteLoading = false;
//         state.deleteSuccess = true;
//         // Option 1: Update local state immediately
//         state.data = state.data.filter(item => item.id !== action.meta.arg);
//       })
//       .addCase(deleteCloudImage.rejected, (state, action) => {
//         state.deleteLoading = false;
//         state.deleteError = action.payload;
//         state.deleteSuccess = false;
//       });
//   },
// });
// export const { resetDeleteState } = cloudSlice.actions;
// export default cloudSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postformRequestCloudImage, getRequestCloudImage, postRequest } from "@/app/pages/api/auth";
import { API_ENDPOINTS } from "@/app/constants/cloud-constant";

// 🔹 GET Cloud Images
export const getCloud = createAsyncThunk(
  "cloud/getCloudImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequestCloudImage(API_ENDPOINTS.CLOUD);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch cloud images"
      );
    }
  }
);

// 🔹 ADD Cloud Image (SAME API FOR ADD AND EDIT)
export const addCloud = createAsyncThunk(
  "cloud/addCloudImages",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postformRequestCloudImage(API_ENDPOINTS.ADD_CLOUD, formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong while uploading"
      );
    }
  }
);

// 🔹 DELETE Cloud Image
export const deleteCloudImage = createAsyncThunk(
  'cloud/deleteCloudImage',
  async (Id, { rejectWithValue }) => {
    try {
      const endpoint = `${API_ENDPOINTS.DELETE_CLOUD_IMAGE}?Id=${Id}`;
      const response = await postRequest(endpoint);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete cloud image'
      );
    }
  }
);

const cloudSlice = createSlice({
  name: "cloud",
  initialState: {
    loading: false,
    deleteLoading: false,
    error: null,
    success: null,
    data: [],
    deleteSuccess: false,
    deleteError: null,
    editingItem: null, // Store item being edited
  },
  reducers: {
    resetDeleteState: (state) => {
      state.deleteLoading = false;
      state.deleteSuccess = false;
      state.deleteError = null;
    },
    setEditingItem: (state, action) => {
      state.editingItem = action.payload;
    },
    clearEditingItem: (state) => {
      state.editingItem = null;
    }
  },
  extraReducers: (builder) => {
    // ADD/EDIT Cloud
    builder
      .addCase(addCloud.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addCloud.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.editingItem = null; // Clear editing after success
      })
      .addCase(addCloud.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // GET Cloud
    builder
      .addCase(getCloud.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCloud.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data || [];
      })
      .addCase(getCloud.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // DELETE Cloud Image
    builder
      .addCase(deleteCloudImage.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteCloudImage.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.data = state.data.filter(item => item.id !== action.meta.arg);
      })
      .addCase(deleteCloudImage.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
        state.deleteSuccess = false;
      });
  },
});

export const { resetDeleteState, setEditingItem, clearEditingItem } = cloudSlice.actions;
export default cloudSlice.reducer;