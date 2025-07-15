import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest,setToken ,setAdminUserId,setUsername} from "../pages/api/auth";
import Cookies from "js-cookie";
import { all } from "axios";

const API_ENDPOINTS = {

  ADMINLOGIN: "/AdminAuthentication/adminLogin",
  USERFORGET: "/AdminAuthentication/adminSendOtp",
  REGISTER: "/AdminAuthentication/addAdminUser",
  VERIFYOTP: "/AdminAuthentication/adminVerifyOtp",
  RESETPASSWORD: "/AdminAuthentication/adminForgotPassword",
  BULKREGISTRATION: "/AdminAuthentication/addBulkRegsitration"
};

export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.ADMINLOGIN, { username, password });

      if (response.statusCode !== 200 || !response.token) {
        throw new Error(response.message || "Login failed!");
      }

      const token = response.token;
      const adminUserId = response.data?.adminUserId;
      
      setToken(token);
      setAdminUserId(adminUserId);
      setUsername(username);

      return { token, adminUserId, username};
    } catch (error) {
      return rejectWithValue(error.message || "Login failed!");
    }
  }
);

export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async ({ username }, { rejectWithValue }) => {  
    try {
      const response = await postRequest(API_ENDPOINTS.USERFORGET, { username }); 
      return username; 
    } catch (error) {
      console.error(" OTP API Error:", error.response?.data || "Error sending OTP");
      return rejectWithValue(error.response?.data?.message || "Error sending OTP");
    }
  }
);

// Async Thunk for User Registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.REGISTER, formData);
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ username, otp }, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.VERIFYOTP, { username, otp });
      if (response.statusCode == 200) {
        return { username };
      }
      return rejectWithValue(response.message || "Invalid OTP");
    } catch (error) {
      console.error("OTP Verify Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Invalid OTP");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ username, newPassword }, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.RESETPASSWORD, { 
        username:username, 
        password: newPassword 
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error resetting password");
    }
  }
);

export const bulkRegistration = createAsyncThunk(
  "auth/bulkRegistration",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.BULKREGISTRATION, data);
      return response.data;
    } catch (error) {
      console.error("Bulk Registration API Error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    loading: false,
    error: null,
    userData: null,
    adminUserId: null,
    appRoleId: null,
    forgotPasswordUsername: null,
    user: null,
    success: false,
    bulkRegistrationData: null,
    allUserRegistrations: null,
  },
  reducers: {
    logout: (state) => {
      Cookies.remove("token");
      Cookies.remove("userData");
      Cookies.remove("adminUserId");
      //Cookies.remove("appRoleId");
      state.isAuthenticated = false;
      state.userData = null;
      state.adminUserId = null;
      state.appRoleId = null;
      state.forgotPasswordUsername = null;
      state.success = false;
      state.bulkRegistrationData = null;
    },
    resetForgotPasswordState: (state) => {
      state.forgotPasswordUsername = null;
      state.loading = false;
      state.error = null;
    },
    resetVerifyOtpState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
  
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.adminUserId = action.payload.adminUserId;
        state.appRoleId = action.payload.appRoleId;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed!";
      })
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.forgotPasswordUsername = action.payload;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
      })
      
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.forgotPasswordUsername = action.payload.username; 
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })
      .addCase(bulkRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bulkRegistrationData = action.payload;
      })
      .addCase(bulkRegistration.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });     
  },
});

export const { logout, resetForgotPasswordState, resetVerifyOtpState,clearError } = authSlice.actions;
export default authSlice.reducer;
