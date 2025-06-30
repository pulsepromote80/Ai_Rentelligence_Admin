import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequest } from "../pages/api/auth";

const API_ENDPOINTS = {
  GET_ALL_MENU_OF_SUBMENU: "/Menu/getAllMenuOfSubMenu",
  GET_ALL_MENU:"/Menu/getAllMenu"
};
export const fetchSidebarMenu = createAsyncThunk(
    "sidebar/fetchSidebarMenu",
    async (_, { rejectWithValue }) => {
      try {
        const response = await getRequest(API_ENDPOINTS.GET_ALL_MENU_OF_SUBMENU); 
        if (!response) {
          console.error(" API response is undefined or null");
          throw new Error("Invalid API response: No response data received");
        }
        if (!Array.isArray(response.data)) {
          console.error(" API response does not contain menuList array:", response);
          throw new Error("Invalid API response: Expected menuList array");
        }
        return response.data;
      } catch (error) {
        console.error(" Sidebar API Error:", error);
        if (error.response) {
          return rejectWithValue(error.response.data?.message || "API Request Failed");
        } else {
          return rejectWithValue(error.message || "Unknown error occurred");
        }
      }
    }
  );

  export const fetchMenuIcons = createAsyncThunk(
    "menuIcons/fetchMenuIcons",
    async (_, { rejectWithValue }) => {
      try {
        const response = await getRequest(API_ENDPOINTS.GET_ALL_MENU);
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid menu icons format");
        }
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
    }
  );



const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    menuItems: [],
    icons:[],
    selectedPage:null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedPage: (state, action) => {
      state.selectedPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSidebarMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSidebarMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menuItems = action.payload; 
      })
      .addCase(fetchSidebarMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })
      .addCase(fetchMenuIcons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenuIcons.fulfilled, (state, action) => {
        state.loading = false;
        state.icons = action.payload;
      })
      .addCase(fetchMenuIcons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError ,setSelectedPage } = sidebarSlice.actions;
export default sidebarSlice.reducer;
