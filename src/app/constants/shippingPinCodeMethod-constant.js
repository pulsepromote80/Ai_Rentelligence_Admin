export const API_ENDPOINTS = {
    GET_ALL_PIN_CODE_SHIPPING:'/ShippingMethod/getAllPinCodeShipping',
    ADD_PIN_CODE_SHIPPING:'/ShippingMethod/addPinCodeShipping',
    DELETE_PIN_CODE_SHIPPING:'/ShippingMethod/deletePinCodeShipping',
    UPDATE_PIN_CODE_SHIPPING:'/ShippingMethod/updateShippingPinCodeMethod',
};

  export const Columns = [
    { key: 'id', label: 'S.No.' },
    { key: 'pinCode', label: 'Pin Code' },
    { key: 'shippingMethodName', label: 'Shipping Method' },
    { key: 'status', label: 'Status' },
    { key: 'noOfDays', label: 'noOfDays' },
  ];