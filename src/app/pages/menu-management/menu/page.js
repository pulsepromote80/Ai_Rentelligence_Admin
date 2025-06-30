'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/menu-constant'
import {fetchMenus,addMenu,updateMenu,deleteMenu,} from '@/app/redux/menuSlice'
import { toast } from 'react-toastify'
import DeletePopup from '@/app/common/utils/delete-popup'
import { limitToCharacters, validateRequiredField } from '@/app/common/utils/validationHelpers'

const Menu = () => {
  const dispatch = useDispatch()
  const { loading, data,error } = useSelector((state) => state.menu ?? {})

  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [menuDetails, setMenuDetails] = useState({
    menuName: '',
    menuIcon: '',
     pageName: '',
     controllerName: '',
     actionName: '',
    displayOrder: 1,
    active: true,
  })
  const [menuId, setMenuId] = useState(null)
  const [errors, setErrors] = useState({})
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [menuToDelete, setMenuToDelete] = useState(null)

  useEffect(() => {
    dispatch(fetchMenus())
  }, [dispatch])

  const validateForm = () => {
    const newErrors = {}

    const menuError = validateRequiredField(menuDetails.menuName, "Menu Name");
    if (menuError) newErrors.menuName = menuError;
                  
    const menuIconError = validateRequiredField(menuDetails.menuIcon, "Menu Icon");
    if (menuIconError) newErrors.menuIcon = menuIconError;
    
    const menuDetailsError = validateRequiredField(menuDetails.pageName, "Page Name");
    if (menuDetailsError) newErrors.pageName = menuDetailsError;
                  
    const controllerNameError = validateRequiredField(menuDetails.controllerName, "Controller Name");
    if (controllerNameError) newErrors.controllerName = controllerNameError;

    const actionNameError = validateRequiredField(menuDetails.actionName, "Action Name");
    if (actionNameError) newErrors.actionName = actionNameError;
                  
    const displayOrderError = validateRequiredField(menuDetails.displayOrder, "Display Order");
    if (displayOrderError) newErrors.displayOrder = displayOrderError;

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      if (editMode) {
        await dispatch(updateMenu({ ...menuDetails, menuId })).unwrap()
        toast.success('Menu updated successfully')
      } else {
        await dispatch(addMenu(menuDetails)).unwrap()
        toast.success('Menu added successfully')
      }

      dispatch(fetchMenus())
      setShowForm(false)
      setEditMode(false)
      resetForm()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Something went wrong')
    }
  }

  const resetForm = () => {
    setMenuDetails({
      menuName: '',
      menuIcon: '',
      pageName: '',
      controllerName: '',
      actionName: '',
      displayOrder: 1,
      active: true,
    })

    setErrors({})
    setMenuId(null)
  }

  const handleEdit = (menu) => {
    setEditMode(true)
    setMenuId(menu.menuId)
    setMenuDetails({
      menuName: menu.menuName,
      menuIcon: menu.menuIcon,
      controllerName: menu.controllerName ?? '',
      actionName: menu.actionName ?? '',
      pageName: menu.pageName || '',
      displayOrder: menu.displayOrder,
      active: menu.active,
    })
    setErrors({})
    setShowForm(true)
  }
  
  const handleDeleteClick = (menu) => {
    setMenuToDelete(menu)
    setShowDeletePopup(true)
  }
  
  const handleDeleteConfirm = async () => {
    if (menuToDelete) {
      try {
        const response = await dispatch(deleteMenu({ menuId: menuToDelete.menuId })).unwrap()
        if (response.statusCode === 200) {
          toast.success(response.message)
        } else {
          toast.error(response.message)
        }
      } catch (error) {
        console.error('Delete error:', error)
      }
      setShowDeletePopup(false)
      dispatch(fetchMenus())
    }
  }
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    const finalValue = type === 'checkbox'
    ? checked
    : limitToCharacters(value); 

    setMenuDetails((prev) => ({
      ...prev,
      [name]: finalValue,
    }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  return (
    <div className="max-w-full pt-8 mx-auto mt-5 mb-6 bg-white rounded-lg">
      <div className="flex">
        <div className="w-full md:w-[45%] flex justify-center md:justify-start">
          {!showForm && (
            <button
              className="px-4 py-2 mt-3 text-white rounded-md bg-add-btn"
              onClick={() => {
                setShowForm(true)
                setEditMode(false)
                resetForm()
              }}
            >
              + Add Menu
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="p-4 mb-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
            <h2 className="col-span-2 mb-4 text-2xl font-bold text-center text-add-label">
              {editMode ? 'Edit Menu' : 'Add Menu'}
            </h2>

            {/* Menu Name */}
            <div>
              <label className="block font-medium">Menu Name</label>
              <input
                type="text"
                name="menuName"
                value={menuDetails.menuName}
                onChange={handleChange}
                placeholder="Enter Menu Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34] mt-2"
              />
              {errors.menuName && (
                <p className="text-sm text-red-500">{errors.menuName}</p>
              )}
            </div>

            {/* Menu Icon */}
            <div>
              <label className="block font-medium">Menu Icon</label>
              <input
                type="text"
                name="menuIcon"
                value={menuDetails.menuIcon}
                onChange={handleChange}
                placeholder="Enter Menu Icon"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34] mt-2"
              />
              {errors.menuIcon && (
                <p className="text-sm text-red-500">{errors.menuIcon}</p>
              )}
            </div>

            <div>
              <label className="block font-medium">Page Name</label>
              <input
                type="text"
                name="pageName"
                value={menuDetails.pageName}
                onChange={handleChange}
                placeholder="Enter Page Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34] mt-2"
              />
              {errors.pageName && (
                <p className="text-sm text-red-500">{errors.pageName}</p>
              )}
            </div>

            {/* Controller Name */}
            <div>
              <label className="block font-medium">Controller Name</label>
              <input
                type="text"
                name="controllerName"
                value={menuDetails.controllerName}
                onChange={handleChange}
                placeholder="Enter Controller Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34] mt-2"
              />
              {errors.controllerName && (
                <p className="text-sm text-red-500">{errors.controllerName}</p>
              )}
            </div>

            {/* Action Name */}
            <div>
              <label className="block font-medium">Action Name</label>
              <input
                type="text"
                name="actionName"
                value={menuDetails.actionName}
                onChange={handleChange}
                placeholder="Enter Action Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34] mt-2"
              />
              {errors.actionName && (
                <p className="text-sm text-red-500">{errors.actionName}</p>
              )}
            </div>

            {/* Display Order */}
            <div>
              <label className="block font-medium">Display Order</label>
              <input
                type="number"
                name="displayOrder"
                value={menuDetails.displayOrder ?? ''}
                onChange={handleChange}
                placeholder="Enter Display Order"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5E34] mt-2"
              />
              {errors.displayOrder && (
                <p className="text-sm text-red-500">{errors.displayOrder}</p>
              )}
            </div>

            {/* Status */}
      
            <div className="flex items-center col-span-2 gap-2 mt-2">
              <input
                type="checkbox"
                id="isactive"
                checked={menuDetails.active}
                onChange={(e) =>
                  setMenuDetails({ ...menuDetails, active: e.target.checked })
                }
                className="w-5 h-5"
              />
              <label htmlFor="status" className="font-medium">
                Active
              </label>
            </div>

            <div className="flex col-span-2 gap-3 pt-4">
              <button
                type="submit"
                className="px-4 py-2 text-white rounded-md bg-submit-btn hover:bg-green-700"
                disabled={loading}
              >
                {editMode ? 'Update Menu' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditMode(false)
                  resetForm()
                }}
                className="px-4 py-2 text-white rounded-md bg-cancel-btn hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
         <>
          {error && <p className="text-red-500">Error: {error}</p>}
    <Table
    columns={Columns}
    data={data}
    loading={loading}
    onEdit={handleEdit}
    onDelete={handleDeleteClick}
    title="Menu"
  />
  </>
      )}

      {showDeletePopup && menuToDelete && (
        <DeletePopup
        show={showDeletePopup}
        type="menu"
        name={menuToDelete?.menuName}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteConfirm}
      />
      )}
    </div>
  )
}

export default Menu
