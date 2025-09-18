'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  usernameLoginId,
  clearUsernameData,
} from '@/app/redux/adminMasterSlice'
import { updateUser } from '@/app/redux/authSlice'
import { toast } from 'react-toastify'

const EditUser = () => {
  const dispatch = useDispatch()
  const [userIdError, setUserIdError] = useState('')
  const { usernameData, error: usernameError } = useSelector(
    (state) => state.adminMaster,
  )
  const { updateUserData, loading, error } = useSelector((state) => state.auth)

  const [authLogin, setAuthLogin] = useState('')
  const [fields, setFields] = useState({
    loginID: '',
    name: '',
    fName: '',
    lName: '',
    email: '',
    address: '',
    mobile: '',
    countryid: 0,
    walletBep20: '',
  })

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (authLogin && authLogin.trim()) {
        const result = await dispatch(usernameLoginId(authLogin))

        if (result.payload === null) {
          setUserIdError("User ID doesn't exist")
          setFields({
            loginID: '',
            name: '',
            fName: '',
            lName: '',
            email: '',
            address: '',
            mobile: '',
            countryid: 0,
            walletBep20: '',
          })
        } else {
          setUserIdError('')
        }
      }
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [authLogin, dispatch])

  useEffect(() => {
    if (usernameError) {
      toast.error(usernameError.message || 'Invalid User ID')
      setFields({
        loginID: '',
        name: '',
        fName: '',
        lName: '',
        email: '',
        address: '',
        mobile: '',
        countryid: 0,
        walletBep20: '',
      })
    }
  }, [usernameError])

  useEffect(() => {
    if (usernameData) {
      setFields({
        name: usernameData.name || '',
        fName: usernameData.fName || '',
        lName: usernameData.lName || '',
        email: usernameData.email || '',
        address: usernameData.address || '',
        mobile: usernameData.mobile || '',
        countryid: usernameData.countryid || 0,
        walletBep20: usernameData.walletBep20 || '',
      })
    }
  }, [usernameData])

  useEffect(() => {
    if (updateUserData && updateUserData.statusCode === 200) {
      toast.success(updateUserData.message || 'User updated successfully!')
      setFields({
        loginID: '',
        name: '',
        fName: '',
        lName: '',
        email: '',
        address: '',
        mobile: '',
        countryid: 0,
        walletBep20: '',
      })
      setAuthLogin('')
      dispatch(clearUsernameData())
    }
  }, [updateUserData, dispatch])

  const handleUserIdChange = (e) => {
    setAuthLogin(e.target.value)
    setFields({
      name: '',
      fName: '',
      lName: '',
      email: '',
      address: '',
      mobile: '',
      walletBep20: '',
      countryid: 0,
    })
  }

  const handleFieldChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!usernameData) {
      toast.error('Please enter a valid User ID first')
      return
    }

    const payload = {
      loginID: authLogin,
      fName: fields.fName,
      lName: fields.lName,
      address: fields.address,
      email: fields.email,
      mobile: fields.mobile,
      countryid: fields.countryid,
      walletBep20: fields.walletBep20,
    }

    dispatch(updateUser(payload))
  }

  return (  
    <div className="p-0 mx-auto mt-0">
    <div className="flex items-center justify-center">
  <div className="w-full max-w-2xl p-8 bg-white rounded-3xl shadow-xl border">
    {/* Profile Header */}
    <div className="flex flex-col items-center mb-4"> 
       <div class="w-20 h-20 mb-4 rounded-full border-4 border-blue-200 flex items-center justify-center bg-gray-100"><svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
       <path stroke-linecap="round" stroke-linejoin="round" d="M12 15c-3.866 0-7 1.79-7 4v1h14v-1c0-2.21-3.134-4-7-4z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M12 12a5 5 0 100-10 5 5 0 000 10z"></path></svg></div>
   
      <h2 className="text-lg font-bold text-gray-800">
        {usernameData?.name || "Edit User"}
      </h2>
      {usernameData?.email && (
        <p className="text-sm text-gray-500">{usernameData.email}</p>
      )}
    </div>

 {/* User ID + User Name Section */}
<div
  className={`mb-6 grid gap-4 ${
    usernameData ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
  }`}
>
  {/* User ID Input (always visible) */}
  <div>
    <label className="block mb-1 text-sm font-medium text-gray-600">
      User ID
    </label>
    <input
      type="text"
      className={`w-full px-4 py-3 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 ${
        userIdError
          ? "border-red-400 focus:ring-red-300"
          : "border-gray-200 focus:ring-purple-300"
      }`}
      value={authLogin}
      onChange={handleUserIdChange}
      placeholder="Enter User ID"
    />
    {userIdError && (
      <div className="mt-2 text-xs text-red-500">{userIdError}</div>
    )}
  </div>

  {/* User Name (read-only, visible only when data exists) */}
  {usernameData && (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-600">
        User Name
      </label>
      <input
        type="text"
        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-100"
        name="name"
        value={fields.name}
        readOnly
      />
    </div>
  )}
</div>


    {/* Rest of form only if data exists */}
    {usernameData && (
      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* First + Last Name */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              First Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-300"
              name="fName"
              value={fields.fName}
              onChange={handleFieldChange}
              placeholder="First Name"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-300"
              name="lName"
              value={fields.lName}
              onChange={handleFieldChange}
              placeholder="Last Name"
            />
          </div>
        </div>

        {/* Email + Mobile */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-300"
              name="email"
              value={fields.email}
              onChange={handleFieldChange}
              placeholder="Email"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Mobile
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-300"
              name="mobile"
              value={fields.mobile}
              onChange={handleFieldChange}
              placeholder="Mobile"
            />
          </div>
        </div>

        {/* Address + Wallet */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Address
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-300"
              name="address"
              value={fields.address}
              onChange={handleFieldChange}
              placeholder="Address"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Wallet BEP20
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-300"
              name="walletBep20"
              value={fields.walletBep20}
              onChange={handleFieldChange}
              placeholder="Wallet BEP20"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transition-all"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </form>
    )}

    {loading && <div className="mt-3 text-sm text-purple-500">Updating...</div>}
    {error && <div className="mt-3 text-sm text-red-500">{error}</div>}
  </div>
</div>
</div>
  )
}

export default EditUser
