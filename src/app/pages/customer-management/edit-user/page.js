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
    <div className="flex items-center justify-center mt-20">
      <div className="w-full max-w-4xl p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="mb-8 text-2xl font-bold text-center text-black">
          Edit User
        </h2>

        {/* Always show User ID input */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Enter User ID :
          </label>
          <input
            type="text"
            className={`w-full px-4 py-3 text-base bg-gray-100 border ${
              userIdError ? 'border-red-500' : 'border-gray-200'
            } rounded-lg`}
            value={authLogin}
            onChange={handleUserIdChange}
            placeholder="Enter User Id"
          />
          {userIdError && (
            <div className="mt-1 text-sm text-red-500">{userIdError}</div>
          )}
        </div>

        {/* Show rest of form only if user data found */}
        {usernameData && (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* User Name */}
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                User Name :
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                name="name"
                value={fields.name}
                readOnly
              />
            </div>

            {/* First/Last Name */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  First Name :
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg"
                  name="fName"
                  value={fields.fName}
                  onChange={handleFieldChange}
                  placeholder="First Name"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Last Name :
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg"
                  name="lName"
                  value={fields.lName}
                  onChange={handleFieldChange}
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Email + Mobile */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Email :
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg"
                  name="email"
                  value={fields.email}
                  onChange={handleFieldChange}
                  placeholder="Email"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Mobile :
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg"
                  name="mobile"
                  value={fields.mobile}
                  onChange={handleFieldChange}
                  placeholder="Mobile"
                />
              </div>
            </div>

            {/* Address + Wallet */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Address :
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg"
                  name="address"
                  value={fields.address}
                  onChange={handleFieldChange}
                  placeholder="Address"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Wallet BEP20 :
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg"
                  name="walletBep20"
                  value={fields.walletBep20}
                  onChange={handleFieldChange}
                  placeholder="Wallet BEP20"
                />
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full py-3 mt-2 text-lg font-semibold text-white transition-colors rounded-lg bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        )}

        {loading && <div className="mt-2 text-blue-500">Loading...</div>}
        {error && <div className="mt-2 text-red-500">{error}</div>}
      </div>
    </div>
  )
}

export default EditUser
