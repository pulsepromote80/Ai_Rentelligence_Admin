import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postformRequest, getRequest, postRequest, getAdminUserId } from '@/app/pages/api/auth';
import { API_ENDPOINTS } from '@/app/constants/event-constant'


export const getevent = createAsyncThunk(
    "event/getevent",
    async (id, { rejectWithValue }) => {
        try {
            const endpoint = id
                ? `${API_ENDPOINTS.GET_ALL_EVENT_MASTER}/${id}`
                : API_ENDPOINTS.GET_ALL_EVENT_MASTER;

            const response = await getRequest(endpoint);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Failed to fetch events"
            );
        }
    }
);

export const addevent = createAsyncThunk(
    'event/addevent',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await postformRequest(API_ENDPOINTS.ADD_EVENT_MASTER, formData);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || 'Something went wrong'
            );
        }
    }
);
export const updateevent = createAsyncThunk(
    'event/updateevent',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await postformRequest(API_ENDPOINTS.UPDATE_EVENT, formData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const eventSchedule = createAsyncThunk(
    'event/eventSchedule',
    async (data, { rejectWithValue }) => {
        try {
            const response = await postRequest(API_ENDPOINTS.ADD_EVENT_SCHEDULE, data);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const eventSlice = createSlice({
    name: "event",
    initialState: {
        loading: false,
        error: null,
        success: null,
        data: [],
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        }
    },
    extraReducers: (builder) => {

        builder
            .addCase(getevent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getevent.fulfilled, (state, action) => {
                state.loading = false;
                // Debug log

                // Multiple ways to extract the data - try each one
                const eventsData = action.payload?.data?.event ||
                    action.payload?.event ||
                    action.payload ||
                    [];

                state.data = Array.isArray(eventsData) ? eventsData : [];
            })
            .addCase(getevent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addevent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(addevent.fulfilled, (state, action) => {
                state.loading = false;
                state.success = action.payload.message;
            })
            .addCase(addevent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateevent.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateevent.fulfilled, (state, action) => {
                state.loading = false;
                const updatedIndex = state.data.findIndex(
                    (item) => item.EventMasterID === action.payload.EventMasterID
                );
                if (updatedIndex !== -1) {
                    state.data[updatedIndex] = action.payload;
                }
            })
            .addCase(updateevent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(eventSchedule.pending, (state) => {
                state.loading = true;
            })
            .addCase(eventSchedule.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(eventSchedule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { clearError, clearSuccess } = eventSlice.actions;
export default eventSlice.reducer;