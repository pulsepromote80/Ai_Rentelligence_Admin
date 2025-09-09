import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postRequest, getRequestLoginId,postRequestLoginId, getRequest } from "@/app/pages/api/auth";
import { toast } from "react-toastify";

const API_ENDPOINTS = {
    CHANGE_ADMIN_PASSWORD: "/AdminMaster/chanegAdminPassword",
    USERNAME_BY_LOGINID: "/AdminMaster/userNameByLoginId",
    BLOCK_USER_BY_ADMIN: "/AdminMaster/blockUserByAdmin",
    CHANGE_ADMIN_SPONSOR_ID: "/AdminMaster/chanegAdminSponsorID",
    DOWNLOAD_EXCEL: "/AdminMaster/downloadExcel",
    GET_NEWS: "/AdminMaster/getNews",
    UPDATE_NEWS: "/AdminMaster/updateNews",
    GET_LEASE_AGENT: "/AdminMaster/getLeaseAgent",
    GET_ALL_CONTACT_US: "/Geography/getAllContacUs",
   GET_ACC_STATEMENT:"/WalletReport/getAccStatemtnt"
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
            const response = await getRequestLoginId(`${API_ENDPOINTS.USERNAME_BY_LOGINID}?authLogin=${authLogin}`);
            

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

export const ChangeAdminSponser = createAsyncThunk(
    'adminMaster/ChangeAdminSponser',
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(API_ENDPOINTS.CHANGE_ADMIN_SPONSOR_ID, data);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error changing sponsor');
        }
    }
);

export const downloadExcel = createAsyncThunk(
    'adminMaster/downloadExcel',
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(API_ENDPOINTS.DOWNLOAD_EXCEL, data);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error downloading Excel');
        }
    }
);

export const getNews = createAsyncThunk(
    'adminMaster/getNews',
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(API_ENDPOINTS.GET_NEWS, data);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching news');
        }
    }
);

export const updateNews = createAsyncThunk(
    'adminMaster/updateNews',
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(API_ENDPOINTS.UPDATE_NEWS, data);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching news');
        }
    }
);

export const getLeaseAgent = createAsyncThunk(
    "adminMaster/getLeaseAgent",
    async (data, { rejectWithValue }) => {
        try {
            const response = await getRequest(
                API_ENDPOINTS.GET_LEASE_AGENT,
                data
            );
            return response;
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || "Failed to fetch community data");
        }
    }
);

export const getAllContactUs = createAsyncThunk(
    'adminMaster/getAllContactUs',
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(API_ENDPOINTS.GET_ALL_CONTACT_US, data);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching contact us data');
        }
    }
);

export const getAccStatemtnt = createAsyncThunk(
    'adminMaster/getAccStatemtnt',
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(API_ENDPOINTS.GET_ACC_STATEMENT, data);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error fetching contact us data');
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
        updateNewsData: null,
        newsData: null,
        usernameData: null,
        blockUserData: null,
        sponserData: null,
        excelData: null,
        leaseAgentData: null,
        contactUsData: null,
        accStatementData:null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearChangePasswordData: (state) => {
            state.ChangePasswordData = null;
        },
         clearUsernameData: (state) => {
            state.usernameData = null; 
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
            })
            .addCase(ChangeAdminSponser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(ChangeAdminSponser.fulfilled, (state, action) => {
                state.sponserData = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(ChangeAdminSponser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(downloadExcel.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(downloadExcel.fulfilled, (state, action) => {
                state.excelData = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(downloadExcel.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            .addCase(getNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNews.fulfilled, (state, action) => {
                state.loading = false;
                state.newsData = action.payload;
                state.error = null;
            })
            .addCase(getNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateNews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNews.fulfilled, (state, action) => {
                state.loading = false;
                state.updateNewsData = action.payload;
                state.error = null;
            })
            .addCase(updateNews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getLeaseAgent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLeaseAgent.fulfilled, (state, action) => {
                state.loading = false;
                state.leaseAgentData = action.payload;
            })
            .addCase(getLeaseAgent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

              .addCase(getAllContactUs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllContactUs.fulfilled, (state, action) => {
                state.loading = false;
                state.contactUsData = action.payload;
                state.error = null;
            })
            .addCase(getAllContactUs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }) 

              .addCase(getAccStatemtnt.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAccStatemtnt.fulfilled, (state, action) => {
                state.loading = false;
                state.accStatementData = action.payload;
                state.error = null;
            })
            .addCase(getAccStatemtnt.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }) 
    }
});

export const { clearError, clearChangePasswordData,clearUsernameData  } = adminMasterSlice.actions;
export default adminMasterSlice.reducer;