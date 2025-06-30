export const API_ENDPOINTS = {
    GET_ALL_SHIPPING: "/Shipping/getAllShipping",
    UPDATE_ORDER_STATUS_ADMIN: "/Order/updateOrderStatusAdmin"
};

export const Columns = [
    { key: 'id', label: 'S.No' },
    { key: 'createdDate', label: 'Order Date' },
    { key: 'orderNo', label: 'Order No.' },
    { key: 'shippedFrom', label: 'Shipped From'},
    { key: 'shippedDate', label: 'Shipping Date'},
    { key: 'username', label: 'User Name' },
    { key: 'trackingNo', label: 'Tracking No' },
    { key: 'carrier', label: 'Carrier' },
    { key: 'estimateDelivery', label: 'estimateDelivery' },
    { key: 'status', label: 'Status' }
];