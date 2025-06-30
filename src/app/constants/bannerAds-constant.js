import Image from "next/image";

export const API_ENDPOINTS = {
    GET_ALL_BANNER: '/Banner/getAllBanner',
    ADD_BANNER:'/Banner/addBanner',
    UPDATE_BANNER:'/Banner/updateBanner',
    DELETE_BANNER:'/Banner/deleteBanner',
  };
  
 export const Columns = [
   { key: 'id', label: 'S.No.' },
   { key: 'title', label: 'Banner Name' },
   { key: 'subTitle', label: 'Description' },
   { key: 'image', label: 'Image',render: (value) => (
     <div className="overflow-hidden rounded-md">
       <Image
         src={value} 
         alt="Banner" 
         layout="responsive" 
         width={64} 
         height={80}
         className="object-cover hello"
       />
     </div>
   ),},
   { key: 'status', label: 'Status' }
 ];