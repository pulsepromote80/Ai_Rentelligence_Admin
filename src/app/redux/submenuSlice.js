import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {  getAdminUserId, getRequest, postRequest, postUpdate } from "../pages/api/auth";
import { API_ENDPOINTS } from "@/app/constants/submenu-constant";

export const fetchSubmenuByMenuId = createAsyncThunk(
   'submenu/fetchSubMenuByMenuId',
    async (menuId, { rejectWithValue }) => {
      try {
        const response = await getRequest(`${API_ENDPOINTS.GET_SUB_MENU_BY_MENU_ID}?menuId=${menuId}`);
        if (!response || !response.data) {
          throw new Error('Invalid customer data received');
        }
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Error fetching submenu');
      }
    }
  );

export const addSubMenu = createAsyncThunk(
  'submenu/postSubMenu',
  async (submenuData, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.ADD_SUB_MENU, submenuData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add submenu'
      );
    }
  }
);

export const fetchMenu = createAsyncThunk(
  'submenu/fetchMenu',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_ALL_MENU);

      if (!response || !response.data) {
        throw new Error('Invalid menu data received');
      }

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching menu');
    }
  },
)

export const updateSubMenu = createAsyncThunk(
  'submenu/updateSubMenu',
  async (submenuData, { rejectWithValue }) => {
    try {
      const response = await postUpdate(
        API_ENDPOINTS.UPDATE_SUBMENU,
        submenuData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update submenu'
      );
    }
  }
);

export const deleteSubMenu = createAsyncThunk(
  'submenu/deleteSubMenu',
  async (subMenuId, { rejectWithValue }) => {
    try {
      const payload = {
        subMenuId,
        updatedBy: getAdminUserId(),
      };
      const response = await postRequest(
        API_ENDPOINTS.DELETE_SUB_MENU,
        payload
      );
      return response;
    } catch (error) {
      console.error(" DELETE API Failed:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete submenu'
      );
    }
  }
);

const subMenuSlice = createSlice({
  name: "sidebar",
  initialState: {
    subMenu: [],
    icons: [],
    menu: [],
    selectedPage: null,
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
      .addCase(fetchSubmenuByMenuId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubmenuByMenuId.fulfilled, (state, action) => {
        state.loading = false;
        state.subMenu = action.payload;
      })
      .addCase(fetchSubmenuByMenuId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.menu = action.payload
        state.loading = false
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
    builder
      .addCase(addSubMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addSubMenu.fulfilled, (state, action) => {
        state.loading = true;
        state.success = 'SubMenu added successfully!';
        state.subMenu = action.payload;
      })
      .addCase(addSubMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      .addCase(updateSubMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSubMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Sub Menu updated successfully!';
      })
      .addCase(updateSubMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSubMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteSubMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
      // Remove the deleted submenu from the state
        state.subMenu = state.subMenu.filter(submenu => submenu.subMenuId !== action.meta.arg);
      })
      .addCase(deleteSubMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  },
});

export const { clearError, setSelectedPage } = subMenuSlice.actions;
export default subMenuSlice.reducer;
