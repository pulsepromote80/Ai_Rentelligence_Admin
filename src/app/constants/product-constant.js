export const API_ENDPOINTS = {
  GET_ALL_PRODUCT: '/Product/getAllProduct',
  ADD_PRODUCT: '/Product/addProduct',
  DELETE_PRODUCT: '/Product/deleteProduct',
  UPDATE_PRODUCT: '/Product/updateProduct',
  ADD_PRODUCT_IMAGE: '/Product/addProductImage',
  GET_BY_ID_PRODUCT: '/Product/getByIdProduct',
  GET_BY_ID_IMAGE: '/Product/getByIdImage',
  UPDATE_METATAGS_BY_PRODUCTID: '/Product/updateMetaTagsByProductId',
  DELETE_PRODUCT_IMAGE: '/Product/deleteProductImage'
};

export const Columns = [
  { key: 'image', label: 'Add Image' },
  { key: 'id', label: 'S.No.' },
  { key: 'productName', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'categoryName', label: 'Category Name' },
  { key: 'subCategoryName', label: 'SubCategory Name' },
  { key: 'subCategoryTypeName', label: 'SubCategory Type Name' },
  { key: 'sellerName', label: 'Seller Name' },
  { key: 'subName', label: 'Sub Title' },
  { key: 'rating', label: 'Rating' },
  { key: 'mrp', label: 'MRP' },
  { key: 'price', label: 'Price' },
  { key: 'discountPrice', label: 'Discount Price' },
  { key: 'perHour', label: 'PerHour' },
  { key: 'unit', label: 'Unit' },
  { key: 'weeklyReturn', label:'Weekly Return ($)'},
  { key: 'month', label:'Monthly Return ($)'},
  { key: 'totalReturn', label:'Total Return ($)'},
  { key: 'status', label: 'Status' },
];