import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequest, postRequestLoginId } from "@/app/pages/api/auth";

const API_ENDPOINTS = {
    CHANGE_ADMIN_PASSWORD: "/AdminMaster/chanegAdminPassword",
    USERNAME_BY_LOGINID: "/AdminMaster/userNameByLoginId",
    BLOCK_USER_BY_ADMIN: "/AdminMaster/blockUserByAdmin"
};

export const ChangePasswordAdminMaster = createAsyncThunk(
    "adminMaster/changePasswordAdminMaster",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(API_ENDPOINTS.CHANGE_ADMIN_PASSWORD, data);
            return response;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const usernameLoginId = createAsyncThunk(
    'adminMaster/usernameLoginId',
    async (authLogin, { rejectWithValue }) => {
        try {
            const response = await postRequestLoginId(`${API_ENDPOINTS.USERNAME_BY_LOGINID}?authLogin=${authLogin}`);

            if (!response) {
                throw new Error('Invalid user wallet details data received');
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching user wallet details');
        }
    }
);

export const blockUserByAdmin = createAsyncThunk(
    'adminMaster/blockUserByAdmin',
    async (authLogin, { rejectWithValue }) => {
        try {
            const response = await postRequestLoginId(`${API_ENDPOINTS.BLOCK_USER_BY_ADMIN}?authLogin=${authLogin}`);

            if (!response) {
                throw new Error('Invalid user wallet details data received');
            }

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching user wallet details');
        }
    }
);

const adminMasterSlice = createSlice({
    name: "adminMaster",
    initialState: {
        status: null,
        loading: false,
        error: null,
        ChangePasswordData: null,
        usernameData: null,
        blockUserData: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearChangePasswordData: (state) => {
            state.ChangePasswordData = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(ChangePasswordAdminMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(ChangePasswordAdminMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.ChangePasswordData = action.payload;
                state.error = null;
            })
            .addCase(ChangePasswordAdminMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(usernameLoginId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(usernameLoginId.fulfilled, (state, action) => {
                state.usernameData = action.payload;
                state.loading = false;
            })
            .addCase(usernameLoginId.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(blockUserByAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(blockUserByAdmin.fulfilled, (state, action) => {
                state.blockUserData = action.payload;
                state.loading = false;
            })
            .addCase(blockUserByAdmin.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    }
});

export const { clearError, clearChangePasswordData } = adminMasterSlice.actions;
export default adminMasterSlice.reducer;