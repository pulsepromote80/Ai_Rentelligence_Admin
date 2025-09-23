import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getRequest,postRequest } from "@/app/pages/api/auth";

const API_ENDPOINTS = {
    GET_DIRECT_MEMBER: "/Community/getdirectMember",
    GET_PERSONAL_TEAM_LIST: "/Community/getPersonalTeamList",
    GET_NETWORK_TREE:"/WalletReport/getNetworkTree"
};
export const getdirectMember = createAsyncThunk(
    "community/getdirectMember",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(
                API_ENDPOINTS.GET_DIRECT_MEMBER,
                data
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

export const getPersonalTeamList = createAsyncThunk(
    "community/getPersonalTeamList",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(
                API_ENDPOINTS.GET_PERSONAL_TEAM_LIST,
                data
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);
export const getNetworkTree = createAsyncThunk(
    "community/getNetworkTree",
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(`${API_ENDPOINTS.GET_NETWORK_TREE}?authlogin=${data}`
            );
            return response.data;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

const communitySlice = createSlice({
    name: "community",
    initialState: {
        loading: false,
        error: null,
        directMemberData: null,
        personalTeamList: null,
        getNetworkTreeData:null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getdirectMember.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getdirectMember.fulfilled, (state, action) => {
                state.loading = false;
                state.directMemberData = action.payload;
                state.error = null;
            })
            .addCase(getdirectMember.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getPersonalTeamList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPersonalTeamList.fulfilled, (state, action) => {
                state.loading = false;
                state.personalTeamList = action.payload;
                state.error = null;
            })
            .addCase(getPersonalTeamList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getNetworkTree.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase( getNetworkTree.fulfilled, (state, action) => {
                state.loading = false;
                state.getNetworkTreeData = action.payload;
                state.error = null;
            })
            .addCase( getNetworkTree.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});
export default communitySlice.reducer;