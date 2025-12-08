'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getSubCategoryTypeList,
  addSubCategoryType,
  deleteSubCategoryType,
  updateSubCategoryType,
} from '@/app/redux/subcategoryTypeSlice'
import { fetchActiveCategoryList } from '@/app/redux/categorySlice'
import { fetchActiveSubCategoryList } from '@/app/redux/subcategorySlice'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/subcategorytype-constant'
import Select from 'react-select'
import { toast } from 'react-toastify';
import { CloudHail } from 'lucide-react'
import DeletePopup from '@/app/common/utils/delete-popup'
import { limitToCharacters, validateRequiredField, validateRequiredSelect } from '@/app/common/utils/validationHelpers'
import Spinner from '@/app/common/spinner'

const SubCategoryType = () => {
  const dispatch = useDispatch()
  const [formErrors, setFormErrors] = useState({
    category: '',
    subCategory: '',
    subCategoryTypeName: '',
  })

  const { categoryData } = useSelector(
    (state) => state?.category ?? [],
  )
  const subCategoryList = useSelector((state) => state?.subCategory?.subCategoryData
    ?? [])
  const subcate = useSelector((state) => state)

  const { subCategoryTypeList, loading } = useSelector(
    (state) => state?.subCategoryType ?? [],
  )
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState(null)
  const [subCategoryTypeName, setSubCategoryTypeName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editSubCategoryTypeId, setEditSubCategoryTypeId] = useState(null)
  const [active, setActive] = useState(false) 
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [subCategoryTypeToDelete, setSubCategoryTypeToDelete] = useState(null);
  useState(null)
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchActiveCategoryList())
    dispatch(fetchActiveSubCategoryList())
    dispatch(getSubCategoryTypeList())
  }, [dispatch])

  const categoryOptions = categoryData?.map((category) => ({
    value: category.categoryId,
    label: category.name,
  }))

  const subCategoryOptions = subCategoryList
    .filter((sub) => sub.categoryId === selectedCategory?.value && sub.active)
    .map((sub) => ({
      value: sub.subCategoryGUID,
      label: sub.name,
    }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    let errors = {}
    const categoryError = validateRequiredSelect(selectedCategory, "Category");
    if (categoryError) errors.category = categoryError;

    const subCategoryError = validateRequiredSelect(selectedSubCategory, "Subcategory");
    if (subCategoryError) errors.subCategory = subCategoryError;

    const subCategoryTypeNameError = validateRequiredField(subCategoryTypeName, "Subcategory Type Name");
    if (subCategoryTypeNameError) errors.subCategoryTypeName = subCategoryTypeNameError;

    setFormErrors(errors)

    // Agar koi error hai to return kar jao
    if (Object.keys(errors).length > 0) return

    if (!selectedCategory || !selectedSubCategory || !subCategoryTypeName) {
      return
    }

    const subCategoryTypeData = {
      categoryId: selectedCategory.value,
      subCategoryId: selectedSubCategory.value,
      name: subCategoryTypeName,
      active: active,
      ...(editMode && { subCategoryTypeId: editSubCategoryTypeId }),
    }

    try {
      if (editMode) {
        const response = await dispatch(
          updateSubCategoryType(subCategoryTypeData),
        ).unwrap()
        if (response.data?.statusCode === 200) {
          toast.success(response.data.message)
        } else {
          toast.error(response.data.message)
        }
      } else {
        const response = await dispatch(
          addSubCategoryType(subCategoryTypeData),
        ).unwrap()
        if (response.statusCode === 200) {
          toast.success(response.message)
        } else if (response.statusCode === 417) {
          toast.warn(response.message)
        } else {
          toast.error(response.message)
        }
      }
      resetForm()
      setErrors({});
      dispatch(getSubCategoryTypeList())
    } catch (error) { }
  }
  const resetForm = () => {
    setSelectedCategory(null)
    setSelectedSubCategory(null)
    setSubCategoryTypeName('')
    setEditMode(false)
    setActive(false)
    setShowForm(false)
    setFormErrors({}) // Resetting the form errors here
    setEditSubCategoryTypeId(null)
  }
  // Open Edit Form
  const handleEdit = (subCategoryType) => {
    const categoryOption = categoryOptions.find(
      (opt) => opt.value === subCategoryType.categoryId,
    )
    setSelectedCategory(categoryOption || null)
    const filteredSubCategoryOptions = subCategoryList
      ?.filter((sub) => sub.categoryId === subCategoryType.categoryId)
      ?.map((sub) => ({ value: sub.subCategoryId, label: sub.name }))

    const subCategoryOption = filteredSubCategoryOptions.find(
      (opt) => opt.value === subCategoryType.subCategoryId,
    )
    setSelectedSubCategory(subCategoryOption || null)

    setSubCategoryTypeName(subCategoryType.name)
    setEditSubCategoryTypeId(subCategoryType.subCategoryTypeGUID)
    setEditMode(true)
    setShowForm(true)
    setActive(subCategoryType.active ?? false)
  }

  const handleDelete = (subcategorytype) => {
    setSubCategoryTypeToDelete(subcategorytype);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await dispatch(deleteSubCategoryType(subCategoryTypeToDelete.subCategoryTypeGUID)).unwrap();
      if (response?.data?.statusCode === 200) toast.success(response?.data?.message);
      else toast.error(response.message);
      dispatch(getSubCategoryTypeList());
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete sub category Type");
    } finally {
      setShowDeletePopup(false);
      setSubCategoryTypeToDelete(null);
    }

  };

  const subCategoryTypeTable = subCategoryTypeList?.map((sub) => ({
    subcategoryTypeId: sub.subcategoryTypeId,
    categoryId: sub.categoryId,
    categoryName: sub.categorName,
    subCategoryId: sub.subCategoryId,
    subCategoryName: sub.subCategoryName,
    subCategoryTypeGUID: sub.subCategoryTypeGUID,
    name: sub.name,
    createdDate: sub.createdDate,
    status: sub.status,
    active: sub.active,
  }))

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg">
      <div className="flex justify-center w-full p-4 pb-0 md:justify-start">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 mt-3 text-white rounded-md bg-add-btn"
          >
            + Add Subcategory Type
          </button>
        )}
      </div>


      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <h2 className="font-bold text-left text-black">
            {editMode ? 'Edit Subcategory Type' : 'Add Subcategory Type'}
          </h2>
          <label className="block font-medium">Category Name</label>
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={(option) => {
              setSelectedCategory(option)
              setFormErrors((prev) => ({ ...prev, category: '' }))
              setSelectedSubCategory(null)
            }}
            placeholder="Select Category"
            isClearable={!editMode}
            isDisabled={editMode}
          />
          {formErrors.category && (
            <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
          )}
          <label className="block font-medium">SubCategory Name</label>
          <Select
            options={subCategoryOptions}
            value={selectedSubCategory}
            onChange={(option) => {
              setSelectedSubCategory(option)
              setFormErrors((prev) => ({ ...prev, subCategory: '' }))
            }}
            placeholder="Select Subcategory"
            isClearable={!editMode}
            isDisabled={editMode}
          />
          {formErrors.subCategory && (
            <p className="mt-1 text-sm text-red-600">
              {formErrors.subCategory}
            </p>
          )}
          <label className="block font-medium">SubCategoryType Name</label>
          <input
            type="text"
            value={subCategoryTypeName}
            onChange={(e) => {
              const limitedValue = limitToCharacters(e.target.value);
              setSubCategoryTypeName(limitedValue);
              setFormErrors((prev) => ({ ...prev, subCategoryTypeName: '' }));
            }}
            placeholder="Enter Subcategory Type Name"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          {formErrors.subCategoryTypeName && (
            <p className="mt-1 text-sm text-red-600">
              {formErrors.subCategoryTypeName}
            </p>
          )}

          {/* Active Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="w-5 h-5 mr-2 cursor-pointer"
            />
            <label className="text-sm font-medium text-gray-700">Active </label>
          </div>

          {/*  Submit and Cancel Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white flex gap-2 items-center rounded bg-submit-btn hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner size={4} color='text-white' />
                  {editMode ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                editMode ? 'Update' : 'Submit'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setSelectedCategory(null)
                setSubCategoryTypeName('')
                setEditMode(false)
                setFormErrors({})
                setActive(false)
              }}
              className="px-4 py-2 text-white rounded bg-cancel-btn hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {!showForm && (
        <Table
          columns={Columns}
          data={subCategoryTypeTable}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
          title={'Sub Category Type'}
        />
      )}

      <DeletePopup
        show={showDeletePopup}
        type="sub category type"
        name={subCategoryTypeToDelete?.name}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default SubCategoryType
