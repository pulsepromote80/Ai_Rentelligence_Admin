export const API_ENDPOINTS = {
    GET_SELLER: "/Seller/getAllSeller",
    ADD_SELLER: "/Seller/addSeller",
    UPDATE_SELLER: "/Seller/updateSeller",
    DELETE_SELLER: "/Seller/deleteSeller",
    GET_ALL_ACTIVE_SELLER : "/Seller/getAllActiveSeller",
    SELLER_IS_ACTIVE:"/Seller/sellerIsActive"
};
export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'name', label: 'Seller Name' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'email', label: 'Email' },
    { key: 'streetAddress', label: 'Street Address' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'pincode', label: 'Pincode' },
    { key: 'country', label: 'Country' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' }
    
];
