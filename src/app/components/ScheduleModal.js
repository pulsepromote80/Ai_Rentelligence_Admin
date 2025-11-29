"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { eventSchedule, getEventById, editScheduleById } from "@/app/redux/eventSlice";
import { toast } from "react-toastify";
import { getAdminUserId } from "@/app/pages/api/auth";

const ScheduleModal = ({ event, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [scheduleData, setScheduleData] = useState({ 
    title: "", 
    time: "", 
    status: "Active" 
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [eventSchedules, setEventSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);

  useEffect(() => {
    if (event?.EventMasterID) {
      dispatch(getEventById(event.EventMasterID))
        .unwrap()
        .then((res) => {
          const userEventList = res?.data?.userEvent;
          if (Array.isArray(userEventList)) {
            const schedules = userEventList.map(item => ({
              Title: item.Title,
              Time: item.Time,
              Createdby: item.Createdby,
              CreatedDate: item.CreatedDate,
              ScheduleStatus: item.ScheduleStatus,
              EventScheduleMasterId: item.EventScheduleMasterId,
              Id: item.Id,
            }));
            setEventSchedules(schedules);
          } else {
            setEventSchedules([]);
          }
        })
        .catch((err) => {
          console.error("Fetch Error:", err);
          toast.error(err?.message || "Failed to fetch event details");
        });
    }
  }, [event?.EventMasterID, dispatch]);

  const filteredData = eventSchedules.filter(schedule =>
    Object.values(schedule).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return "—";
    try {
      const timeParts = timeString.split(':');
      if (timeParts.length >= 3) {
        const hours = parseInt(timeParts[0]);
        const minutes = timeParts[1];
        const seconds = timeParts[2];
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes}:${seconds} ${period}`;
      }
      return timeString;
    } catch (error) {
      return timeString;
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border border-blue-200";
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setScheduleData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (checked ? "Active" : "Completed") : value 
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!scheduleData.title.trim()) newErrors.title = "Title is required";
    if (!scheduleData.time.trim()) newErrors.time = "Time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatTimeForAPI = (timeString) => {
    if (!timeString) return "";
    const parts = timeString.split(":");
    return `${parts[0]}:${parts[1]}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      const currentAdminUserId = getAdminUserId();
      
      if (isEditMode && editingScheduleId) {
        const payload = {
          id: editingScheduleId,
          status: scheduleData.status === "Active" ? 1 : 0,
          eventMasterID: event?.EventMasterID,
          tittle: scheduleData.title,
          time: formatTimeForAPI(scheduleData.time),
          createdby: currentAdminUserId || "",
        };

        const res = await dispatch(eventSchedule(payload)).unwrap();
        
        if (res?.statusCode === 200 || res?.statusCode === 1) {
          toast.success(res.message || "Event schedule updated successfully!");
          resetForm();
          refreshScheduleList(); 
          onSuccess();
        } else {
          toast.error(res?.message || "Failed to update event schedule");
        }
      } else {
        const payload = {
          id: 0,
          status: 1,
          eventMasterID: event?.EventMasterID,
          tittle: scheduleData.title,
          time: formatTimeForAPI(scheduleData.time),
          createdby: currentAdminUserId || "",
        };

        const res = await dispatch(eventSchedule(payload)).unwrap();
        
        if (res?.statusCode === 200 || res?.statusCode === 1) {
          toast.success(res.message || "Event scheduled successfully!");
          resetForm();
          refreshScheduleList(); 
          onSuccess();
        } else {
          toast.error(res?.message || "Failed to schedule event");
        }
      }
    } catch (error) {
      console.error("Schedule Error:", error);
      toast.error(error?.message || `Failed to ${isEditMode ? 'update' : 'schedule'} event`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (schedule) => {
    try {
      setLoading(true);
      
      const numericId = schedule.Id;
      
      const res = await dispatch(editScheduleById(numericId)).unwrap();
      const scheduleData = res?.userEvent?.[0];
      
      if (scheduleData) {
        const status = scheduleData.Status === 1 ? "Active" : "Completed";
        
        setScheduleData({
          title: scheduleData.Title || "",
          time: scheduleData.Time ? scheduleData.Time.substring(0, 5) : "",
          status: status
        });
        
        setIsEditMode(true);
        setEditingScheduleId(numericId);
        toast.success("Schedule loaded for editing");
      } else {
        toast.error("No schedule data found in response");
      }
    } catch (error) {
      console.error("Edit Fetch Error:", error);
      toast.error(error?.message || "Failed to load schedule for editing");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setScheduleData({ title: "", time: "", status: "Active" });
    setErrors({});
    setIsEditMode(false);
    setEditingScheduleId(null);
  };

  const handleBack = () => {
    resetForm();
    onClose();
  };

  const refreshScheduleList = () => {
    if (event?.EventMasterID) {
      dispatch(getEventById(event.EventMasterID))
        .unwrap()
        .then((refreshRes) => {
          const refreshedList = refreshRes?.data?.userEvent;
          if (Array.isArray(refreshedList)) {
            const schedules = refreshedList.map(item => ({
              Title: item.Title,
              Time: item.Time,
              Createdby: item.Createdby,
              CreatedDate: item.CreatedDate,
              ScheduleStatus: item.ScheduleStatus,
              EventScheduleMasterId: item.EventScheduleMasterId,
              Id: item.Id,
            }));
            setEventSchedules(schedules);
            setCurrentPage(1);
          }
        })
        .catch((err) => {
          console.error("Refresh Error:", err);
        });
    }
  };

  const Pagination = () => {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const indexOfFirstRow = (currentPage - 1) * rowsPerPage + 1;
    const indexOfLastRow = Math.min(currentPage * rowsPerPage, filteredData.length);

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
      
      return pages;
    };

    return (
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 mt-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="p-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[5, 10, 25].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          <span className="font-medium">
            {indexOfFirstRow} - {indexOfLastRow} of {filteredData.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`p-2 text-sm border border-gray-300 rounded-l-md ${
              currentPage === 1
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-600 bg-white hover:bg-gray-50'
            }`}
          >
            «
          </button>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 text-sm border border-gray-300 ${
              currentPage === 1
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-600 bg-white hover:bg-gray-50'
            }`}
          >
            ‹
          </button>
          
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
              disabled={page === '...'}
              className={`min-w-[40px] p-2 text-sm border border-gray-300 ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : page === '...'
                  ? 'text-gray-400 bg-white cursor-default'
                  : 'text-gray-600 bg-white hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 text-sm border border-gray-300 ${
              currentPage === totalPages
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-600 bg-white hover:bg-gray-50'
            }`}
          >
            ›
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`p-2 text-sm border border-gray-300 rounded-r-md ${
              currentPage === totalPages
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-600 bg-white hover:bg-gray-50'
            }`}
          >
            »
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 text-black border-gray-200 rounded-t-lg bg-gray-50">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 text-black transition-colors rounded-full hover:bg-gray-200"
            title="Back to Events"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold">
              {isEditMode ? "Edit Schedule" : "Schedule Event"}
            </h1>
          </div>
        </div>
      </div>

      {/* ✅ Schedule Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter schedule title"
              value={scheduleData.title}
              onChange={handleChange}
              className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Schedule Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="time"
              value={scheduleData.time}
              onChange={handleChange}
              className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              step="1"
            />
            {errors.time && (
              <p className="mt-1 text-xs text-red-500">{errors.time}</p>
            )}
          </div>
        </div>

        {isEditMode && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="status"
              id="status"
              checked={scheduleData.status === "Active"} 
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {loading 
              ? (isEditMode ? "Updating..." : "Scheduling...") 
              : (isEditMode ? "Update Event" : "Schedule Event")
            }
          </button>
          
          {isEditMode && (
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-yellow-200 rounded-md hover:bg-yellow-300 disabled:bg-yellow-100 disabled:cursor-not-allowed"
            >
              Cancel Edit
            </button>
          )}
          
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Back
          </button>
        </div>
      </form>

      <div className="p-4">
        <div className="flex flex-col items-start justify-between gap-3 mb-4 sm:flex-row sm:items-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Event Schedule List
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search schedules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48 p-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {filteredData.length > 0 ? (
          <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-center text-white uppercase">
                      Action
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-center text-white uppercase">
                      S.No.
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-center text-white uppercase">
                      Title
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-center text-white uppercase">
                      Time
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-center text-white uppercase">
                      Created Date
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wider text-center text-white uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRows.map((schedule, index) => (
                    <tr 
                      key={schedule.EventScheduleMasterId} 
                      className="transition-colors hover:bg-blue-50"
                    >
                      <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(schedule)}
                          disabled={loading}
                          className="p-2 text-blue-600 transition-colors rounded-full hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit Schedule"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-center text-gray-900 whitespace-nowrap">
                        {indexOfFirstRow + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-900">
                        {schedule.Title || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-900 whitespace-nowrap">
                        {formatTimeForDisplay(schedule.Time)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-900 whitespace-nowrap">
                        {formatDateForDisplay(schedule.CreatedDate)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(schedule.ScheduleStatus)}`}
                        >
                          {schedule.ScheduleStatus || "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 sm:hidden">
              {currentRows.map((schedule, index) => (
                <div 
                  key={schedule.EventScheduleMasterId} 
                  className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">S.No.:</span>
                      <span className="text-sm font-medium text-gray-900">{indexOfFirstRow + index}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Title:</span>
                      <span className="text-sm text-right text-gray-900">{schedule.Title || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Time:</span>
                      <span className="text-sm text-gray-900">{formatTimeForDisplay(schedule.Time)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Created Date:</span>
                      <span className="text-sm text-gray-900">{formatDateForDisplay(schedule.CreatedDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Status:</span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(schedule.ScheduleStatus)}`}
                      >
                        {schedule.ScheduleStatus || "Active"}
                      </span>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleEdit(schedule)}
                        disabled={loading}
                        className="flex items-center gap-1 px-3 py-1 text-xs text-blue-600 transition-colors bg-blue-100 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination />
          </div>
        ) : (
          <div className="p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-gray-500">No schedules found</p>
            <p className="text-sm text-gray-400">Create your first schedule using the form above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ScheduleModal);