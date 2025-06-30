export const API_ENDPOINTS = {
    GET_PAYMENT_MODE: "/Payment/getPaymentMode",
    ADD_PAYMENT_MODE: "/Payment/addPaymentMode",
    UPDATE_PAYMENT_MODE: "/Payment/updatePaymentMode",
    DELETE_PAYMENT_MODE: "/Payment/deletePaymentMode",
};

export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'paymentName', label: 'Payment Name' },
    { key: 'status', label: 'Status' }
];