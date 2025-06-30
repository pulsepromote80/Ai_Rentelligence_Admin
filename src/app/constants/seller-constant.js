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
    { key: 'status', label: 'Status' },
    {
        key: 'sellerActive',
        label: 'Seller Active',
        render: (value, row, onActivateSeller, onDelete = false) => {
            if (onDelete) return null;
            if (row.status === 'Activated') {
                return <button className="px-3 py-1 text-white bg-green-400 rounded cursor-not-allowed" disabled>Activated</button>;
            }
            if (row.status === 'UserInActive') {
                return (
                    <button
                        className="px-3 py-1 text-white bg-gray-400 rounded cursor-not-allowed"
                        disabled
                    >
                        Activate
                    </button>
                );
            }
            return (
                <button
                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-500"
                    onClick={() => onActivateSeller(row.sellerId)}
                >
                    Activate
                </button>
            );
        },
    },
];
