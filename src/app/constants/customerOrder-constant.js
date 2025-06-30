export const API_ENDPOINTS = {
    GET_ALL_ORDER_BY_USER: "/CustomerManagement/getAllOrderByUser",
    GET_ALL_CONTACT_US:"/Product/getAllcontactus"
};

export const Columns = [
    { key: 'id', label: 'Serial No' },
    { key: 'orderNo', label: 'Order No'},
    { key: 'shippedDate', label: 'Shipped Date' },
    { key: 'price', label: 'Price' },
    { key: 'discountPrice', label: 'Discount Price' },
    { key: 'deliveryCharge', label: 'Delivery Charge' },
    { key: 'gstCharge', label: 'GST Charge' },
    { key: 'extraCharge', label: 'Extra Charge' },
    { key: 'totalAmount', label: 'Total Amount' },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'trackingNo', label: 'Tracking No' },
    { key: 'status', label: 'Status' },
    { key: 'createdDate', label: 'Order Date' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: 'Phone Number' },  
    { key: 'streetAddress', label: 'Street Address' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'pincode', label: 'Pincode' },
    { key: 'country', label: 'Country' }
];

export const columns = [
    { key: 'id', label: 'Serial No' },
    { key: 'name', label: 'Name'},
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject'},
    { key: 'message', label: 'Message' }
    
];