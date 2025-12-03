export const API_ENDPOINTS = {
    GET_ALL_TICKETS: "/Ticket/getAllTicketAdmin",
    TICKET_REPLY: "/Ticket/addTicketReply",
    GET_TICKET_REPLY_BY_TICKET_ID: "/Ticket/getTicketBYTicketId",
    DELETE_TICKET: "/Ticket/closeTicket",
    GET_ALL_CLOSED_TICKET:"/Ticket/getAllclosedTicket",
    SEND_NOTIFICATION:"/Ticket/sendNotification",
    SEND_EMAIL:"/Event/sendEmailsAllUser",
    USER_REPLY_COUNT: "/Ticket/userReplyCount",
    UPDATE_USER_REPLY_COUNT: "/Ticket/updateUserReplyCount"
};

export const Columns = [
    { id: 'sno', label: 'S.No' },
    { id: 'UserID', label: 'User ID' },
    { id: 'UserName', label: 'Name' },
    { id: 'Subject', label: 'Subject' },
    { id: 'StatusType', label: 'Status' },
    { id: 'action', label: 'Action' },
];
