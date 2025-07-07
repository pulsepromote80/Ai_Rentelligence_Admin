import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequest,getRequest } from "@/app/pages/api/auth";
const API_ENDPOINTS = {
    GET_ALL_FUND_REQUEST_REPORT_ADMIN: "/FundManager/getAllFundRequestReport_Admin",
    UPDATE_REQUEST_STATUS_ADMIN: "/FundManager/updateFundRequestStatus_Admin"
};
export const getAllFundRequestReportAdmin = createAsyncThunk(
    "fundManager/getAllFundRequestReportAdmin",
    async (data, { rejectWithValue }) => {
        try {
            const response = await getRequest(
                API_ENDPOINTS.GET_ALL_FUND_REQUEST_REPORT_ADMIN,
                data
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

export const updateFundRequestStatusAdmin = createAsyncThunk(
    "fundManager/updateFundRequestStatusAdmin",
    async (AuthLoginId, { rejectWithValue }) => {
        try {
            const response = await getRequest(
                `${API_ENDPOINTS.UPDATE_REQUEST_STATUS_ADMIN}?AuthLoginId=${AuthLoginId}`
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

const fundManagerSlice = createSlice({
    name: "fundManager",
    initialState: {
        loading: false,
        error: null,
        fundRequestData: null,
        updateFundRequestData: null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllFundRequestReportAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFundRequestReportAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.fundRequestData = action.payload;
            })
            .addCase(getAllFundRequestReportAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateFundRequestStatusAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateFundRequestStatusAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.updateFundRequestData = action.payload;
            })
            .addCase(updateFundRequestStatusAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    
        }
});
export default fundManagerSlice.reducer;