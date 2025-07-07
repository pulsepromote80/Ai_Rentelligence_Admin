export const API_ENDPOINTS = {
    GET_ALL_TICKETS: "/Ticket/getAllTicket",
    TICKET_REPLY: "/Ticket/TicketReply",
    GET_TICKET_REPLY_BY_TICKET_ID: "/Ticket/getTicketReplyByTicketId",
    DELETE_TICKET: "/Ticket/deleteTicket"
};

export const Columns = [
    { id: 'id', label: 'S.No.' },
    {id: 'name', label: 'Name'},
    { id: 'ticketType', label: 'Ticket Type' },
    { id: 'subject', label: 'Subject' },
    { id: 'message', label: 'Message' },
    { id: 'image', label: 'Image' },
    { id: 'active', label: 'Status' },

];