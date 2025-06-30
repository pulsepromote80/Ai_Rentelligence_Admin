export const API_ENDPOINTS = {
    GET_ALL_SUB_CATEGORY_TYPE: '/SubCategoryType/getAllSubCategoryType',
    ADD_SUB_CATEGORY_TYPE: '/SubCategoryType/addSubCategoryType',
    UPDATE_SUB_CATEGORY_TYPE: '/SubCategoryType/updateSubCategoryType',
    DELETE_SUB_CATEGORY_TYPE: '/SubCategoryType/deleteSubCategoryType',
    GET_ALL_ACTIVE_SUBCATEGORY_TYPE: '/SubCategoryType/getAllActiveSubCategoryType',
};
export const Columns = [
    { key: 'subcategoryTypeId', label: 'S.No.' },
    { key: 'categoryName', label: 'Category Name' },
    { key: 'subCategoryName', label: 'SubCategory Name' },
    { key: 'name', label: 'SubCategory Type' },
    { key: 'status', label: 'Status' }
];