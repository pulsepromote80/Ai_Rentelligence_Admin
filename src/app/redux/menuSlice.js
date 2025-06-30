'use client'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getRequest,
  postCreate,
  postRequest,
  postUpdate,
} from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/menu-constant'

export const fetchMenus = createAsyncThunk(
  'menu/fetchAll',
  async (type = 1, { rejectWithValue }) => {
    try {
      const response = await getRequest(
        `${API_ENDPOINTS.GET_ALL_MENU}?type=${type}`,
      )
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching data')
    }
  },
)
// Fetch Menu by ID
export const fetchMenuById = createAsyncThunk(
  'menu/fetchById',
  async (menuId, { rejectWithValue }) => {
    try {
      const response = await getRequest(
        `${API_ENDPOINTS.GET_MENU_BY_ID}/${menuId}`,
      )
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 'Error fetching menu by ID',
      )
    }
  },
)

// Add Menu
export const addMenu = createAsyncThunk(
  'menu/add',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postCreate(API_ENDPOINTS.ADD_MENU, data)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error adding menu')
    }
  },
)

// Update Menu
export const updateMenu = createAsyncThunk(
  'menu/update',
  async (data, { rejectWithValue }) => {
    try {
      const response = await postUpdate(API_ENDPOINTS.UPDATE_MENU, data)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error updating menu')
    }
  },
)

// Delete Menu
export const deleteMenu = createAsyncThunk(
  'menu/delete',
  async ({ menuId, updatedBy }, { rejectWithValue }) => {
    try {
      await postUpdate(API_ENDPOINTS.DELETE_MENU, { menuId, updatedBy })
      return menuId
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting menu')
    }
  },
)

// Slice
const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    data: [],
    selectedMenu: null,
    roleMenus: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // All Menus
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.data = action.payload || []
        state.loading = false
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })

      // Menu by ID
      .addCase(fetchMenuById.fulfilled, (state, action) => {
        state.selectedMenu = action.payload[0] || null
      })
      .addCase(fetchMenuById.rejected, (state, action) => {
        state.error = action.payload
      })

      // Add
      .addCase(addMenu.fulfilled, (state, action) => {
        state.data.push(action.payload)
      })
      .addCase(addMenu.rejected, (state, action) => {
        state.error = action.payload
      })

      // Update
      .addCase(updateMenu.fulfilled, (state, action) => {
        const updated = action.payload
        const index = state.data.findIndex((m) => m.menuId === updated.menuId)
        if (index !== -1) {
          state.data[index] = updated
        }
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.error = action.payload
      })

      // Delete
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.data = state.data.filter((menu) => menu.menuId !== action.payload)
      })
      .addCase(deleteMenu.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default menuSlice.reducer
