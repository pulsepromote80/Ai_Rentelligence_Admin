export const API_ENDPOINTS = {
    GET_PAYMENT_LIST: "/Payment/getPaymentList"
};

export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'username', label: 'User Name' },
    { key: 'transactionId', label: 'Transaction Id' },
    { key: 'status', label: 'Status' },
    { key: 'price', label: 'Price' },
    { key: 'discountPrice', label: 'Discount Price' },
    { key: 'deliveryCharge', label: 'Delivery Charge' },
    { key: 'gstCharge', label: 'GST Charge' },
    { key: 'extraCharge', label: 'Extra Charge' },
    { key: 'totalAmount', label: 'Total Amount' },
];