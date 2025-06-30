export const API_ENDPOINTS = {
    GET_ALL_SHIPPING_METHOD: "/ShippingMethod/getAllShippingMethod",
    ADD_SHIPPING_METHOD: "/ShippingMethod/addShippingMethod",
    UPDATE_SHIPPING_METHOD: "/ShippingMethod/updateShippingMethod",
    DELETE_SHIPPING_METHOD: "/ShippingMethod/deleteShippingMethod"
};

export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'name', label: 'Shipping Method Name' },
    { key: 'courier', label: 'Courier' },
    { key: 'shippingZone', label: 'Shipping Zone' },
    { key: 'baseCost', label: 'Base Cost' },
    { key: 'costPerKg', label: 'Cost Per Kg' },
    { key: 'maxWeightLimit', label: 'Max Weight Limit' },
    { key: 'minOrderValue', label: 'Min Order Value' },
    { key: 'trackingURL', label: 'Tracking URL' },
    { key: 'status', label: 'Status' }
];