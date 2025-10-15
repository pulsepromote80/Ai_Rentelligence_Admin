import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postformRequestCloudImage, getRequestCloudImage } from "@/app/pages/api/auth";
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

// 🔹 ADD Cloud Image
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

const cloudSlice = createSlice({
  name: "cloud",
  initialState: {
    loading: false,
    error: null,
    success: null,
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    // ADD Cloud
    builder
      .addCase(addCloud.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addCloud.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
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
  },
});

export default cloudSlice.reducer;
