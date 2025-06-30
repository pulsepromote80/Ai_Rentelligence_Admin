export const API_ENDPOINTS = {
    GET_ALL_NOTIFICATION: "/Notification/getAllNotification",
    ADD_NOTIFICATION: "/Notification/addNotification",
    UPDATE_NOTIFICATION: "/Notification/updateNotification",
    DELETE_NOTIFICATION: "/Notification/deleteNotification"
};

export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'title', label: 'Notification Name' },
    { key: 'description', label: 'Notification Description' },
    { key: 'status', label: 'Status' }
];