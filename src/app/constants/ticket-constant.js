export const API_ENDPOINTS = {
    GET_ALL_TICKETS: "/Ticket/getAllTicketAdmin",
    TICKET_REPLY: "/Ticket/addTicketReply",
    GET_TICKET_REPLY_BY_TICKET_ID: "/Ticket/getTicketBYTicketId",
    DELETE_TICKET: "/Ticket/closeTicket",
    GET_ALL_CLOSED_TICKET:"/Ticket/getAllclosedTicket",
    SEND_NOTIFICATION:"/Ticket/sendNotification"
};

export const Columns = [
    { id: 'sno', label: 'S.No' },
    { id: 'UserID', label: 'User ID' },
    { id: 'UserName', label: 'Name' },
    { id: 'Subject', label: 'Subject' },
    { id: 'Status', label: 'Status' },
    { id: 'action', label: 'Action' },
];
