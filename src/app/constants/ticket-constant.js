export const API_ENDPOINTS = {
    GET_ALL_TICKETS: "/Banner/getAllTicketAdmintest",
    TICKET_REPLY: "/Banner/addTicketReplytest",
    GET_TICKET_REPLY_BY_TICKET_ID: "/Banner/getTicketBYTicketId",
    DELETE_TICKET: "/Banner/closeTicketTest",
    GET_ALL_CLOSED_TICKET:"/Banner/getAllclosedTicket"
};

export const Columns = [
    { id: 'sno', label: 'S.No' },
    { id: 'UserID', label: 'User ID' },
    { id: 'UserName', label: 'Name' },
    { id: 'Subject', label: 'Subject' },
    { id: 'Status', label: 'Status' },
    { id: 'action', label: 'Action' },
];
