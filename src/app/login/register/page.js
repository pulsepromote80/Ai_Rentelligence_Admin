'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { clearError, registerUser } from '@/app/redux/authSlice'
import Loading from '@/app/common/loading'
import {
  isValidEmail,
  isValidMobile,
  isValidPassword,
  isValidUsername,
  isValidname,
  limitToCharacters,
} from '@/app/common/utils/validationHelpers'

const Register = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, loading, error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    username: '',
    name:'',
    email: '',
    phoneNumber: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [registrationComplete, setRegistrationComplete] = useState(false) 
  const validate = () => {
    const newErrors = {}

    const usernameError = isValidUsername(formData.username)
    if (usernameError) newErrors.username = usernameError

     const nameError = isValidUsername(formData.name)
    if (nameError) newErrors.name = nameError

    const emailError = isValidEmail(formData.email)
    if (emailError) newErrors.email = emailError

    const phoneNumberError = isValidMobile(formData.phoneNumber)
    if (phoneNumberError) newErrors.phoneNumber = phoneNumberError

    const passwordError = isValidPassword(formData.password)
    if (passwordError) newErrors.password = passwordError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    let updatedValue = value

    if (name === 'phoneNumber') {
      updatedValue = value.replace(/\D/g, '')
    }

    updatedValue = limitToCharacters(updatedValue)

    setFormData({
      ...formData,
      [name]: updatedValue,
    })

    setErrors({
      ...errors,
      [name]: '',
    })

    setMessage('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('')

    if (!validate()) return

    dispatch(registerUser(formData))
      .unwrap()
      .then(() => {
        setRegistrationComplete(true) 
      })
      .catch((errorMessage) => {
        setMessage(errorMessage)
      })
  }

  useEffect(() => {
    if (error) {
      setMessage(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  if (loading) return <Loading />

  return (
    <div className="flex items-center justify-center p-2 ">
      <div className="p-6 bg-white rounded-lg shadow-lg w-96 my-30 ">
        <h2 className="mb-4 text-2xl font-bold text-center">
          Create an Account
        </h2>

        {message && <p className="mb-2 text-center text-red-500">{message}</p>}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label className="text-lg font-medium text-black">
              User Name
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username}</p>
            )}
          </div>

           <div className="mb-3">
            <label className="text-lg font-medium text-black">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          {/* Email */}
          <div className="mb-3">
            <label className="text-lg font-medium text-black">
              Email
            </label>
            <input
              type="email"
              name="email"
              maxLength="50"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="mb-3">
            <label className="text-lg font-medium text-black ">
              Mobile Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              maxLength="10"
              placeholder="Enter your mobile number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full px-3 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="text-lg font-medium text-black">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                maxLength="25"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ paddingRight: '35px' }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute transform -translate-y-1/2 cursor-pointer top-1/2 right-3"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || registrationComplete} 
            className={`w-full py-2 mt-4 text-white ${
              registrationComplete
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            } rounded-md`}
          >
            Register
          </button>
        </form>

        {/* ✅ Go to Login Button shown after successful registration */}
        {registrationComplete && (
          <button
            onClick={() => router.push('/')}
            className="w-full py-2 mt-3 text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Go to Login
          </button>
        )}

        {/* Old Login redirect link (optional to keep or remove) */}
        {!registrationComplete && (
          <h2
            onClick={() => router.push('/')}
            className="mt-4 text-center text-blue-600 cursor-pointer hover:underline"
          >
            Already have an Account? Login
          </h2>
        )}
      </div>
    </div>
  )
}

export default Register
