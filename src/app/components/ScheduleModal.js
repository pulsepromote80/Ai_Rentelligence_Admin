// components/ScheduleModal.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { eventSchedule, getevent } from '@/app/redux/eventSlice';
import { toast } from 'react-toastify';
import { getAdminUserId } from '@/app/pages/api/auth';

const ScheduleModal = ({ show, onClose, event }) => {
  const dispatch = useDispatch();
  const [scheduleData, setScheduleData] = useState({
    tittle: '',
    time: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!scheduleData.tittle.trim()) newErrors.tittle = "Title is required";
    if (!scheduleData.time.trim()) newErrors.time = "Time is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format time to HH:mm:ss format (if needed)
  const formatTimeForAPI = (timeString) => {
    if (!timeString) return '';
    // time input already gives HH:mm format, add seconds
    return `${timeString}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const currentAdminUserId = getAdminUserId();
      
      // Create the nested object structure that API expects
      const dataToSubmit = {
        eventScheduleMasterViewModel: {
          tittle: scheduleData.tittle,
          time: formatTimeForAPI(scheduleData.time), // Format time properly
          eventMasterID: event?.EventMasterID,
          createdby: currentAdminUserId || ""
        }
      };

      console.log('Submitting schedule data:', dataToSubmit);

      const response = await dispatch(eventSchedule(dataToSubmit)).unwrap();
      
      console.log('Schedule response:', response);
      
      if (response && (response.statusCode === 200 || response.statusCode === 1)) {
        toast.success(response.message || "Event scheduled successfully!");
        handleClose();
        dispatch(getevent());
      } else {
        toast.error(response?.message || "Failed to schedule event");
      }
    } catch (error) {
      console.error("Schedule Error:", error);
      
      if (error.statusCode === 200 || error.statusCode === 1) {
        toast.success(error.message || "Event scheduled successfully!");
        handleClose();
        dispatch(getevent());
      } else {
        toast.error(error?.message || error?.toString() || "Failed to schedule event");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setScheduleData({ tittle: '', time: '' });
    setErrors({});
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Schedule Event</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Schedule Title</label>
            <input
              type="text"
              name="tittle"
              placeholder="Enter schedule title"
              value={scheduleData.tittle}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.tittle && <p className="mt-1 text-sm text-red-500">{errors.tittle}</p>}
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Schedule Time</label>
            <input
              type="time"
              name="time"
              value={scheduleData.time}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="1" 
            />
            {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time}</p>}
            
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Scheduling...' : 'Schedule Event'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;