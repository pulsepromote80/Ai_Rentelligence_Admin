'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addevent,
  getevent,
  updateevent,
  eventSchedule,
} from '@/app/redux/eventSlice'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/event-constant'
import { toast } from 'react-toastify'
import DeletePopup from '@/app/common/utils/delete-popup'
import { eventData, eventLoading } from './event-selectors'
import { getAdminUserId } from '@/app/pages/api/auth'
import ScheduleModal from '@/app/components/ScheduleModal'

const Event = () => {
  const dispatch = useDispatch()
  const loading = useSelector(eventLoading)
  const data = useSelector(eventData)

  const [formData, setFormData] = useState({
    Tittle: '',
    EventType: '',
    EventStartDate: '',
    EndStartDate: '',
    AvailableSeats: '',
    Location: '',
    EventMode: '',
    AccessType: '',
    SessionsTime: '',
    SessionsTimeOne: '',
    SessionsTimeTwo: '',
    SessionSeats: '',
    SessionOneSeats: '',
    SessionTwoSeats: '',
    Description: '',
    EventURL: '', 
    EventPrice: '',
    Status: 1,
  })
  const [eventImage, setEventImage] = useState(null)
  const [existingImageUrl, setExistingImageUrl] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editEventId, setEditEventId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [errors, setErrors] = useState({})
  const [mounted, setMounted] = useState(false)

  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)

  
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  
  const eventModeOptions = [
    { value: '', label: 'Select Event Mode' },
    { value: 'Hybrid Event', label: 'Hybrid Event' },
    { value: 'Online Event', label: 'Online Event' },
    { value: 'Offline Event', label: 'Offline Event' },
  ]

 
  const accessTypeOptions = [
    { value: '', label: 'Select Access Type' },
    { value: 'Open Event', label: 'Open Event' },
    { value: 'Exclusive Event', label: 'Exclusive Event' },
  ]


  const parseTimeRange = (timeRange) => {
    if (!timeRange) return { startTime: '', endTime: '' }
    
    const parts = timeRange.split(' to ')
    if (parts.length === 2) {
      return {
        startTime: parts[0] || '', 
        endTime: parts[1] || ''    
      }
    }
    return { startTime: '', endTime: '' }
  }

  
  const formatTimeToAMPM = (timeString) => {
    if (!timeString) return ''
    
    
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString
    }
    
   
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const twelveHour = hour % 12 || 12
    
    return `${twelveHour}:${minutes} ${ampm}`
  }

  const formatTimeTo24H = (timeString) => {
    if (!timeString) return ''
    
    if (!timeString.includes('AM') && !timeString.includes('PM')) {
      return timeString
    }
    
    const [timePart, meridian] = timeString.split(' ')
    let [hours, minutes] = timePart.split(':')
    let hour = parseInt(hours, 10)
    
    if (meridian === 'PM' && hour < 12) {
      hour += 12
    } else if (meridian === 'AM' && hour === 12) {
      hour = 0
    }
    
    return `${hour.toString().padStart(2, '0')}:${minutes}`
  }

  
  const parseTimeStringToDate = (timeString) => {
    if (!timeString) return null
    
    const [timePart, meridian] = timeString.split(' ')
    const [hours, minutes] = timePart.split(':')
    
    let hour = parseInt(hours, 10)
    const minute = parseInt(minutes, 10)
    
    
    if (meridian === 'PM' && hour < 12) {
      hour += 12
    } else if (meridian === 'AM' && hour === 12) {
      hour = 0
    }
    
    
    const date = new Date()
    date.setHours(hour, minute, 0, 0)
    return date
  }

  const TimeRangeInput = ({ value, onChange, placeholder, name }) => {
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    useEffect(() => {
      if (value) {
        const { startTime: parsedStart, endTime: parsedEnd } = parseTimeRange(value)
        setStartTime(formatTimeTo24H(parsedStart))
        setEndTime(formatTimeTo24H(parsedEnd))
      } else {
        setStartTime('')
        setEndTime('')
      }
    }, [value])

    const handleStartTimeChange = (e) => {
      const newStartTime = e.target.value
      setStartTime(newStartTime)
      if (newStartTime && endTime) {
        const formattedStart = formatTimeToAMPM(newStartTime)
        const formattedEnd = formatTimeToAMPM(endTime)
        onChange(`${formattedStart} to ${formattedEnd}`)
      }
    }

    const handleEndTimeChange = (e) => {
      const newEndTime = e.target.value
      setEndTime(newEndTime)
      if (startTime && newEndTime) {
        const formattedStart = formatTimeToAMPM(startTime)
        const formattedEnd = formatTimeToAMPM(newEndTime)
        onChange(`${formattedStart} to ${formattedEnd}`)
      }
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={startTime}
            onChange={handleStartTimeChange}
            className="flex-1 p-3 border border-gray-300 rounded-md"
          />
          <span className="text-gray-500">to</span>
          <input
            type="time"
            value={endTime}
            onChange={handleEndTimeChange}
            className="flex-1 p-3 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    )
  }

  // ✅ Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  useEffect(() => {
    dispatch(getevent())
    setMounted(true)
  }, [dispatch])

  const resetForm = useCallback(() => {
    setFormData({
      Tittle: '',
      EventType: '',
      EventStartDate: '',
      EndStartDate: '',
      AvailableSeats: '',
      Location: '',
      EventMode: '',
      AccessType: '',
      SessionsTime: '',
      SessionsTimeOne: '',
      SessionsTimeTwo: '',
      SessionSeats: '',
      SessionOneSeats: '',
      SessionTwoSeats: '',
      Description: '',
      EventURL: '', 
      EventPrice: '',
      Status: 1,
    })
    setEventImage(null)
    setExistingImageUrl('')
    setEditMode(false)
    setEditEventId(null)
    setErrors({})
  }, [])

  
  const totalSessionSeats = useMemo(() => {
    return (
      (Number(formData.SessionSeats) || 0) +
      (Number(formData.SessionOneSeats) || 0) +
      (Number(formData.SessionTwoSeats) || 0)
    )
  }, [formData.SessionSeats, formData.SessionOneSeats, formData.SessionTwoSeats])


  const isSessionSeatsExceeded = useMemo(() => {
    const availableSeats = Number(formData.AvailableSeats) || 0
    return totalSessionSeats > availableSeats
  }, [totalSessionSeats, formData.AvailableSeats])


  useEffect(() => {
    const availableSeats = Number(formData.AvailableSeats) || 0
    
    if (availableSeats > 0 && totalSessionSeats > availableSeats) {
      setErrors((prev) => ({
        ...prev,
        totalSessionSeats: `Total session seats (${totalSessionSeats}) cannot exceed available seats (${availableSeats})`
      }))
    } else if (errors.totalSessionSeats) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.totalSessionSeats
        return newErrors
      })
    }
  }, [totalSessionSeats, formData.AvailableSeats])

  const handleSchedule = useCallback((row) => {
    setSelectedEvent(row)
    setShowScheduleForm(true)
  }, [])

  const updatedColumns = useMemo(() => {
    return Columns.map((col) => {
      if (col.key === 'schedule') {
        return {
          ...col,
          render: (value, row) => (
            <button
              className="p-2 text-blue-500 transition-colors rounded-full hover:text-blue-700 hover:bg-blue-50"
              onClick={() => handleSchedule(row)}
              title="Schedule Event"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>
          ),
        }
      }
      return col
    })
  }, [handleSchedule])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target
    
    // Prevent negative values and allow only numbers
    let numericValue = ''
    if (value === '') {
      numericValue = ''
    } else {
      // Remove any non-digit characters and ensure it's positive
      const cleanedValue = value.replace(/[^0-9.]/g, '')
      numericValue = cleanedValue === '' ? '' : cleanedValue
      
      // Ensure the value is not negative
      if (numericValue < 0) {
        numericValue = 0
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }))

    // Validation for session seats exceeding available seats
    if (name === 'SessionSeats' || name === 'SessionOneSeats' || name === 'SessionTwoSeats') {
      const availableSeats = Number(formData.AvailableSeats) || 0
      const sessionSeatsValue = Number(numericValue) || 0
      
      if (sessionSeatsValue > availableSeats) {
        let fieldName = ''
        if (name === 'SessionSeats') fieldName = 'Session Seats'
        else if (name === 'SessionOneSeats') fieldName = 'Session One Seats'
        else if (name === 'SessionTwoSeats') fieldName = 'Session Two Seats'
        
        setErrors((prev) => ({
          ...prev,
          [name]: `${fieldName} cannot exceed available seats (${availableSeats})`
        }))
      } else {
        setErrors((prev) => ({ ...prev, [name]: '' }))
        
        // Clear total session seats error if individual errors are fixed
        if (errors.totalSessionSeats) {
          setErrors((prevErrors) => {
            const newErrors = { ...prevErrors }
            delete newErrors.totalSessionSeats
            return newErrors
          })
        }
      }
    }

    // Validation when Available Seats changes
    if (name === 'AvailableSeats') {
      const availableSeats = Number(numericValue) || 0
      
      const sessionFields = [
        { key: 'SessionSeats', label: 'Session Seats' },
        { key: 'SessionOneSeats', label: 'Session One Seats' },
        { key: 'SessionTwoSeats', label: 'Session Two Seats' }
      ]
      
      sessionFields.forEach(({ key, label }) => {
        const sessionValue = Number(formData[key]) || 0
        if (sessionValue > availableSeats) {
          setErrors((prev) => ({
            ...prev,
            [key]: `${label} cannot exceed available seats (${availableSeats})`
          }))
        } else if (errors[key]) {
          setErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors[key]
            return newErrors
          })
        }
      })
    
      if (totalSessionSeats > availableSeats) {
        setErrors((prev) => ({
          ...prev,
          totalSessionSeats: `Total session seats (${totalSessionSeats}) cannot exceed available seats (${availableSeats})`
        }))
      } else if (errors.totalSessionSeats) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.totalSessionSeats
          return newErrors
        })
      }
    }

    // Clear individual field errors
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleStatusChange = (e) => {
    const isChecked = e.target.checked
    setFormData((prev) => ({
      ...prev,
      Status: isChecked ? 1 : 0,
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    const safeTrim = (v) => String(v ?? '').trim()
    if (!safeTrim(formData.Tittle)) newErrors.Tittle = 'Title is required.'
    if (!safeTrim(formData.EventType))
      newErrors.EventType = 'Event Type is required.'
    if (!safeTrim(formData.EventStartDate))
      newErrors.EventStartDate = 'Event Start Date is required.'
    if (!safeTrim(formData.EndStartDate))
      newErrors.EndStartDate = 'End Date is required.'
    if (!safeTrim(formData.AvailableSeats))
      newErrors.AvailableSeats = 'Available Seats is required.'
    if (!safeTrim(formData.Location))
      newErrors.Location = 'Location is required.'
    if (!safeTrim(formData.EventMode))
      newErrors.EventMode = 'Event Mode is required.'
    if (!safeTrim(formData.AccessType))
      newErrors.AccessType = 'Access Type is required.'
    if (!safeTrim(formData.Description))
      newErrors.Description = 'Description is required.'

    // ✅ Session Time mandatory validation
    if (!safeTrim(formData.SessionsTime))
      newErrors.SessionsTime = 'Session Time is required.'

    // ✅ Session Seats mandatory validation
    if (!safeTrim(formData.SessionSeats))
      newErrors.SessionSeats = 'Session Seats is required.'

    // ✅ Event Price validation
    if (!safeTrim(formData.EventPrice)) {
      newErrors.EventPrice = 'Event Price is required.'
    } else if (isNaN(Number(formData.EventPrice)) || Number(formData.EventPrice) < 0) {
      newErrors.EventPrice = 'Event Price must be a valid positive number.'
    }

    if (!editMode && !eventImage) {
      newErrors.eventImage = 'Event image is required.'
    }

    // ✅ Date validation
    if (formData.EventStartDate && formData.EndStartDate) {
      const startDate = new Date(formData.EventStartDate)
      const endDate = new Date(formData.EndStartDate)
      if (endDate < startDate) {
        newErrors.EndStartDate = 'End date cannot be before start date.'
      }
    }

    // ✅ EventURL format validation
    if (formData.EventURL) {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
      if (!urlPattern.test(formData.EventURL)) {
        newErrors.EventURL = 'Please enter a valid URL'
      }
    }

    if (formData.SessionsTime) {
      const timeRangeRegex = /^(\d{1,2}:\d{2} [AP]M) to (\d{1,2}:\d{2} [AP]M)$/
      if (!timeRangeRegex.test(formData.SessionsTime)) {
        newErrors.SessionsTime = 'Session Time must be in format "HH:MM AM/PM to HH:MM AM/PM"'
      } else {
        const [startTimeStr, endTimeStr] = formData.SessionsTime.split(' to ')
        const startTime = parseTimeStringToDate(startTimeStr)
        const endTime = parseTimeStringToDate(endTimeStr)
        
        if (startTime && endTime && endTime <= startTime) {
          newErrors.SessionsTime = 'Session end time must be after start time'
        }
      }
    }

    if (formData.SessionsTimeOne) {
      const timeRangeRegex = /^(\d{1,2}:\d{2} [AP]M) to (\d{1,2}:\d{2} [AP]M)$/
      if (!timeRangeRegex.test(formData.SessionsTimeOne)) {
        newErrors.SessionsTimeOne = 'Session Time One must be in format "HH:MM AM/PM to HH:MM AM/PM"'
      } else {
        const [startTimeStr, endTimeStr] = formData.SessionsTimeOne.split(' to ')
        const startTime = parseTimeStringToDate(startTimeStr)
        const endTime = parseTimeStringToDate(endTimeStr)
        
        if (startTime && endTime && endTime <= startTime) {
          newErrors.SessionsTimeOne = 'Session One end time must be after start time'
        }
      }
    }

    if (formData.SessionsTimeTwo) {
      const timeRangeRegex = /^(\d{1,2}:\d{2} [AP]M) to (\d{1,2}:\d{2} [AP]M)$/
      if (!timeRangeRegex.test(formData.SessionsTimeTwo)) {
        newErrors.SessionsTimeTwo = 'Session Time Two must be in format "HH:MM AM/PM to HH:MM AM/PM"'
      } else {
        const [startTimeStr, endTimeStr] = formData.SessionsTimeTwo.split(' to ')
        const startTime = parseTimeStringToDate(startTimeStr)
        const endTime = parseTimeStringToDate(endTimeStr)
        
        if (startTime && endTime && endTime <= startTime) {
          newErrors.SessionsTimeTwo = 'Session Two end time must be after start time'
        }
      }
    }

    // Number validation with positive check
    if (formData.AvailableSeats && (isNaN(Number(formData.AvailableSeats)) || Number(formData.AvailableSeats) < 0)) {
      newErrors.AvailableSeats = 'Available Seats must be a positive number.'
    }
    if (formData.SessionSeats && (isNaN(Number(formData.SessionSeats)) || Number(formData.SessionSeats) < 0)) {
      newErrors.SessionSeats = 'Session Seats must be a positive number.'
    }
    if (formData.SessionOneSeats && (isNaN(Number(formData.SessionOneSeats)) || Number(formData.SessionOneSeats) < 0)) {
      newErrors.SessionOneSeats = 'Session One Seats must be a positive number.'
    }
    if (formData.SessionTwoSeats && (isNaN(Number(formData.SessionTwoSeats)) || Number(formData.SessionTwoSeats) < 0)) {
      newErrors.SessionTwoSeats = 'Session Two Seats must be a positive number.'
    }

    const availableSeats = Number(formData.AvailableSeats) || 0

    if (formData.SessionSeats !== '' && formData.SessionSeats > availableSeats) {
      newErrors.SessionSeats = `Session Seats cannot exceed available seats (${availableSeats})`
    }

    if (formData.SessionOneSeats !== '' && formData.SessionOneSeats > availableSeats) {
      newErrors.SessionOneSeats = `Session One Seats cannot exceed available seats (${availableSeats})`
    }

    if (formData.SessionTwoSeats !== '' && formData.SessionTwoSeats > availableSeats) {
      newErrors.SessionTwoSeats = `Session Two Seats cannot exceed available seats (${availableSeats})`
    }

    if (totalSessionSeats > availableSeats) {
      newErrors.totalSessionSeats = `Total session seats (${totalSessionSeats}) cannot exceed available seats (${availableSeats})`
    }

    if (formData.SessionSeats !== '' && formData.SessionOneSeats !== '' && formData.SessionTwoSeats !== '') {
      if (totalSessionSeats === 0) {
        newErrors.totalSessionSeats = 'At least one session must have seats allocated'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setEventImage(file)
    if (errors.eventImage) setErrors((prev) => ({ ...prev, eventImage: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const submitFormData = new FormData()
    const currentAdminUserId = getAdminUserId()


    const commonFields = {
      Tittle: formData.Tittle,
      EventType: formData.EventType,
      EventStartDate: formData.EventStartDate,
      EndStartDate: formData.EndStartDate,
      AvailableSeats: formData.AvailableSeats,
      Location: formData.Location,
      EventMode: formData.EventMode,
      AccessType: formData.AccessType,
      SessionsTime: formData.SessionsTime,
      SessionsTimeOne: formData.SessionsTimeOne,
      SessionsTimeTwo: formData.SessionsTimeTwo,
      SessionSeats: formData.SessionSeats,
      SessionOneSeats: formData.SessionOneSeats,
      SessionTwoSeats: formData.SessionTwoSeats,
      Description: formData.Description,
      EventURL: formData.EventURL, 
      EventPrice: formData.EventPrice,
      Status: formData.Status.toString(),
    }

    if (editMode) {
      submitFormData.append('EventMasterID', editEventId)
      Object.entries(commonFields).forEach(([key, value]) => {
        submitFormData.append(key, value)
      })
      submitFormData.append('Updatedby', currentAdminUserId || '')

      if (eventImage instanceof File) {
        submitFormData.append('Image', eventImage)
      } else if (existingImageUrl) {
        try {
          const response = await fetch(existingImageUrl)
          const blob = await response.blob()
          const file = new File([blob], 'existing-image.jpg', {
            type: blob.type,
          })
          submitFormData.append('Image', file)
        } catch (error) {
          console.error('Failed to convert image URL to file:', error)
          const emptyFile = new File([''], 'empty.jpg', { type: 'image/jpeg' })
          submitFormData.append('Image', emptyFile)
        }
      } else {
        const emptyFile = new File([''], 'empty.jpg', { type: 'image/jpeg' })
        submitFormData.append('Image', emptyFile)
      }
    } else {
      Object.entries(commonFields).forEach(([key, value]) => {
        submitFormData.append(key, value)
      })
      submitFormData.append('Createdby', currentAdminUserId || '')

      if (eventImage) {
        submitFormData.append('Image', eventImage)
      } else {
        const emptyFile = new File([''], 'empty.jpg', { type: 'image/jpeg' })
        submitFormData.append('Image', emptyFile)
      }
    }

    try {
      let response

      if (editMode) {
        response = await dispatch(updateevent(submitFormData)).unwrap()
      } else {
        response = await dispatch(addevent(submitFormData)).unwrap()
      }

      if (response.statusCode === 200 || response.statusCode === 1) {
        toast.success(
          response.message ||
            `Event ${editMode ? 'updated' : 'added'} successfully!`,
        )
        resetForm()
        setShowForm(false)
        dispatch(getevent())
      } else {
        toast.error(
          response.message || `Failed to ${editMode ? 'update' : 'add'} event`,
        )
      }
    } catch (error) {
      console.error('Error during event submit:', error)
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${editMode ? 'update' : 'add'} event`,
      )
    }
  }

  const handleEdit = (event) => {
    const statusValue =
      event.Status === 0 || event.Status === 1 ? event.Status : 1

    setFormData({
      Tittle: event.Tittle || event.title || '',
      EventType: event.EventType || event.eventType || '',
      EventStartDate: event.EventStartDate || event.eventStartDate || '',
      EndStartDate: event.EndStartDate || event.endStartDate || '',
      AvailableSeats: event.AvailableSeats || event.availableSeats || '',
      Location: event.Location || event.location || '',
      EventMode: event.EventMode || event.eventMode || '',
      AccessType: event.AccessType || event.accessType || '',
      SessionsTime: event.SessionsTime || event.sessionsTime || '',
      SessionsTimeOne: event.SessionsTimeOne || event.sessionsTimeOne || '',
      SessionsTimeTwo: event.SessionsTimeTwo || event.sessionsTimeTwo || '',
      SessionSeats: event.SessionSeats || event.sessionSeats || '',
      SessionOneSeats: event.SessionOneSeats || event.sessionOneSeats || '',
      SessionTwoSeats: event.SessionTwoSeats || event.sessionTwoSeats || '',
      Description: event.Description || event.description || '',
      EventURL: event.EventURL || event.eventURL || '', 
      EventPrice: event.EventPrice || event.eventPrice || '',
      Status: statusValue,
    })

    setEditEventId(event.EventMasterID || event.Id || event.eventMasterID)
    setEditMode(true)
    setShowForm(true)

    if (event.Image || event.image) {
      const imageUrl = event.Image || event.image
      setExistingImageUrl(imageUrl)
      setEventImage(imageUrl)
    } else {
      setExistingImageUrl('')
      setEventImage(null)
    }
  }

  const handleDelete = (event) => {
    setEventToDelete(event)
    setShowDeletePopup(true)
  }

  const confirmDelete = async () => {
    try {
      const eventId = eventToDelete?.EventMasterID || eventToDelete?.Id
      const res = await dispatch(deleteEvent(eventId)).unwrap()
      if (res.statusCode === 200 || res.statusCode === 1) {
        toast.success(res.message || 'Event deleted successfully!')
      } else {
        toast.error(res.message || 'Failed to delete event')
      }
      dispatch(getevent())
    } catch (error) {
      console.error('Delete Error:', error)
      toast.error('Failed to delete event')
    } finally {
      setShowDeletePopup(false)
      setEventToDelete(null)
    }
  }

  const previewImage = useMemo(() => {
    if (!eventImage) return null

    const src =
      typeof eventImage === 'string'
        ? eventImage
        : URL.createObjectURL(eventImage)
    return (
      <img
        src={src}
        width={128}
        height={128}
        alt="Preview"
        className="object-cover w-32 h-32 mt-2 border rounded"
      />
    )
  }, [eventImage])

  const tableData = useMemo(() => {
    if (!Array.isArray(data)) return []
    return data.map((item, index) => ({
      ...item,
      sno: index + 1,
    }))
  }, [data])

  const formTitle = editMode ? 'Edit Event' : 'Add New Event'
  const submitButtonText = loading
    ? editMode
      ? 'Updating...'
      : 'Adding...'
    : editMode
      ? 'Update Event'
      : 'Add Event'

  const publishButtonText = useMemo(() => {
    if (loading) {
      return formData.Status === 1 ? 'Publishing...' : 'Unpublishing...'
    }
    return formData.Status === 1 ? 'Publish Event' : 'Update Event'
  }, [loading, formData.Status])

  if (showScheduleForm) {
    return (
      <ScheduleModal
        event={selectedEvent}
        onClose={() => setShowScheduleForm(false)}
        onSuccess={() => {
          setShowScheduleForm(false)
          dispatch(getevent())
        }}
      />
    )
  }

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg">
      <div className="flex items-center justify-start p-4 pb-0 md:justify-between">
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true)
              setEditMode(false)
              resetForm()
            }}
            className="px-4 py-2 mx-auto mt-3 text-white rounded-md bg-add-btn md:mx-0"
          >
            + Add Event
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <h2 className="mb-6 text-xl font-bold text-left text-black">
            {formTitle}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="Tittle"
                placeholder="Enter Event Title"
                value={formData.Tittle}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.Tittle && (
                <p className="mt-1 text-sm text-red-500">{errors.Tittle}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">Event Type <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="EventType"
                placeholder="Enter Event Type"
                value={formData.EventType}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.EventType && (
                <p className="mt-1 text-sm text-red-500">{errors.EventType}</p>
              )}
            </div>
          </div>

          {/* ✅ Date fields with min attribute set to today's date */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium">Event Start Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="EventStartDate"
                value={formData.EventStartDate}
                onChange={handleInputChange}
                min={getTodayDate()}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.EventStartDate && (
                <p className="mt-1 text-sm text-red-500">{errors.EventStartDate}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">Event End Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="EndStartDate"
                value={formData.EndStartDate}
                onChange={handleInputChange}
                min={formData.EventStartDate || getTodayDate()}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.EndStartDate && (
                <p className="mt-1 text-sm text-red-500">{errors.EndStartDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium">Available Seats <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="AvailableSeats"
                placeholder="Enter Available Seats"
                value={formData.AvailableSeats}
                onChange={handleNumberInputChange}
                min="0"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.AvailableSeats && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.AvailableSeats}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">Location <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="Location"
                placeholder="Enter Event Location"
                value={formData.Location}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.Location && (
                <p className="mt-1 text-sm text-red-500">{errors.Location}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium">Event Mode <span className="text-red-500">*</span></label>
              <select
                name="EventMode"
                value={formData.EventMode}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                {eventModeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.EventMode && (
                <p className="mt-1 text-sm text-red-500">{errors.EventMode}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">Access Type <span className="text-red-500">*</span></label>
              <select
                name="AccessType"
                value={formData.AccessType}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                {accessTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.AccessType && (
                <p className="mt-1 text-sm text-red-500">{errors.AccessType}</p>
              )}
            </div>
          </div>

          {/* ✅ Event Price Field */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium">Event Price <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="EventPrice"
                placeholder="Enter Event Price"
                value={formData.EventPrice}
                onChange={handleNumberInputChange}
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.EventPrice && (
                <p className="mt-1 text-sm text-red-500">{errors.EventPrice}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-medium">Event URL</label>
              <input
                type="url"
                name="EventURL"
                placeholder="Enter Event URL (e.g., https://example.com/event)"
                value={formData.EventURL}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.EventURL && (
                <p className="mt-1 text-sm text-red-500">{errors.EventURL}</p>
              )}
            </div>
          </div>

          {/* ✅ Session Time Fields with Time Range Input */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium">Session Time <span className="text-red-500">*</span></label>
              <TimeRangeInput
                value={formData.SessionsTime}
                onChange={(value) => setFormData(prev => ({ ...prev, SessionsTime: value }))}
                placeholder="Select Session Time Range"
                name="SessionsTime"
              />
              {errors.SessionsTime && (
                <p className="mt-1 text-sm text-red-500">{errors.SessionsTime}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-medium">Session Seats <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="SessionSeats"
                placeholder="Session Seats"
                value={formData.SessionSeats}
                onChange={handleNumberInputChange}
                min="0"
                className={`w-full p-3 border rounded-md ${
                  errors.SessionSeats ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.SessionSeats && (
                <p className="mt-1 text-sm text-red-500">{errors.SessionSeats}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium">Session Time One</label>
              <TimeRangeInput
                value={formData.SessionsTimeOne}
                onChange={(value) => setFormData(prev => ({ ...prev, SessionsTimeOne: value }))}
                placeholder="Select Session Time One Range"
                name="SessionsTimeOne"
              />
              {errors.SessionsTimeOne && (
                <p className="mt-1 text-sm text-red-500">{errors.SessionsTimeOne}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-medium">Session One Seats</label>
              <input
                type="number"
                name="SessionOneSeats"
                placeholder="Session One Seats"
                value={formData.SessionOneSeats}
                onChange={handleNumberInputChange}
                min="0"
                className={`w-full p-3 border rounded-md ${
                  errors.SessionOneSeats ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.SessionOneSeats && (
                <p className="mt-1 text-sm text-red-500">{errors.SessionOneSeats}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium">Session Time Two</label>
              <TimeRangeInput
                value={formData.SessionsTimeTwo}
                onChange={(value) => setFormData(prev => ({ ...prev, SessionsTimeTwo: value }))}
                placeholder="Select Session Time Two Range"
                name="SessionsTimeTwo"
              />
              {errors.SessionsTimeTwo && (
                <p className="mt-1 text-sm text-red-500">{errors.SessionsTimeTwo}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-medium">Session Two Seats</label>
              <input
                type="number"
                name="SessionTwoSeats"
                placeholder="Session Two Seats"
                value={formData.SessionTwoSeats}
                onChange={handleNumberInputChange}
                min="0"
                className={`w-full p-3 border rounded-md ${
                  errors.SessionTwoSeats ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.SessionTwoSeats && (
                <p className="mt-1 text-sm text-red-500">{errors.SessionTwoSeats}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium">Description <span className="text-red-500">*</span></label>
              <textarea
                name="Description"
                placeholder="Enter Event Description"
                value={formData.Description}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
              />
              {errors.Description && (
                <p className="mt-1 text-sm text-red-500">{errors.Description}</p>
              )}
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Image <span className="text-red-500">*</span></label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {previewImage}
              {errors.eventImage && (
                <p className="mt-1 text-sm text-red-500">{errors.eventImage}</p>
              )}
            </div>
          </div>

          {/* ✅ Total session seats error message */}
          {errors.totalSessionSeats && (
            <div className="p-3 border border-red-200 rounded-md bg-red-50">
              <p className="text-sm text-red-500">{errors.totalSessionSeats}</p>
            </div>
          )}

          {/* ✅ Session seats exceeded warning */}
          {isSessionSeatsExceeded && !errors.totalSessionSeats && (
            <div className="p-3 border border-orange-200 rounded-md bg-orange-50">
              <p className="text-sm text-orange-500">
                ⚠️ Total session seats exceed available seats. Please adjust the values.
              </p>
            </div>
          )}

          {editMode && (
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="statusCheckbox"
                checked={formData.Status === 1}
                onChange={handleStatusChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor="statusCheckbox"
                className="ml-2 text-sm font-medium text-gray-900"
              >
                {formData.Status === 1 ? 'Active' : 'Active'}
              </label>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className={`px-6 py-2 text-white rounded-md ${
                formData.Status === 1 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              disabled={loading || isSessionSeatsExceeded}
            >
              {editMode ? publishButtonText : submitButtonText}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm()
                setShowForm(false)
              }}
              className="px-6 py-2 text-white rounded-md bg-cancel-btn hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!showForm && mounted && (
        <>
          {loading && <div className="p-4 text-center">Loading events...</div>}

          {!loading && (
            <Table
              columns={updatedColumns}
              data={tableData}
              loading={loading}
              title={'Events'}
              onEdit={handleEdit}
            />
          )}

          {!loading && tableData.length === 0 && (
            <div className="p-4 text-center text-gray-500">No events found</div>
          )}
        </>
      )}

      {showDeletePopup && (
        <DeletePopup
          show={showDeletePopup}
          type="event"
          name={eventToDelete?.Tittle}
          onCancel={() => setShowDeletePopup(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  )
}

export default React.memo(Event)