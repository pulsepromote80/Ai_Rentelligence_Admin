'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  usernameLoginId,
  ChangeAdminSponser,
} from '@/app/redux/adminMasterSlice'
import { toast } from 'react-toastify'

const ChangeSponser = () => {
  const dispatch = useDispatch()
  const { usernameData, loading, error, sponserData } = useSelector(
    (state) => state.adminMaster,
  )
  const [authLogin, setAuthLogin] = useState('')
  const [sponsorAuthLogin, setSponsorAuthLogin] = useState('')
  const [touched, setTouched] = useState(false)
  const [userName, setUserName] = useState('')
  const [sponsorName, setSponsorName] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (authLogin && authLogin.trim()) {
        await dispatch(usernameLoginId(authLogin)).then((res) => {
          setUserName(res.payload?.name || res.payload?.userName || '')

          if (!res.payload) {
            setErrors({ authLogin: 'User not found' })
          } else {
            setErrors({})
          }
        })

        setTouched(true)
      } else {
        setUserName('')
      }
    }, 100)
    return () => clearTimeout(timeoutId)
  }, [authLogin, dispatch])

  const handleUserIdChange = (e) => {
    setAuthLogin(e.target.value)
    // Clear UserId error as soon as user types
    setErrors((prev) => ({ ...prev, title: undefined }))
  }
  const handleSponsorIdChange = (e) => {
    setSponsorAuthLogin(e.target.value)
    // Clear Sponsor error as soon as user types
    setErrors((prev) => ({ ...prev, sponsor: undefined }))
    if (e.target.value && e.target.value.trim()) {
      dispatch(usernameLoginId(e.target.value)).then((res) => {
        setSponsorName(res.payload?.name || res.payload?.userName || '')
      })
    } else {
      setSponsorName('')
    }
  }
  const handleBlurOrFetch = () => {
    if (authLogin && authLogin.trim()) {
      dispatch(usernameLoginId(authLogin)).then((res) => {
        setUserName(res.payload?.name || res.payload?.userName || '')
        

      })
      setTouched(true)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let newErrors = {}
    if (!authLogin.trim()) newErrors.title = 'UserId is required'
    if (!sponsorAuthLogin.trim())
      newErrors.sponsor = 'Sponsor User ID is required'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    if (!userName) {
      toast.warn('Please enter a valid User ID')
      return
    }
    if (!sponsorAuthLogin || !sponsorAuthLogin.trim()) {
      toast.warn('Please enter a Sponsor User ID')
      return
    }
    if (authLogin.trim() === sponsorAuthLogin.trim()) {
      toast.warn('UserID and SponserID should not be the same')
      return
    }

    try {
      const result = await dispatch(
        ChangeAdminSponser({ authLogin, sponsorAuthLogin }),
      )
      const payload = result.payload
      const statusCode =
        payload?.statusCode || (payload?.data && payload.data[0]?.statusCode)
      const message =
        payload?.message || (payload?.data && payload.data[0]?.message)
      if (statusCode === 1 || statusCode === 200) {
        toast.success(message || 'Sponsor changed successfully!')
        setAuthLogin('')
        setSponsorAuthLogin('')
        setTouched(false)
        setUserName('')
        setSponsorName('')
      } else {
        toast.error(message || 'Failed to change sponsor. Please try again.')
      }
    } catch (error) {
      toast.error(
        'Error changing sponsor: ' + (error.message || 'Unknown error'),
      )
    }
  }

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="w-full max-w-4xl p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="mb-8 text-2xl font-bold text-center text-black">
          Change Sponser
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Enter User ID :
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={authLogin}
                onChange={handleUserIdChange}
                onBlur={handleBlurOrFetch}
                placeholder="Enter User Id"
              />
              {errors.authLogin && (
                <div className="mt-1 text-sm text-red-500">
                  {errors.authLogin}
                </div>
              )}
              {errors.title && (
                <div className="mt-1 text-sm text-red-500">{errors.title}</div>
              )}
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                User Name :
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg"
                value={touched && userName ? userName : ''}
                readOnly
                placeholder="User Name"
              />
            </div>
          </div>

          {userName && (
            <div className="flex flex-col gap-4 mt-4 md:flex-row">
              <div className="flex-1">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Sponsor User ID :
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={sponsorAuthLogin}
                  onChange={handleSponsorIdChange}
                  placeholder="Enter Sponsor User Id"
                  required
                />
                {errors.sponsor && (
                  <div className="mt-1 text-sm text-red-500">
                    {errors.sponsor}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Sponsor Name :
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg"
                  value={sponsorName}
                  readOnly
                  placeholder="Sponsor Name"
                />
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 mt-2 text-lg font-semibold text-white transition-colors rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={!!errors.authLogin}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
        {loading && <div className="mt-2 text-blue-500">Loading...</div>}
        {error && <div className="mt-2 text-red-500">{error}</div>}
      </div>
    </div>
  )
}

export default ChangeSponser
