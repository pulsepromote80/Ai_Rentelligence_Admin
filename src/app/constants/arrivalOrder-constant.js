export const API_ENDPOINTS = {
    GET_ALL_ARRIVED_TO_ORDER_LIST_ADMIN: "/Order/getAllArrivedToOrderlistAdmin",
    UPDATE_ORDER_STATUS_ADMIN: "/Order/updateOrderStatusAdmin"
};

export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'orderNo', label: 'Order No.' },
    { key: 'username', label: 'User Name' },
    { key: 'arrivedDate', label: 'Arrived Date'},
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
    { key: 'arrivedTo', label:'Arrived To'},
    { key: 'status', label: 'Status' },
    { key: 'orderId', label: 'order id' }
];