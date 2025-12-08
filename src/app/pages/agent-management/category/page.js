"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, getCategory, deleteCategory, updateCategory } from '@/app/redux/categorySlice';
import Table from '@/app/common/datatable';
import { Columns } from '@/app/constants/category-constant';
import { toast } from 'react-toastify';
import Image from "next/image";
import { categoryData, categoryLoading } from "./category-selectors";
import DeletePopup from '@/app/common/utils/delete-popup';
import { limitToCharacters, validateRequiredField } from '@/app/common/utils/validationHelpers';
import Spinner from '@/app/common/spinner';

const Category = () => {
  const dispatch = useDispatch();
  const loading = useSelector(categoryLoading);
  const data = useSelector(categoryData);

  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [active, setActive] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const resetForm = useCallback(() => {
    setName('');
    setImage(null);
    setActive(false);
    setEditMode(false);
    setEditCategoryId(null);
    setShowForm(false);
    setErrors({});
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const limitedName = limitToCharacters(name);
    const nameError = validateRequiredField(limitedName, "Category Name");
    if (nameError) newErrors.name = nameError;

    const imageError = validateRequiredField(image, " Category Image");

    if (imageError) newErrors.image = imageError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    if (errors.image) {
      setErrors((prevErrors) => ({ ...prevErrors, image: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('active', active);

    try {
      let response;

      if (editMode) {
        formData.append('categoryId', editCategoryId);
        formData.append('image', typeof image === 'string' ? "" : image);
        response = await dispatch(updateCategory(formData)).unwrap();
      } else {
        formData.append('image', image);
        response = await dispatch(addCategory(formData)).unwrap();
      }

      if (response.statusCode === 200) toast.success(response.message);
      else if (response.statusCode === 417) toast.warn(response.message);
      else toast.error(response.message);

      resetForm();
      dispatch(getCategory());
    } catch (error) {
      console.error("Error during category submit:", error);
      toast.error(error?.response?.data?.message || "Failed to process request.");
    }
  };

  const handleEdit = (category) => {
    setName(category.name);
    setEditCategoryId(category.categoryId);
    setActive(category.active);
    setEditMode(true);
    setShowForm(true);
    setImage(category.image);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await dispatch(deleteCategory(categoryToDelete.categoryId)).unwrap();
      if (res.statusCode === 200) toast.success(res.message);
      else toast.error(res.message);
      dispatch(getCategory());
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete category");
    } finally {
      setShowDeletePopup(false);
      setCategoryToDelete(null);
    }
  };

  const previewImage = useMemo(() => {
    if (!image) return null;
    const src = typeof image === 'string' ? image : URL.createObjectURL(image);
    return (
      <img
        src={src}
        width={128}
        height={128}
        alt="Preview"
        className="object-cover w-32 h-32 mt-2 border rounded"
      />
    );
  }, [image]);

  const formTitle = editMode ? "Edit Category" : "Add Category";
  const submitButtonText = loading ? (editMode ? "Updating..." : "Adding...") : (editMode ? "Update" : "Submit");

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg">
      {/* Add Category Button */}
      <div className="flex items-center justify-start p-4 pb-0 md:justify-between">
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditMode(false);
              setName('');
              setImage(null);
              setActive(false);
            }}
            className="px-4 py-2 mx-auto mt-3 text-white rounded-md bg-add-btn md:mx-0"
          >
            + Add Category
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="mb-4 font-bold text-left text-black">{formTitle}</h2>
          <label className="block font-medium">Category Name</label>
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => {
              const newName = limitToCharacters(e.target.value); 
              setName(newName);
              if (errors.name) {
                setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          <label className="block font-medium">Add Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          {previewImage}
          {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}

          {editMode && (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-5 h-5 mr-2"
              />
              <label className="text-sm font-medium text-gray-700">Active</label>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-md bg-submit-btn hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading}
            >
              {loading && <Spinner size={4} color="text-white" />}
              {submitButtonText}
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

      {/* Category Table */}
      {!showForm && (
        <Table
          columns={Columns}
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          title={'Category'}
        />
      )}

      <DeletePopup
        show={showDeletePopup}
        type="category"
        name={categoryToDelete?.name}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={confirmDelete}
      />

    </div>
  );
};

export default React.memo(Category);
