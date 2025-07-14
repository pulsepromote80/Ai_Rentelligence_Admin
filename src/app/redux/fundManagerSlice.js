import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequest, getRequest } from "@/app/pages/api/auth";
const API_ENDPOINTS = {
    GET_ALL_FUND_REQUEST_REPORT_ADMIN: "/FundManager/getAllFundRequestReport_Admin",
    UPDATE_REQUEST_STATUS_ADMIN: "/FundManager/updateFundRequestStatus_Admin",
    GET_RENT_WALLET: "/AdminManageUser/getRentWallet",
    GET_ALL_INCOME_REQUEST_ADMIN: "/FundManager/getAllIncomeRequest_Admin",
    UPDATE_INCOME_WITHDRAW_REQUEST_STATUS_ADMIN: "/FundManager/UpIncomeWithdReqStatus_Admin"
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

export const getRentWallet = createAsyncThunk(
    "fundManager/getRentWallet",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(
                API_ENDPOINTS.GET_RENT_WALLET,
                data
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

export const getAllIncomeRequestAdmin = createAsyncThunk(
    "fundManager/getAllIncomeRequestAdmin",
    async (data, { rejectWithValue }) => {
        try {
            const response = await getRequest(
                API_ENDPOINTS.GET_ALL_INCOME_REQUEST_ADMIN,
                data
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

export const UpIncomeWithdReqStatusAdmin = createAsyncThunk(
    "fundManager/updateIncomeWithdrawRequestStatusAdmin",
    async (AuthLoginId, { rejectWithValue }) => {
        try {
            const response = await getRequest(
                `${API_ENDPOINTS.UPDATE_INCOME_WITHDRAW_REQUEST_STATUS_ADMIN}?AuthLoginId=${AuthLoginId}`
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
        updateFundRequestData: null,
        rentWalletData: null,
        withdrawRequestData: null,
        updateIncomingRequestData: null,
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
            })
            .addCase(getRentWallet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRentWallet.fulfilled, (state, action) => {
                state.loading = false;
                state.rentWalletData = action.payload;
            })
            .addCase(getRentWallet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getAllIncomeRequestAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllIncomeRequestAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.withdrawRequestData = action.payload;
            })
            .addCase(getAllIncomeRequestAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(UpIncomeWithdReqStatusAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(UpIncomeWithdReqStatusAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.updateIncomingRequestData = action.payload;
            })
            .addCase(UpIncomeWithdReqStatusAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
});
export default fundManagerSlice.reducer;