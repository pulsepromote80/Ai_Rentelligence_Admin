export const API_ENDPOINTS = {
    GET_SUCCESSFULL_ORDER_ADMIN: "/Order/getSuccessfullOrderAdmin",
    UPDATE_ORDER_STATUS_ADMIN: "/Order/updateOrderStatusAdmin"
};

export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'createdDate', label: 'Order Date' },
    { key: 'orderNo', label: 'Order No.' },
    { key: 'username', label: 'User Name' },
    { key: 'shippedDate', label: 'Shipped Date' },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'deliveryCharge', label: 'Delivery Charge' },
    { key: 'price', label: 'Price' },
    { key: 'discountPrice', label: 'Discount' },
    { key: 'gstCharge', label: 'GST' },
    { key: 'extraCharge', label: 'Extra Charge' },
    { key: 'totalAmount', label: 'Total Amount' },
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'trackingNo', label: 'Tracking No' },
    { key: 'note', label: 'Note' },
    { key: 'status', label: 'Status' },
    { key: 'orderId', label: 'order id' }
];