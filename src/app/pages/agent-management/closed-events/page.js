'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeEventMaster, getEventById } from '@/app/redux/eventSlice'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/event-constant'
import Loading from '@/app/common/loading'
import { addEventPreImages, deleteEventImages, getEventImagesByEMID } from '@/app/redux/eventSlice'
import { toast } from 'react-toastify'

const ClosedEvents = () => {
  const dispatch = useDispatch()
  const { closeData, loading, eventImages } = useSelector((state) => state.event)

  const [showUpload, setShowUpload] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [videoPreviews, setVideoPreviews] = useState([])
  const [imageErrors, setImageErrors] = useState([])
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [eventSchedules, setEventSchedules] = useState([])
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false)

  const handleSchedule = (row) => {
    setSelectedEvent(row)
    setShowScheduleModal(true)
    setIsLoadingSchedules(true)
    setEventSchedules([])

    if (row.EventMasterID) {
      dispatch(getEventById(row.EventMasterID))
        .unwrap()
        .then((res) => {
          const userEventList = res?.data?.userEvent

          if (Array.isArray(userEventList) && userEventList.length > 0) {
            setEventSchedules(userEventList)
            toast.success(`Schedules fetched successfully!`)
          } else {
            setEventSchedules([])
            toast.info("No schedules found for this event")
          }
        })
        .catch((err) => {
          console.error("Fetch Error:", err)
          toast.error(err?.message || "Failed to fetch event schedules")
          setEventSchedules([])
        })
        .finally(() => {
          setIsLoadingSchedules(false)
        })
    } else {
      toast.error("Event ID not found")
      setIsLoadingSchedules(false)
    }
  }

  const handleActionClick = (row) => {
    setSelectedEvent(row)
    dispatch(getEventImagesByEMID(row.EventMasterID))
    setShowUpload(true)
  }

  const handleMediaSubmit = async (files, event) => {
    if (images.length === 0 && videos.length === 0) {
      toast.error('Please select at least one image')
      return
    }

    const formData = new FormData()
    images.forEach((image) => {
      formData.append(`Image`, image)
    })
    videos.forEach((video) => {
      formData.append(`EventVideos`, video)
    })

    try {
      const result = await dispatch(addEventPreImages({ EventMasterID: selectedEvent.EventMasterID, formData })).unwrap();
      if (result.statusCode === 200) {
        toast.success("Upload Media successfully !")
      }
      setShowUpload(false)
      setImages([])
      setVideos([])
      setImagePreviews([])
      setVideoPreviews([])
    } catch (error) {
      toast.error(`Upload failed: ${error}`)
    }
  }

  useEffect(() => {
    dispatch(closeEventMaster());
  }, [dispatch])

  const tableData = useMemo(() => {
    if (!Array.isArray(closeData?.data?.event)) return []
    return closeData?.data?.event?.map((item, index) => ({
      ...item,
      sno: index + 1,
    }))
  }, [closeData?.data?.event])

  const customColumns = useMemo(() => {
    const filteredColumns = Columns.filter(col => col.key !== 'schedule')

    return [
      {
        key: 'action',
        label: 'Action',
        render: (value, row) => (
          <button
            className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
            title="Add Media"
            onClick={() => handleActionClick(row)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5zm-11 4a2 2 0 110 4 2 2 0 010-4zm10 10H4v-2l3-3 2 2 5-5 7 7v1z" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 10.5V7a2 2 0 00-2-2H5A2 2 0 003 7v10a2 2 0 002 2h10a2 2 0 002-2v-3.5l4 4v-11l-4 4z" />
            </svg>
          </button>
        )
      },
      {
        key: 'schedule',
        label: 'Event Schedule',
        render: (value, row) => (
          <button
            className="p-2 text-blue-500 transition-colors rounded-full hover:text-blue-700 hover:bg-blue-50"
            onClick={() => handleSchedule(row)}
            title="View Event Schedule"
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
        )
      },
      ...filteredColumns
    ]
  }, [])

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg">
      {showScheduleModal && selectedEvent ? (
        
        <div className="p-4">
  <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
    <div className="mb-4 md:mb-0">
      <h3 className="text-xl font-bold text-gray-800">Event Schedule Details</h3>
      <p className="text-gray-600">Event: {selectedEvent.Tittle}</p>
    </div>
    <button
      onClick={() => setShowScheduleModal(false)}
      className="self-start px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg md:self-center hover:bg-blue-700"
    >
      ← Back to Events
    </button>
  </div>

  <div className="bg-white border rounded-lg shadow">
    <div className="p-4">
      {isLoadingSchedules ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading event schedules...</p>
        </div>
      ) : eventSchedules.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="block md:hidden">
            {eventSchedules.map((schedule, index) => (
              <div key={index} className="p-4 mb-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">S.No.</span>
                  <span className="font-medium">{index + 1}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Title</span>
                  <span className="font-medium text-right">{schedule.Title}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Time</span>
                  <span>{schedule.Time}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Created Date</span>
                  <span className="text-sm">{schedule.CreatedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${schedule.ScheduleStatus?.toLowerCase() === 'open'
                      ? 'bg-green-100 text-green-800'
                      : schedule.ScheduleStatus?.toLowerCase() === 'closed'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {schedule.ScheduleStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-left text-gray-700 border">S.No.</th>
                  <th className="px-4 py-3 text-sm font-medium text-left text-gray-700 border">Title</th>
                  <th className="px-4 py-3 text-sm font-medium text-left text-gray-700 border">Time</th>
                  <th className="px-4 py-3 text-sm font-medium text-left text-gray-700 border">Created Date</th>
                  <th className="px-4 py-3 text-sm font-medium text-left text-gray-700 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {eventSchedules.map((schedule, index) => (
                  <tr key={index} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm border">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium border">{schedule.Title}</td>
                    <td className="px-4 py-3 text-sm border">{schedule.Time}</td>
                    <td className="px-4 py-3 text-sm border">{schedule.CreatedDate}</td>
                    <td className="px-4 py-3 text-sm border">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${schedule.ScheduleStatus?.toLowerCase() === 'open'
                          ? 'bg-green-100 text-green-800'
                          : schedule.ScheduleStatus?.toLowerCase() === 'closed'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {schedule.ScheduleStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 text-gray-400 bg-gray-100 rounded-full">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h4 className="mb-2 text-lg font-medium text-gray-700">No Schedules Found</h4>
          <p className="text-gray-500">There are no schedules available for this event.</p>
        </div>
      )}
    </div>
  </div>
</div>
      ) : showUpload && selectedEvent ? (
        // Upload Media - Full page view (वैसे ही जैसा है)
        <div className="p-4">
          <h3 className="mb-4 text-lg font-semibold">Upload Media for Event: {selectedEvent.Tittle}</h3>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const selectedImages = Array.from(e.target.files)
                const errors = []

                if (selectedImages.length > 10) {
                  errors.push('You can select a maximum of 10 images.')
                }

                selectedImages.forEach((file, index) => {
                  if (!file.type.startsWith('image/')) {
                    errors.push(`File ${index + 1}: Only image files are allowed.`)
                  }
                  if (file.size > 5 * 1024 * 1024) {
                    errors.push(`File ${index + 1}: File size must be less than 5MB.`)
                  }
                })

                if (errors.length === 0) {
                  setImages(selectedImages)
                  const newPreviews = selectedImages.map(file => URL.createObjectURL(file))
                  setImagePreviews(newPreviews)
                  setImageErrors([])
                } else {
                  setImages([])
                  setImagePreviews([])
                  setImageErrors(errors)
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            {imageErrors.length > 0 && (
              <div className="mt-2">
                {imageErrors.map((error, index) => (
                  <p key={index} className="text-sm text-red-500">{error}</p>
                ))}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Videos</label>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => {
                const selectedVideos = Array.from(e.target.files)
                setVideos(selectedVideos)
                const newPreviews = selectedVideos.map(file => URL.createObjectURL(file))
                setVideoPreviews(newPreviews)
              }}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          {imagePreviews.length > 0 && (
            <div className="mb-8">
              <h4 className="mb-2 font-medium">Image Previews:</h4>
              <div className="grid grid-cols-4 gap-2">
                {imagePreviews.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt={`Image Preview ${index}`} className="object-cover w-full h-20 rounded" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {videoPreviews.length > 0 && (
            <div className="mb-8">
              <h4 className="mb-2 font-medium">Video Previews:</h4>
              <div className="grid grid-cols-4 gap-2">
                {videoPreviews.map((url, index) => (
                  <video key={index} src={url} className="object-cover w-full h-20 rounded" controls />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                const allFiles = [...images, ...videos]
                handleMediaSubmit(allFiles, selectedEvent)
                setImages([])
                setVideos([])
                setImagePreviews([])
                setVideoPreviews([])
              }}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Submit
            </button>
            <button
              onClick={() => {
                setShowUpload(false)
                setImages([])
                setVideos([])
                setImagePreviews([])
                setVideoPreviews([])
              }}
              className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
          {eventImages?.event?.filter(item => item.EventImages).length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 font-medium">Existing Images:</h4>
              <div className="grid grid-cols-4 gap-8">
                {eventImages?.event?.filter(item => item.EventImages).map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image.EventImages} alt={`Existing Image ${index}`} className="object-cover w-full h-40 rounded" />
                    <button
                      onClick={async () => {
                        try {
                          await dispatch(deleteEventImages(image.Id)).unwrap();
                          toast.success("Image deleted successfully!");
                          dispatch(getEventImagesByEMID(selectedEvent.EventMasterID));
                        } catch (error) {
                          toast.error(`Delete failed: ${error}`);
                        }
                      }}
                      className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full top-1 right-1 hover:bg-red-600"
                      title="Delete image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {eventImages?.event?.filter(item => item.EventVideos).length > 0 && (
            <div className="mb-8">
              <h4 className="mb-2 font-medium">Existing Videos:</h4>
              <div className="grid grid-cols-4 gap-8">
                {eventImages?.event?.filter(item => item.EventVideos).map((video, index) => (
                  <div key={index} className="relative">
                    <video src={video?.EventVideos} className="object-cover w-full h-40 rounded" controls />
                    <button
                      onClick={async () => {
                        try {
                          await dispatch(deleteEventImages(video.Id)).unwrap();
                          toast.success("Video deleted successfully!");
                          dispatch(getEventImagesByEMID(selectedEvent.EventMasterID));
                        } catch (error) {
                          toast.error(`Delete failed: ${error}`);
                        }
                      }}
                      className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full top-1 right-1 hover:bg-red-600"
                      title="Delete video"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <>
          {loading && <div className="p-4 text-center"><Loading /></div>}

          {!loading && (
            <Table
              columns={customColumns}
              data={tableData}
              loading={loading}
              title={'Closed Events'}
            />
          )}

          {!loading && tableData.length === 0 && (
            <div className="p-4 text-center text-gray-500">No events found</div>
          )}
        </>
      )}
    </div>
  )
}

export default ClosedEvents