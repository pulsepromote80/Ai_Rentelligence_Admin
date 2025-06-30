export const API_ENDPOINTS = {
    RETURN_ORDER_LIST_ADMIN: "/Order/returnOrderlistAdmin",
    UPDATE_ORDER_STATUS_ADMIN: "/Order/updateOrderStatusAdmin"
};

export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key:'orderNo', label: 'Order No.'},
    { key: 'createdDate', label: 'Order Date' },
    { key: 'username', label: 'User Name' },
    { key: 'totalAmount', label: 'Total Amount' },
    { key: 'price', label: 'Price' },
    { key: 'discountPrice', label: 'Discount Price' },
    { key: 'deliveryCharge', label: 'Delivery Charge' },
    { key: 'gstCharge', label: 'GST Charge' },
    { key: 'extraCharge', label: 'Extra Charge' },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'status', label: 'Status' }
];
