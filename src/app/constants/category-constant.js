import Image from "next/image";
export const API_ENDPOINTS = {
    CATEGORY: '/Category/getAllCategory',
    ADD_CATEGORY: '/Category/addCategory',
    UPDATE_CATEGORY: '/Category/updateCategory', 
    DELETE_CATEGORY: '/Category/deleteCategory',
    GET_ALL_ACTIVE_CATEGORY:'/Category/getAllActiveCategory',
  };

export const Columns = [
  { key: 'id', label: 'S.No.' },
  { key: 'name', label: 'Category Name' },
  { key: 'image', label: 'Image',render: (value) => (
    <div className="overflow-hidden rounded-md">
      <Image 
        src={value} 
        alt="Category" 
        layout="responsive" 
        width={64} 
        height={80}
        className="object-cover hello"
      />
    </div>
  ),},
  { key: 'status', label: 'Status' }
];