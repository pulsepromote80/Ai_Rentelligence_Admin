import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postRequestLoginId, postRequest } from '@/app/pages/api/auth';
import { API_ENDPOINTS } from '@/app/constants/userWalletDetails-constant';

// Fetch User Wallet Details (GET Request)
export const getUserWalletDetails = createAsyncThunk(
    'adminManageFund',
    async (loginId, { rejectWithValue }) => {
      try {
        const response = await postRequestLoginId(`${API_ENDPOINTS.GET_USER_WALLET_DETAILS}?LoginId=${loginId}`);

        if (!response) {
          throw new Error('Invalid user wallet details data received');
        }
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Error fetching user wallet details');
      }
    }
  ); 


export const addFund = createAsyncThunk(
  'adminManageFund/addFund',
  async (fundData, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.ADD_CREDIT_DEBIT_FUND, fundData);
      if (!response) {
        throw new Error('Invalid add fund response');
      }
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error adding fund');
    }
  }
);

const adminManageFundSlice = createSlice({
  name: 'adminManageFund',
  initialState: {
    data: [],
    loading: false,
    error: null,
    addFundSuccess: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserWalletDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserWalletDetails.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getUserWalletDetails.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });

    builder
      .addCase(addFund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFund.fulfilled, (state, action) => {
        state.loading = false;
        state.addFundSuccess = action.payload;
      })
      .addCase(addFund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminManageFundSlice.reducer;
