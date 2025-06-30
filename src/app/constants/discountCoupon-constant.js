export const API_ENDPOINTS = {
    GET_ALL_COUPON: "/Discount/getAllCoupon",
    ADD_COUPON: "/Discount/addCoupon",
    UPDATE_COUPON: "/Discount/updateCoupon",
    DELETE_COUPON: "/Discount/deleteCoupon"
};

export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'code', label: 'Code' },
    { key: 'details', label: 'Details' },
    { key: 'amount', label: 'Amount' },
    { key: 'amountType', label: 'Amount Type' },
    { key: 'status', label: 'Status' }
];