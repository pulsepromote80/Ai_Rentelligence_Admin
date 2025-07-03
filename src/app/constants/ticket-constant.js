export const API_ENDPOINTS = {
    GET_ALL_TICKETS: "/Ticket/getAllTicket",
    ADD_TICKET_REPLY: "/Ticket/addTicketReply",
    GET_ALL_TICKET_BY_ID: "/Ticket/getAllTicketByTicketId",
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