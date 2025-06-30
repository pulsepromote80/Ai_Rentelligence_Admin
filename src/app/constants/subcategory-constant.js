export const API_ENDPOINTS = {

  GET_ALL_SUB_CATEGORY: '/SubCategory/getAllSubCategory',
  ADD_SUB_CATEGORY: '/SubCategory/addSubCategory',
  DELETE_SUB_CATEGORY: '/SubCategory/deleteSubCategory',
  UPDATE_SUB_CATEGORY: '/SubCategory/updateSubCategory',
  GET_ALL_ACTIVE_SUBCATEGORY: '/SubCategory/getAllActiveSubCategory'

};

export const Columns = [
  { key: 'subcategoryId', label: 'S.No.' },
  { key: 'name', label: 'SubCategory Name' },
  { key:'image', label: 'Image'},
  { key: 'categoryName', label: 'Category Name' },
  { key: 'status', label: 'Status' }
];