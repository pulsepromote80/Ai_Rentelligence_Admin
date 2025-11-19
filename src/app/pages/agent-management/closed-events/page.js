'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeEventMaster } from '@/app/redux/eventSlice'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/event-constant'
import Loading from '@/app/common/loading'
import { addEventPreImages ,deleteEventImages} from '@/app/redux/eventSlice'
import { toast } from 'react-toastify'


const ClosedEvents = () => {
  const dispatch = useDispatch()
  const {closeData, loading,} = useSelector((state) => state.event)

  const [showUpload, setShowUpload] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  // console.log("selected", selectedEvent);
  const [images, setImages] = useState([])
  console.log(images)
  const [videos, setVideos] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [videoPreviews, setVideoPreviews] = useState([])
  const [imageErrors, setImageErrors] = useState([])

  const handleActionClick = (row) => {
    setSelectedEvent(row)
    setShowUpload(true)
  }

  const handleMediaSubmit = async (files, event) => {
    if (images.length === 0 ) {
      toast.error('Please select at least one image.')
      return
    }

    const formData = new FormData()
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image)
    })

    try {
      const result = await dispatch(addEventPreImages({ EventMasterID: selectedEvent.EventMasterID, formData })).unwrap();
      if(result.statusCode === 200){
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
    dispatch(deleteEventImages());
  }, [dispatch])

  const tableData = useMemo(() => {
    if (!Array.isArray(closeData?.data?.event)) return []
    return closeData?.data?.event?.map((item, index) => ({
      ...item,
      sno: index + 1,
    }))
  }, [closeData?.data?.event])

  const columns = useMemo(() => [
    {
      key: 'action',
      label: 'Action',
      render: (value, row) => (
        <button className="text-blue-500 hover:text-blue-700" title="Add" onClick={() => handleActionClick(row)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      )
    },
    ...Columns
  ], [])

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg">
      {showUpload && selectedEvent ? (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Upload Media for Event: {selectedEvent.Tittle}</h3>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Select Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const selectedImages = Array.from(e.target.files)
                const errors = []

                // Validate maximum number of files
                if (selectedImages.length > 10) {
                  errors.push('You can select a maximum of 10 images.')
                }

                // Validate file types and sizes
                selectedImages.forEach((file, index) => {
                  if (!file.type.startsWith('image/')) {
                    errors.push(`File ${index + 1}: Only image files are allowed.`)
                  }
                  if (file.size > 5 * 1024 * 1024) { // 5MB
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
                  <p key={index} className="text-red-500 text-sm">{error}</p>
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
            <div className="mb-4">
              <h4 className="font-medium mb-2">Image Previews:</h4>
              <div className="grid grid-cols-4 gap-2">
                {imagePreviews.map((url, index) => (
                  <img key={index} src={url} alt={`Image Preview ${index}`} className="w-full h-20 object-cover rounded" />
                ))}
              </div>
            </div>
          )}
          {videoPreviews.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Video Previews:</h4>
              <div className="grid grid-cols-4 gap-2">
                {videoPreviews.map((url, index) => (
                  <video key={index} src={url} className="w-full h-20 object-cover rounded" controls />
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => {
                const allFiles = [...images, ...videos]
                handleMediaSubmit(allFiles, selectedEvent)
                setImages([])
                setVideos([])
                setImagePreviews([])
                setVideoPreviews([])
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {loading && <div className="p-4 text-center"><Loading/></div>}

          {!loading && (
            <Table
              columns={columns}
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
