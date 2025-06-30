import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAdminUserId, getRequest, postRequest, postUpdate} from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/paymentMethod-constant'

export const fetchAllPaymentMethod = createAsyncThunk(
  'paymentMethod/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.GET_PAYMENT_MODE);

      if (!response || !response.data) {
        throw new Error('Invalid order data received');
      }
      return response.data;

    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching orders');
    }
  },
)

export const addPaymentMethod = createAsyncThunk(
  'paymentMethod/add',
  async (paymentMethodData, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.ADD_PAYMENT_MODE, paymentMethodData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to add payment method'
      );
    }
  }
);

export const updatePaymentMethod = createAsyncThunk(
  'paymentMethod/update',
  async (paymentMethodData, { rejectWithValue }) => {
    try {
      const response = await postUpdate(
        API_ENDPOINTS.UPDATE_PAYMENT_MODE,
        paymentMethodData,

      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update payment method'
      );
    }
  }
);

export const deletePaymentMode = createAsyncThunk(
    'paymentMethod/delete',
    async (paymentModeId, { rejectWithValue }) => {
      try {
        const payload = {
          paymentModeId,
          updatedBy: getAdminUserId(),
        };
        const response = await postRequest(
          API_ENDPOINTS.DELETE_PAYMENT_MODE,
          payload
        ); 
        return response;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message || 'Failed to delete Payment method'
        );
      }
    }
  );

const paymentMethod = createSlice({
  name: 'PaymentMethod',
  initialState: {
    paymentMethodData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPaymentMethod.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllPaymentMethod.fulfilled, (state, action) => {
        state.paymentMethodData = action.payload
        state.loading = false
      })
      .addCase(fetchAllPaymentMethod.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })

    builder
      .addCase(addPaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Payment Method added successfully!';
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });

    builder
      .addCase(updatePaymentMethod.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Payment Method updated successfully!';
      })
      .addCase(updatePaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(deletePaymentMode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deletePaymentMode.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.error = null;
      })
      .addCase(deletePaymentMode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      });
  },
})

export default paymentMethod.reducer