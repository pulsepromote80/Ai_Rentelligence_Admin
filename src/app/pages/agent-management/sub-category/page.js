'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubCategoryList, addSubCategory, deleteSubCategory, updateSubCategory } from '@/app/redux/subcategorySlice';
import { fetchActiveCategoryList } from '@/app/redux/categorySlice';
import Table from '@/app/common/datatable';
import { Columns } from '@/app/constants/subcategory-constant';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { subCategoryLoading } from './subCategory-selectors';
import DeletePopup from '@/app/common/utils/delete-popup';
import Image from "next/image";
import { limitToCharacters, validateRequiredField, validateRequiredSelect, validateRequiredImage } from '@/app/common/utils/validationHelpers';

const SubCategory = () => {
  const dispatch = useDispatch();
  const { categoryData } = useSelector((state) => state?.category ?? []);
  const loading = useSelector(subCategoryLoading);
  const { subCategoryList } = useSelector((state) => state?.subCategory ?? []);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState('');
  const [image, setImage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editSubCategoryId, setEditSubCategoryId] = useState(null);
  const [active, setActive] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState(null);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    dispatch(fetchActiveCategoryList());
    dispatch(getSubCategoryList());
  }, [dispatch, showForm]);

  const validateForm = () => {
    const newErrors = {};

    const categoryError = validateRequiredSelect(selectedCategory, "Category");
    if (categoryError) newErrors.selectedCategory = categoryError;

    const nameError = validateRequiredField(subCategoryName, "Sub Category Name");
    if (nameError) { newErrors.subCategoryName = nameError;} 

    const imageError = validateRequiredImage(image, "Image");
    if (imageError) newErrors.image = imageError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const options = categoryData?.map((category) => ({
    value: category.categoryId,
    label: category.name,
  }));

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    if (errors.image) {
      setErrors((prevErrors) => ({ ...prevErrors, image: '' }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const formData = new FormData();
    formData.append('categoryId', selectedCategory.value);
    formData.append('name', subCategoryName);
    formData.append('image', image); 
    formData.append('active', active);

    try {
      if (editMode) {
        formData.append('subCategoryId', editSubCategoryId);
        const response = await dispatch(updateSubCategory(formData)).unwrap();
        if (response.statusCode === 200) {
          toast.success(response.message);
        }
        else {
          toast.error(response.message);
        }
      } else {
        const response = await dispatch(addSubCategory(formData)).unwrap();
        if (response.statusCode === 200) {
          toast.success(response.message);
        }
        else if (response.statusCode === 417) {
          toast.warn(response.message);
        } else {
          toast.error(response.message);
        }
      }
      setSelectedCategory(null);
      setSubCategoryName('');
      setImage('');
      setEditMode(false);
      setActive(false);
      setShowForm(false);
      setErrors({});
      dispatch(fetchActiveCategoryList());
    } catch { }
  };

  //  Open Edit Form
  const handleEdit = (subcategory) => {
    setErrors({});
    const categoryOption = options.find(
      (opt) => opt.label?.toLowerCase() === subcategory.categoryName?.toLowerCase());
    setSelectedCategory(categoryOption || null);
    setSubCategoryName(subcategory.name);
    setImage(subcategory.image);
    setEditSubCategoryId(subcategory.subCategoryGUID);
    setEditMode(true);
    setShowForm(true);
    setActive(subcategory.active ?? false);
  };

  const handleDelete = (subcategory) => {
    setSubCategoryToDelete(subcategory);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await dispatch(deleteSubCategory(subCategoryToDelete.subCategoryGUID)).unwrap();
      if (res.statusCode === 200) toast.success(res.message);
      else toast.error(res.message);
      dispatch(getSubCategoryList());
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete Sub category");
    } finally {
      setShowDeletePopup(false);
      setSubCategoryToDelete(null);
    }
  };

  const subCategoryTable = subCategoryList?.map((sub) => ({
    subcategoryId: sub.subcategoryId,
    name: sub.name,
    image:sub.image,
    categoryName: sub.categoryName,
    status: sub.status,
    active: sub.active,
    subCategoryGUID: sub.subCategoryGUID
  }));

  const submitButtonText = loading ? (editMode ? "Updating..." : "Adding...") : (editMode ? "Update" : "Submit");

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg">
      {/*  Add Subcategory Button */}
      <div className='flex'>
        <div className="flex justify-center w-full sm:justify-start">
          {!showForm && (
            <button
              onClick={() => {
                setShowForm(true);
                setErrors({});
              }}
              className="px-4 py-2 mt-3 text-white rounded-md bg-add-btn"
            >
              + Add Subcategory
            </button>
          )}
        </div>

      </div>

      {showForm && (
        <div className="p-4 mb-4 rounded-md ">
          <h2 className="mb-10 font-bold text-left text-black">
            {editMode ? 'Edit Subcategory' : 'Add Subcategory'}
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <label className="block font-medium">Category Name</label>
            {/* Category Selector */}
            <Select
              options={options}
              value={selectedCategory}
              onChange={(option) => {
                setSelectedCategory(option)
                if (errors.selectedCategory) {
                  setErrors((prevErrors) => ({ ...prevErrors, selectedCategory: '' }));
                }
              }
              }
              placeholder="Select Category"
              isClearable={!editMode}
              isDisabled={editMode}
            />

            {errors.selectedCategory && <p className="mt-1 text-sm text-red-500">{errors.selectedCategory}</p>}
            <label className="block font-medium">SubCategory Name</label>
            {/* Subcategory Name */}
            <input
              type="text"
              value={subCategoryName}
              onChange={(e) => {
                const limitedValue = limitToCharacters(e.target.value);
                setSubCategoryName(limitedValue);
                if (errors.subCategoryName) {
                  setErrors((prevErrors) => ({ ...prevErrors, subCategoryName: '' }));
                }
              }}
              placeholder="Enter Subcategory Name"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />

            {errors.subCategoryName && <p className="mt-1 text-sm text-red-500">{errors.subCategoryName}</p>}

            <label className="block font-medium">Add Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          {previewImage}
          {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
          
            {/*  Active Checkbox */}
            {editMode && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-5 h-5 mr-2 cursor-pointer"
                />
                <label className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            )}

            {/*  Submit and Cancel Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 text-white rounded bg-submit-btn hover:bg-green-600"
                disabled={loading}
              >
                {submitButtonText}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedCategory(null);
                  setSubCategoryName('');
                  setEditMode(false);
                  setActive(false);
                  setErrors({});
                }}
                className="px-4 py-2 text-white rounded bg-cancel-btn hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/*  Table Component */}
      {!showForm && (
        <Table
          columns={Columns}
          data={subCategoryTable}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          title={'Sub Category'}
        />)}

      {/* Delete Confirmation Popup */}
      <DeletePopup
        show={showDeletePopup}
        type="sub category"
        name={subCategoryToDelete?.name}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default SubCategory;
