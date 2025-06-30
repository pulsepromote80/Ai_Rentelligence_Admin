export const API_ENDPOINTS = {
    GET_ALL_COMPLETED_ORDER_ADMIN: "/Order/getAllCompletedOrderAdmin"
};

export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'createdDate', label: 'Order Date' },
    { key: 'orderNo', label: 'Order No.' },
    { key: 'orderId', label: 'Order Id' },
    { key: 'username', label: 'User Name' },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'trackingNo', label: 'trackingNo' },
    { key: 'arrivedTo', label:'Arrived To'},
    { key: 'shippedFrom', label:'Shipped From'},
    { key: 'status', label: 'Status' }
    
];