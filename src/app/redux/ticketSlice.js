'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getRequest, postformRequest, postRequest } from '@/app/pages/api/auth'
import { API_ENDPOINTS } from '@/app/constants/ticket-constant'

export const fetchAllTickets = createAsyncThunk(
  'ticket/fetchAllTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequest(API_ENDPOINTS.GET_ALL_TICKETS)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching tickets')
    }
  }
)

export const addTicketReply = createAsyncThunk(
  'ticket/addTicketReply',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postformRequest(API_ENDPOINTS.TICKET_REPLY, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error replying to ticket');
    }
  }
)

export const getAllTicketByTicketId = createAsyncThunk(
  'ticket/getAllTicketByTicketId',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await postRequest(`${API_ENDPOINTS.GET_TICKET_REPLY_BY_TICKET_ID}?TicketId=${ticketId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching ticket');
    }
  }
)


export const deleteTicket = createAsyncThunk(
  'ticket/deleteTicket',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await postRequest(`${API_ENDPOINTS.DELETE_TICKET}?TicketId=${ticketId}`)
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error deleting ticket')
    }
  }
)

// Create Slice
const ticketSlice = createSlice({
  name: 'ticket',
  initialState: {
    tickets:null,
    ticketDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearTicketDetails: (state) => {
      state.ticketDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch All Tickets
      .addCase(fetchAllTickets.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.tickets = action.payload
        state.loading = false
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })

      .addCase(addTicketReply.pending, (state) => {
        state.loading = true
      })
      .addCase(addTicketReply.fulfilled, (state, action) => {
        state.tickets = state.tickets.map(ticket =>
          ticket.id === action.payload.id ? action.payload : ticket
        )
        state.loading = false
      })
      .addCase(addTicketReply.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })

      .addCase(getAllTicketByTicketId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTicketByTicketId.fulfilled, (state, action) => {
        state.ticketDetails = action.payload;
        state.loading = false;
      })
      .addCase(getAllTicketByTicketId.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(deleteTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        if (state.tickets) {
          state.tickets = state.tickets.filter(ticket => ticket.TicketId !== action.meta.arg.ticketId);
        }
        state.loading = false;
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
  },
})

export const { clearTicketDetails } = ticketSlice.actions;
export default ticketSlice.reducer
