
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  addCloud, 
  getCloud, 
  deleteCloudImage, 
  resetDeleteState,
  setEditingItem,
  clearEditingItem 
} from "@/app/redux/cloudSlice";
import Table from "@/app/common/datatable";
import { Columns } from "@/app/constants/cloud-constant";
import { toast } from "react-toastify";
import DeletePopup from "@/app/common/utils/delete-popup";
import { 
  cloudData, 
  cloudLoading, 
  cloudDeleteLoading,
  cloudDeleteSuccess,
  cloudDeleteError,
  cloudEditingItem 
} from "./cloud-selectors";

const Cloud = () => {
  const dispatch = useDispatch();
  const loading = useSelector(cloudLoading) || false;
  const deleteLoading = useSelector(cloudDeleteLoading) || false;
  const deleteSuccess = useSelector(cloudDeleteSuccess);
  const deleteError = useSelector(cloudDeleteError);
  const editingItem = useSelector(cloudEditingItem);
  const data = useSelector(cloudData) || [];

  const [imageName, setImageName] = useState("");
  const [image, setImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    if (editingItem) {
      setImageName(editingItem.imageName || "");
      setImage(null); 
      setShowForm(true);
    }
  }, [editingItem]);

  useEffect(() => {
    dispatch(getCloud());
    setMounted(true);
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Cloud image deleted successfully!");
      dispatch(resetDeleteState());
      dispatch(getCloud()); 
    }
    
    if (deleteError) {
      toast.error(deleteError);
      dispatch(resetDeleteState());
    }
  }, [deleteSuccess, deleteError, dispatch]);

  const resetForm = () => {
    setImageName("");
    setImage(null);
    setShowForm(false);
    setErrors({});
    dispatch(clearEditingItem());
  };

  const validateForm = () => {
    const newErrors = {};
    if (!imageName.trim()) newErrors.imageName = "Image Name is required.";
    if (!editingItem && !image) newErrors.image = "Image file is required.";
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
    
    if (image) {
      formData.append("image", image);
    }
    
    // For edit, add Id parameter
    if (editingItem?.id) {
      formData.append("Id", editingItem.id);
    }

    try {
      const response = await dispatch(addCloud(formData)).unwrap();
      if (response.statusCode === 200 || response.statuscode === 1) {
        toast.success(
          editingItem 
            ? "Cloud image updated successfully!" 
            : "Cloud image added successfully!"
        );
        resetForm();
        dispatch(getCloud());
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(
        editingItem 
          ? "Failed to update cloud image" 
          : "Failed to add cloud image"
      );
    }
  };

  const previewImage = useMemo(() => {
    if (!mounted) return null;
    
    if (editingItem?.imageURL && !image) {
      return (
        <div className="mt-2">
          <p className="text-sm text-gray-600">Current Image:</p>
          <img
            src={editingItem.imageURL}
            width={128}
            height={128}
            alt="Current"
            className="object-cover w-32 h-32 mt-1 border rounded"
          />
        </div>
      );
    }
    
    // Show preview for new image
    if (image) {
      const src = URL.createObjectURL(image);
      return (
        <div className="mt-2">
          <p className="text-sm text-gray-600">
            {editingItem ? "New Image Preview:" : "Image Preview:"}
          </p>
          <img
            src={src}
            width={128}
            height={128}
            alt="Preview"
            className="object-cover w-32 h-32 mt-1 border rounded"
          />
        </div>
      );
    }
    
    return null;
  }, [image, mounted, editingItem]);

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeletePopup(true);
  };

  const handleEdit = (category) => {
    dispatch(setEditingItem(category));
  };

  const confirmDelete = async () => {
    if (categoryToDelete?.id) {
      try {
        await dispatch(deleteCloudImage(categoryToDelete.id)).unwrap();
      } catch (error) {
        toast.error("Failed to delete cloud image");
      }
    }
    setShowDeletePopup(false);
    setCategoryToDelete(null);
  };

  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      active: true
    }));
  }, [data]);

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
          <h2 className="mb-4 font-bold text-left text-black">
            {editingItem ? "Edit Cloud Image" : "Add Cloud Image"}
          </h2>

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

          <label className="block font-medium">
            {editingItem ? "Select New Image" : "Select Image"}
          </label>
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
              {loading 
                ? (editingItem ? "Updating..." : "Uploading...") 
                : (editingItem ? "Update" : "Submit")
              }
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
          data={processedData}
          loading={loading}
          title={"Cloud Images"}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showDeletePopup && (
        <DeletePopup
          show={showDeletePopup}
          type="cloud"
          name={categoryToDelete?.imageName}
          loading={deleteLoading}
          onCancel={() => {
            setShowDeletePopup(false);
            setCategoryToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default React.memo(Cloud);