'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {fetchSellers,addSeller,updateSeller,deleteSeller,fetchSellerIsActive} from '@/app/redux/sellerSlice'
import Table from '@/app/common/datatable'
import { Columns as SellerColumns } from '@/app/constants/seller-constant'
import { Columns as RegionColumns } from '@/app/constants/region-constant'
import {
  fetchCities,
  fetchCountries,
  fetchStates,
} from '@/app/redux/regionSlice'
import { toast } from 'react-toastify'
import DeletePopup from '@/app/common/utils/delete-popup'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const INITIAL_FORM_DATA = {
  name: '',
  mobile: '',
  email: '',
  streetAddress: '',
  pincode: '',
  description: '',
  userName:'',
  userPassword: '', 
  active: false
}

const SellerPage = () => {
  const dispatch = useDispatch()
  const {
    sellers = [],
    loading,
    error,
  } = useSelector((state) => state.sellers ?? {})


  const { countries } = useSelector((state) => state?.region)
  const { states } = useSelector((state) => state?.region)
  const { cities } = useSelector((state) => state?.region)
  const [selectedCountries, setSelectedCountries] = useState(null);
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentSeller, setCurrentSeller] = useState(null)
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState({})
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [sellerToDelete, setSellerToDelete] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [activatingSellerId, setActivatingSellerId] = useState(null)

  useEffect(() => {
    dispatch(fetchSellers())
    dispatch(fetchCountries())
  }, [dispatch])

  const validateForm = () => {
    let newErrors = {}
    if (!formData.country) newErrors.country = 'Country is required'
    if (!formData.state) newErrors.state = 'State is required'
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name must contain only letters'
    } else if (formData.name.length > 20) {
      newErrors.name = 'Name cannot exceed 20 characters'
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile must be 10 digits'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    } else if (formData.email.length > 50) {
      newErrors.email = 'Email cannot exceed 50 characters'
    }

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required'
    } else if (formData.streetAddress.length > 50) {
      newErrors.streetAddress = 'Street address cannot exceed 50 characters'
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required'
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 200 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (
      (name === 'mobile' && (!/^\d*$/.test(value) || value.length > 10)) ||
      (name === 'pincode' && (!/^\d*$/.test(value) || value.length > 6)) ||
      (name === 'name' && (!/^[A-Za-z\s]*$/.test(value) || value.length > 20)) ||
      (name === 'streetAddress' && value.length > 50) ||
      (name === 'email' &&
        (!/^[A-Za-z0-9@._-]*$/.test(value) || value.length > 50))
    ) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

   
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors }
      if (value.trim()) {
        delete newErrors[name] 
      }
      return newErrors
    })
    if (name === 'country') {
    const selected = countries.find((c) => c.country_Name === value)
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        country: selected.country_Name,
        state: '',
        city: '',
      }))
      dispatch(fetchStates(selected.country_Id))
    }
  }

  if (name === 'state') {
    const selected = states.find((s) => s.stateName === value)
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        state: selected.stateName,
        city: '',
      }))
      dispatch(fetchCities(selected.pk_StateId))
    }
  }

  if (name === 'city') {
    const selected = cities.find((c) => c.cityName === value)
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        city: selected.cityName,
      }))
    }
  }
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      if (editMode && currentSeller) {
        await dispatch(
          updateSeller({ sellerId: currentSeller.sellerId, ...formData }),
        ).unwrap()
        toast.success('Seller Update successfully!')
      } else {
        await dispatch(addSeller(formData)).unwrap()
        toast.success('Seller Add successfully!')
      }

      resetForm()
      setErrors({})
      dispatch(fetchSellers())
    } catch (error) {

      toast.error(error?.message || 'Something went wrong')
    }
  }

  const handleEdit = (seller) => {
    setEditMode(true)
    setCurrentSeller(seller)
    setFormData({ 
      ...seller,
      active: seller.active === false || seller.active === 'true' || seller.active === 1 
    })
    setErrors({}) 
    setShowForm(true)
  }

  const handleDeleteClick = (seller) => {
    setSellerToDelete(seller)
    setShowDeletePopup(true)
  }

  const handleDeleteConfirm = async () => {
    if (sellerToDelete) {
      await dispatch(deleteSeller({ sellerId: sellerToDelete.sellerId }))
      toast.success('Seller deleted successfully!') 
      setShowDeletePopup(false)
      dispatch(fetchSellers())
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditMode(false)
    setCurrentSeller(null)
    setFormData(INITIAL_FORM_DATA)
  }
 
  const handleActivateSeller = async (sellerId) => {
    setActivatingSellerId(sellerId)
    try {
      await dispatch(fetchSellerIsActive(sellerId)).unwrap()
      toast.success('Seller activated successfully!')
      dispatch(fetchSellers())
    } catch (error) {
      toast.error(error?.message || 'Failed to activate seller')
    } finally {
      setActivatingSellerId(null)
    }
  }

  const sellerColumnsWithActivate = SellerColumns.map(col => {
    if (col.key === 'sellerActive') {
      return {
        ...col,
        render: (value, row) =>
          col.render ? col.render(value, row, handleActivateSeller) : null
      }
    }
    return col
  })

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg">
    
        <div className="flex justify-center w-full sm:justify-start p-4 pb-0">
          {!showForm && (
            <button
              onClick={() => {
                setShowForm(true)
                setEditMode(false)
                setFormData(INITIAL_FORM_DATA)
              }}
              className="px-4 py-2 mt-3 text-white rounded-md bg-add-btn"
            >
              + Add Seller
            </button>
          )}
        </div>

     

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 mb-4 rounded"
        >
          <h2 className="mb-2 font-bold text-left text-black">
            {editMode ? 'Edit Seller' : 'Add Seller'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Country Dropdown */}
            <div>
              <label className="block font-medium">
              Country<span className="text-red-500">*</span></label>
              <select
                name="country"
                value={formData?.country?.toString() || ''}
                onChange={handleChange}
                className="w-full p-2 mt-2 border rounded focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Select Country</option>
                {countries.map((country, idx) => (
                  <option key={`${country.country_Id}-${idx}`} value={country.country_Name}>
                    {country.country_Name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-500">{errors.country}</p>
              )}
            </div>

            {/* State Dropdown */}
            <div>
              <label className="block font-medium">
              State<span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData?.state}
                onChange={handleChange}
                className="w-full p-2 mt-2 border rounded focus:ring-2 focus:ring-blue-400"
                disabled={!formData.country}
              >
                <option value="">Select State</option>
                {states.map((state, idx) => (
                  <option key={`${state.pk_StateId}-${idx}`} value={state.stateName}>
                    {state.stateName}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-500">{errors.state}</p>
              )}
            </div>

            {/* City Dropdown */}
            <div>
              <label className="block font-medium">
              City<span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 mt-2 border rounded focus:ring-2 focus:ring-blue-400"
                disabled={!formData.state}
              >
                <option value="">Select City</option>
                {cities.map((city, idx) => (
                  <option key={`${city.pk_CityId}-${idx}`} value={city.cityName}>
                    {city.cityName}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label className="block font-medium">
              Username<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="userName"
                className="w-full p-2 mt-2 border rounded focus:ring-2 focus:ring-blue-400"
                value={formData.userName}
                onChange={handleChange}
              />
              {errors.userName && (
                <p className="text-sm text-red-500">{errors.userName}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative ">
              <label className="block font-medium">
              User Password<span className="text-red-500">*</span></label>
              <input
                type={showPassword ? "text" : "password"}
                name="userPassword"
                className="w-full p-2 pr-10 mt-2 border rounded focus:ring-2 focus:ring-blue-400"
                value={formData.userPassword}
                onChange={handleChange}
              />
              <span
                className="absolute mt-4 text-gray-500 transform -translate-y-1/2 cursor-pointer right-4 top-1/2"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye /> }
              </span>
              {errors.userPassword && (
                <p className="text-sm text-red-500">{errors.userPassword}</p>
              )}
            </div>

            {Object.keys(INITIAL_FORM_DATA).filter(key => key !== 'userName' && key !== 'userPassword').map((key) => {
              if (key === 'active' && !editMode) {
                return null;
              }
              return (
                <div key={key}>
                  <label className="block font-medium capitalize ">
                   {key}<span className="text-red-500">*</span> </label>
                  {key === 'active' ? (
                    <div className="flex items-center mt-4 space-x-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        name="active"
                        checked={formData.active}
                        onChange={handleChange}
                        className="w-5 h-5 "
                      />
                      <label htmlFor="isActive" className="font-medium">
                        Active
                      </label>
                    </div>
                  ) : (
                    <input
                      type="text"
                      name={key}
                      className="w-full p-2 mt-2 border rounded focus:ring-2 focus:ring-blue-400"
                      value={formData[key]}
                      onChange={handleChange}
                    />
                  )}
                  {errors[key] && (
                    <p className="text-sm text-red-500">{errors[key]}</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 text-white rounded bg-submit-btn hover:bg-green-600"
            >
              {editMode ? 'Update' : 'Submit'}
            </button>
            <button
              type="button"
              className="px-4 py-2 text-white rounded bg-cancel-btn hover:bg-gray-600"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!showForm && (
        <>
          {error && <p className="text-red-500">Error: {error}</p>}
          <Table
            columns={[...sellerColumnsWithActivate, ...RegionColumns]}
            data={sellers}
            loading={loading || activatingSellerId !== null}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            title={'Seller'}
            renderActions={(row) => (
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <button
                  className="w-full px-3 py-1 text-white bg-yellow-500 rounded sm:w-auto"
                  onClick={() => handleEdit(row)}
                >
                  Edit
                </button>
                <button
                  className="w-full px-3 py-1 mt-2 text-white bg-red-500 rounded sm:w-auto sm:mt-0"
                  onClick={() => handleDeleteClick(row)}
                >
                  Delete
                </button>
              </div>
            )}
          />
        </>
      )}

      <DeletePopup
        show={showDeletePopup}
        type="seller"
        name={sellerToDelete?.name}
        onCancel={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

export default SellerPage