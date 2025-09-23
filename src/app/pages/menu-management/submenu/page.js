'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { toast } from 'react-toastify'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/submenu-constant'
import DeletePopup from '@/app/common/utils/delete-popup'
import {
  addSubMenu,
  deleteSubMenu,
  fetchMenu,
  fetchSubmenuByMenuId,
  updateSubMenu,
} from '@/app/redux/submenuSlice'
import {
  limitToCharacters,
  validateRequiredField,
  validateRequiredSelect,
} from '@/app/common/utils/validationHelpers'

const SubMenu = () => {
  const dispatch = useDispatch()
  const [errors, setErrors] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [subMenuToDelete, setSubMenuToDelete] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editSubMenuId, setEditSubMenuId] = useState(null)
  const [hasMounted, setHasMounted] = useState(false)

  const { menu, subMenu, loading } = useSelector(
    (state) => state?.submenu ?? [],
  )
  const [formState, setFormState] = useState({
    selectedMenu: null,
    subMenuName: '',
    subMenuPageName: '',
    displayOrder: '',
    active: false,
  })

  useEffect(() => {
    setHasMounted(true)
    dispatch(fetchMenu())
  }, [dispatch])

  useEffect(() => {
    if (formState.selectedMenu?.value) {
      dispatch(fetchSubmenuByMenuId(formState.selectedMenu.value))
    }
  }, [dispatch, formState.selectedMenu?.value])

   const tableData = subMenu?.map((row, index) => ({
  ...row,
  sno: index + 1, 
}))


  const validateForm = () => {
    const newErrors = {}

    const menuError = validateRequiredSelect(
      formState.selectedMenu,
      'Menu Name',
    )
    if (menuError) newErrors.selectedMenu = menuError

    const subMenuNameError = validateRequiredField(
      formState.subMenuName,
      'Sub Menu Name',
    )
    if (subMenuNameError) newErrors.subMenuName = subMenuNameError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const options = menu?.map((menu) => ({
    value: menu.menuId,
    label: menu.menuName,
  }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const { selectedMenu, subMenuName, subMenuPageName, displayOrder, active } =
      formState

    const submenuData = {
      menuId: selectedMenu.value,
      subMenuName: subMenuName,
      subMenuPageName: subMenuPageName || 'defaultPageName',
      displayOrder: displayOrder || 0,
      active: active,
    }

    try {
      if (editMode) {
        submenuData.subMenuId = editSubMenuId
        const response = await dispatch(updateSubMenu(submenuData)).unwrap()
        toast[response.statusCode === 200 ? 'success' : 'error'](
          response.message,
        )
      } else {
        const response = await dispatch(addSubMenu(submenuData)).unwrap()
        if (response.statusCode === 200) {
          toast.success(response.message)
        } else if (response.statusCode === 417) {
          toast.warn(response.message)
        } else {
          toast.error(response.message)
        }
      }
      resetForm()
      await dispatch(fetchSubmenuByMenuId(formState.selectedMenu.value))
    } catch (error) {
      toast.error('Something went wrong!')
    }
  }
  const handleEdit = (submenu) => {
    const menuOption = options.find((opt) => opt.value === submenu.menuId)

    const { subMenuName, subMenuPageName, displayOrder, active } = submenu

    setFormState({
      selectedMenu: menuOption || null,
      subMenuName,
      subMenuPageName,
      displayOrder,
      active,
    })
    setEditSubMenuId(submenu.subMenuId)
    setEditMode(true)
    setShowForm(true)
  }
  const handleDelete = (submenu) => {
    setSubMenuToDelete(submenu)
    setShowDeletePopup(true)
  }
  const confirmDelete = async () => {
    try {
      const res = await dispatch(
        deleteSubMenu(subMenuToDelete.subMenuId),
      ).unwrap()
      if ([200, 204].includes(res.statusCode)) {
        toast.success(res.message || 'Sub Menu deleted successfully!')
      } else {
        toast.error(res.message || 'Failed to delete Sub Menu.')
      }
    } catch (error) {
      toast.error('Something went wrong while deleting Sub Menu.')
    } finally {
      setShowDeletePopup(false)
      setSubMenuToDelete(null)
    }
    if (formState.selectedMenu?.value) {
      await dispatch(fetchSubmenuByMenuId(formState.selectedMenu.value))
    }
  }
  const resetForm = () => {
    setFormState({
      selectedMenu: null,
      subMenuName: '',
      subMenuPageName: '',
      displayOrder: '',
      active: false,
    })
    setEditMode(false)
    setErrors({})
    setShowForm(false)
  }
  const submitButtonText = loading
    ? editMode
      ? 'Updating...'
      : 'Adding...'
    : editMode
      ? 'Update'
      : 'Submit'
  return (
    <div className="max-w-full mx-auto bg-white rounded-lg">
      <div className="flex">
        <div className="w-full md:w-[45%] flex justify-center md:justify-start  p-4 pb-0">
          {!showForm && (
            <button
              onClick={() => {
                setShowForm(true)
                setErrors({})
              }}
              className="px-4 py-2 mt-3 text-white rounded-md bg-add-btn"
            >
              + Add Sub Menu
            </button>
          )}
        </div>
      </div>
      {showForm && (
        <div className="p-4 mb-4 rounded-md">
          <h2 className="mb-5 text-xl font-bold text-left text-black">
            {editMode ? 'Edit Sub Menu' : 'Add Sub Menu'}
          </h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <label className="block font-medium">Menu Name</label>
            {/* Menu Selector */}
            {hasMounted && (
              <Select
                options={options}
                value={formState.selectedMenu}
                onChange={(option) => {
                  setFormState({ ...formState, selectedMenu: option })
                  if (errors.selectedMenu && option?.value) {
                    setErrors((prevErrors) => ({
                      ...prevErrors,
                      selectedMenu: undefined,
                    }))
                  }
                }}
                placeholder="Select Menu"
                isDisabled={editMode}
                className='z-1'
              />
            )}
            {errors.selectedMenu && (
              <p className="mt-1 text-sm text-red-500">{errors.selectedMenu}</p>
            )}

            <label className="block font-medium">Sub Menu Name</label>

            <input
              type="text"
              value={formState.subMenuName}
              onChange={(e) => {
                const limited = limitToCharacters(e.target.value);
                setFormState((prev) => ({ ...prev, subMenuName: limited }));
                setErrors((prev) => ({ ...prev, subMenuName: '' }));
              }}
              placeholder="Enter Sub Menu Name"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            {errors.subMenuName && (
              <p className="mt-1 text-sm text-red-500">{errors.subMenuName}</p>
            )}

            {editMode && (
              <>
                <label className="block font-medium">Sub Menu Page Name</label>
                <input
                  type="text"
                  value={formState.subMenuPageName}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      subMenuPageName: e.target.value,
                    })
                  }
                  placeholder="Enter Sub Menu Page Name"
                  maxLength={25}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <label className="block font-medium">Display Order</label>
                <input
                  type="text"
                  value={formState.displayOrder}
                  onChange={(e) =>
                    setFormState({ ...formState, displayOrder: e.target.value })
                  }
                  placeholder="Enter Display order"
                  maxLength={25}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formState.active}
                    onChange={(e) =>
                      setFormState({ ...formState, active: e.target.checked })
                    }
                    className="w-5 h-5 mr-2 cursor-pointer"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
              </>
            )}
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
                onClick={resetForm}
                className="px-4 py-2 text-white rounded bg-cancel-btn hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {!showForm && hasMounted && (
        <Select
          options={options}
          value={formState.selectedMenu}
          onChange={(option) =>
            setFormState({ ...formState, selectedMenu: option })
          }
          placeholder="Select Menu"
          className="mt-8"
        />
      )}
      {!showForm && subMenu?.length > 0 && (
        <div className="mt-4">
          <Table
            columns={Columns}
            data={tableData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
      <DeletePopup
        show={showDeletePopup}
        type="Sub Menu"
        name={subMenuToDelete?.subMenuName}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
export default SubMenu
