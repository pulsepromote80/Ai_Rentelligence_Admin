// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import Table from "@/app/common/datatable";
// // import { Columns } from "@/app/constants/cloud-constant";
// import { Columns } from "@/app/constants/cloud-constant";
// import { toast } from "react-toastify";
// import DeletePopup from "@/app/common/utils/delete-popup";
// import { cloudData, cloudLoading } from "./cloud-selectors";
// import { addCloud, getCloud } from "@/app/redux/cloudSlice";

// const Cloud = () => {
//   const dispatch = useDispatch();
//   const loading = useSelector(cloudLoading) || false;
//   const data = useSelector(cloudData) || [];

//   const [imageName, setImageName] = useState("");
//   const [image, setImage] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [mounted, setMounted] = useState(false);

//   const [showDeletePopup, setShowDeletePopup] = useState(false);
//   const [categoryToDelete, setCategoryToDelete] = useState(null);

//   useEffect(() => {
//     dispatch(getCloud());
//     setMounted(true);
//   }, [dispatch]);

//   const resetForm = () => {
//     setImageName("");
//     setImage(null);
//     setShowForm(false);
//     setErrors({});
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!imageName.trim()) newErrors.imageName = "Image Name is required.";
//     if (!image) newErrors.image = "Image file is required.";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]);
//     if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const formData = new FormData();
//     formData.append("ImageName", imageName);
//     formData.append("image", image);

//     try {
//       const response = await dispatch(addCloud(formData)).unwrap();
//       if (response.statusCode === 200 || response.statuscode === 1)
//         toast.success(response.message);
//       else toast.error(response.message);

//       resetForm();
//       dispatch(getCloud());
//     } catch (error) {
//       toast.error("Failed to add cloud image");
//     }
//   };

//   const previewImage = useMemo(() => {
//     if (!mounted || !image) return null;
//     const src = URL.createObjectURL(image);
//     return (
//       <img
//         src={src}
//         width={128}
//         height={128}
//         alt="Preview"
//         className="object-cover w-32 h-32 mt-2 border rounded"
//       />
//     );
//   }, [image, mounted]);

//   const handleDelete = (category) => {
//     setCategoryToDelete(category);
//     setShowDeletePopup(true);
//   };

//   const confirmDelete = async () => {
//     // Add delete API logic here if needed
//     setShowDeletePopup(false);
//     setCategoryToDelete(null);
//     dispatch(getCloud());
//   };
//   console.log("cloud data", data);
//   return (
//     <div className="max-w-full mx-auto bg-white rounded-lg">
//       <div className="flex items-center justify-start p-4 pb-0 md:justify-between">
//         {!showForm && (
//           <button
//             onClick={() => setShowForm(true)}
//             className="px-4 py-2 mx-auto mt-3 text-white rounded-md bg-add-btn md:mx-0"
//           >
//             + Add Cloud Image
//           </button>
//         )}
//       </div>

//       {showForm && (
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <h2 className="mb-4 font-bold text-left text-black">Add Cloud Image</h2>

//           <label className="block font-medium">Image Name</label>
//           <input
//             type="text"
//             placeholder="Enter Image Name"
//             value={imageName}
//             onChange={(e) => setImageName(e.target.value)}
//             className="w-full p-3 border border-gray-300 rounded-md"
//           />
//           {errors.imageName && (
//             <p className="text-sm text-red-500">{errors.imageName}</p>
//           )}

//           <label className="block font-medium">Select Image</label>
//           <input
//             type="file"
//             onChange={handleImageChange}
//             className="w-full p-3 border border-gray-300 rounded-md"
//           />
//           {previewImage}
//           {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}

//           <div className="flex gap-2">
//             <button
//               type="submit"
//               className="px-4 py-2 text-white rounded-md bg-submit-btn hover:bg-green-700"
//               disabled={loading}
//             >
//               {loading ? "Uploading..." : "Submit"}
//             </button>
//             <button
//               type="button"
//               onClick={resetForm}
//               className="px-4 py-2 text-white rounded-md bg-cancel-btn hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}

//       {!showForm && mounted && (
//         <Table
//           columns={Columns}
//           data={data}
//           loading={loading}
//           title={"Cloud Images"}
//           onDelete={handleDelete}
//         />
//       )}

//       {showDeletePopup && (
//         <DeletePopup
//           show={showDeletePopup}
//           type="cloud"
//           name={categoryToDelete?.imageName}
//           onCancel={() => setShowDeletePopup(false)}
//           onConfirm={confirmDelete}
//         />
//       )}
//     </div>
//   );
// };

// export default React.memo(Cloud);

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCloud, getCloud } from "@/app/redux/cloudSlice";
import Table from "@/app/common/datatable";
import { Columns } from "@/app/constants/cloud-constant";
import { toast } from "react-toastify";
import DeletePopup from "@/app/common/utils/delete-popup";
import { cloudData, cloudLoading } from "./cloud-selectors";

const Cloud = () => {
  const dispatch = useDispatch();
  const loading = useSelector(cloudLoading) || false;
  const data = useSelector(cloudData) || [];

  const [imageName, setImageName] = useState("");
  const [image, setImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    dispatch(getCloud());
    setMounted(true);
  }, [dispatch]);

  const resetForm = () => {
    setImageName("");
    setImage(null);
    setShowForm(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!imageName.trim()) newErrors.imageName = "Image Name is required.";
    if (!image) newErrors.image = "Image file is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("ImageName", imageName);
    formData.append("image", image);

    try {
      const response = await dispatch(addCloud(formData)).unwrap();
      if (response.statusCode === 200 || response.statuscode === 1)
        toast.success(response.message);
      else toast.error(response.message);

      resetForm();
      dispatch(getCloud());
    } catch (error) {
      toast.error("Failed to add cloud image");
    }
  };

  const previewImage = useMemo(() => {
    if (!mounted || !image) return null;
    const src = URL.createObjectURL(image);
    return (
      <img
        src={src}
        width={128}
        height={128}
        alt="Preview"
        className="object-cover w-32 h-32 mt-2 border rounded"
      />
    );
  }, [image, mounted]);

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    // Add delete API logic here if needed
    setShowDeletePopup(false);
    setCategoryToDelete(null);
    dispatch(getCloud());
  };

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg">
      <div className="flex items-center justify-start p-4 pb-0 md:justify-between">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 mx-auto mt-3 text-white rounded-md bg-add-btn md:mx-0"
          >
            + Add Cloud Image
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="mb-4 font-bold text-left text-black">Add Cloud Image</h2>

          <label className="block font-medium">Image Name</label>
          <input
            type="text"
            placeholder="Enter Image Name"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          {errors.imageName && (
            <p className="text-sm text-red-500">{errors.imageName}</p>
          )}

          <label className="block font-medium">Select Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          {previewImage}
          {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-md bg-submit-btn hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-white rounded-md bg-cancel-btn hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!showForm && mounted && (
        <Table
          columns={Columns}
          data={data}
          loading={loading}
          title={"Cloud Images"}
          onDelete={handleDelete}
        />
      )}

      {showDeletePopup && (
        <DeletePopup
          show={showDeletePopup}
          type="cloud"
          name={categoryToDelete?.imageName}
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default React.memo(Cloud);
