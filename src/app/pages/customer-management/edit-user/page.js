'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  usernameLoginId,
  clearUsernameData,
} from '@/app/redux/adminMasterSlice'
import { updateUser, getAllCountry } from '@/app/redux/authSlice'
import { toast } from 'react-toastify'
import Select from 'react-select'
import Spinner from '@/app/common/spinner'

const CountryOption = ({ innerProps, data, isFocused }) => (
  <div
    {...innerProps}
    className={`flex items-center px-3 py-2 cursor-pointer ${isFocused ? "bg-gray-100 dark:bg-gray-600" : ""
      }`}
  >
    {data.countryFlag && (
      <img
        src={data.countryFlag}
        alt={`${data.label} flag`}
        className="w-5 h-5 mr-2 rounded-full"
      />
    )}
    <span className="text-gray-800 dark:text-black">{data.label}</span>
  </div>
);

const CountrySingleValue = ({ data }) => (
  <div className="flex items-center">
    {data.countryFlag && (
      <img
        src={data.countryFlag}
        alt={`${data.label} flag`}
        className="w-5 h-5 mr-2 rounded-full"
      />
    )}
    <span className="text-gray-800 dark:text-white">{data.label}</span>
  </div>
);

const EditUser = () => {
  const dispatch = useDispatch()
  const [userIdError, setUserIdError] = useState('')
  const { usernameData, error: usernameError } = useSelector(
    (state) => state.adminMaster,
  )
  const { updateUserData, loading, error, getAllCountryData } = useSelector((state) => state.auth)

  const [authLogin, setAuthLogin] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countryCode, setCountryCode] = useState('')

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
    dispatch(getAllCountry())
  }, [dispatch])

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
          setSelectedCountry(null)
          setCountryCode('')
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
      setSelectedCountry(null)
      setCountryCode('')
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
        countryid: usernameData.countryId || 0,
        walletBep20: usernameData.walletBep20 || '',
      });

      // Country data setup with flag from getAllCountryData
      if (usernameData.country_Name && getAllCountryData?.data) {
        // Find the country in getAllCountryData by name to get the flag
        const countryFromList = getAllCountryData.data.find(
          country => country.country_Name?.toLowerCase() === usernameData.country_Name?.toLowerCase()
        );

        const countryOption = {
          value: usernameData.countryId,
          label: usernameData.country_Name,
          countryFlag: countryFromList?.countryFlag || '', // Get flag from country list
          countryCode: usernameData.phonecode,
        };

        setSelectedCountry(countryOption);
        setCountryCode(usernameData.phonecode);
      } else if (usernameData.country_Name) {
        // Fallback if getAllCountryData is not available yet
        const countryOption = {
          value: usernameData.countryId,
          label: usernameData.country_Name,
          countryFlag: '', // No flag available
          countryCode: usernameData.phonecode,
        };
        setSelectedCountry(countryOption);
        setCountryCode(usernameData.phonecode);
      }
    }
  }, [usernameData, getAllCountryData]);
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
      setSelectedCountry(null)
      setCountryCode('')
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
    setSelectedCountry(null)
    setCountryCode('')
  }

  const handleFieldChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }

  const handleCountryChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedCountry(selectedOption)
      setFields({
        ...fields,
        countryid: selectedOption.value,
      })
      setCountryCode(selectedOption.countryCode)
    }
  }

  const insecureNumbers = ["123456", "123456789", "123123", "password", "qwerty"];
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!usernameData) {
      toast.error('Please enter a valid User ID first')
      return
    }

    if (!fields.fName.trim()) {
      toast.error('Please enter First Name')
      return
    }
    if (!fields.lName.trim()) {
      toast.error('Please enter Last Name')
      return
    }
    if (!fields.email.trim()) {
      toast.error('Please enter Email')
      return
    }
    if (!fields.mobile.trim()) {
      toast.error('Please enter Mobile Number')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(fields.email)) {
      toast.error('Please enter a valid Email')
      return
    }

    const mobileRegex = /^[0-9]{7,12}$/
    if (!mobileRegex.test(fields.mobile)) {
      toast.error('Enter a valid phone number (7 to 12 digits)!')
      return
    }
    if (insecureNumbers.includes(fields.mobile.trim())) {
      toast.error("This mobile number is too common and insecure!")
      return false
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

  const countryOptions =
    getAllCountryData?.data?.map((country) => ({
      value: country.country_Id,
      label: country.country_Name,
      countryFlag: country.countryFlag,
      countryCode: country.phonecode,
    })) || []

  return (
    <div className="p-0 mx-auto mt-0">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-2xl p-8 bg-white border shadow-xl rounded-3xl">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center justify-center w-20 h-20 mb-4 bg-gray-100 border-4 border-blue-200 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15c-3.866 0-7 1.79-7 4v1h14v-1c0-2.21-3.134-4-7-4z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a5 5 0 100-10 5 5 0 000 10z"></path>
              </svg>
            </div>

            <h2 className="text-lg font-bold text-gray-800">
              {usernameData?.name || "Edit User"}
            </h2>
            {usernameData?.email && (
              <p className="text-sm text-gray-500">{usernameData.email}</p>
            )}
          </div>

          {/* User ID + User Name Section */}
          <div
            className={`mb-6 grid gap-4 ${usernameData ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              }`}
          >
            {/* User ID Input (always visible) */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                User ID
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 ${userIdError
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
                  className="w-full px-4 py-3 text-sm bg-gray-100 border border-gray-200 rounded-xl"
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

              {/* Email + Mobile with Country Code */}
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
                    Country
                  </label>
                  <Select
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    placeholder="Select Country"
                    classNamePrefix="select"
                    className="select-drop-dwon"
                    components={{
                      Option: CountryOption,
                      SingleValue: CountrySingleValue,
                    }}
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        minHeight: "47px",
                        height: "47px",
                        borderRadius: "0.75rem",
                        borderWidth: "1px",
                        borderColor: state.isFocused ? "#a855f7" : "#e5e7eb",
                        boxShadow: state.isFocused ? "0 0 0 1px #a855f7" : "none",
                        backgroundColor: "#f9fafb",
                        "&:hover": {
                          borderColor: "#a855f7",
                        },
                      }),
                      valueContainer: (provided) => ({
                        ...provided,
                        height: "48px",
                        padding: "0 8px",
                        display: "flex",
                        alignItems: "center",
                      }),
                      input: (provided) => ({
                        ...provided,
                        margin: "0px",
                        padding: "0px",
                        color: "#000",
                      }),
                      indicatorsContainer: (provided) => ({
                        ...provided,
                        height: "48px",
                      }),
                      singleValue: (provided, state) => ({
                        ...provided,
                        display: "flex",
                        alignItems: "center",
                        color: "#000 !important", // ✅ force black always
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        color: "#9ca3af",
                      }),
                      menu: (provided) => ({
                        ...provided,
                        backgroundColor: "#fff", // ✅ dropdown white
                        border: "1px solid #d1d5db",
                        borderRadius: "0.75rem",
                        zIndex: 20,
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected
                          ? "#a855f7"
                          : state.isFocused
                            ? "#f3f4f6"
                            : "transparent",
                        color: state.isSelected ? "#fff" : "#374151",
                        "&:active": {
                          backgroundColor: "#e5e7eb",
                        },
                      }),
                    }}
                    isSearchable
                    required
                  />

                </div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-4">
                    <label className="block mb-1 text-sm font-medium text-gray-600">
                      Code
                    </label>
                    <input
                      type="text"
                      value={countryCode ? `+${countryCode}` : '+0'}
                      readOnly
                      className="w-full px-2 py-3 text-sm bg-gray-100 border border-gray-200 rounded-xl"
                    />
                  </div>
                  <div className="col-span-8">
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
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-1">

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
                  className="w-full py-3 text-sm font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? <div className="flex items-center justify-center gap-2">
                    <Spinner size={4} color="text-white" />
                    <span>Updating...</span>
                  </div> : "Update Profile"}
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