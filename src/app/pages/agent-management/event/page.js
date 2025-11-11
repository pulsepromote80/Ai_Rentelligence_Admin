"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addevent, getevent, updateevent, eventSchedule } from "@/app/redux/eventSlice";
import Table from "@/app/common/datatable";
import { Columns } from "@/app/constants/event-constant";
import { toast } from "react-toastify";
import DeletePopup from "@/app/common/utils/delete-popup";
import { eventData, eventLoading } from "./event-selectors";
import { getAdminUserId } from "@/app/pages/api/auth";
import ScheduleModal from "@/app/components/ScheduleModal";

const Event = () => {
  const dispatch = useDispatch();
  const loading = useSelector(eventLoading);
  const data = useSelector(eventData);

  const [formData, setFormData] = useState({
    Tittle: "",
    EventType: "",
    AvailableSeats: "",
    Location: "",
    DateTime: "",
    Description: "",
    VIP: "", 
    Premium: "", 
    Standard: "",
    StandardSeats: "", 
    VIPSeats: "",      
    PremiumSeats: "",  
    EventMode: "", // ✅ नया field
    Status: 1
  });
  const [eventImage, setEventImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(""); 
  const [editMode, setEditMode] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [mounted, setMounted] = useState(false);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  
  // Schedule form states
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ✅ Event Mode options
  const eventModeOptions = [
    { value: "", label: "Select Event Mode" },
    { value: "Hybrid Event", label: "Hybrid Event" },
    { value: "Online Event", label: "Online Event" },
    { value: "Offline Event", label: "Offline Event" }
  ];

  useEffect(() => {
    dispatch(getevent());
    setMounted(true);
  }, [dispatch]);

  const resetForm = useCallback(() => {
    setFormData({
      Tittle: "",
      EventType: "",
      AvailableSeats: "",
      Location: "",
      DateTime: "",
      Description: "", 
      VIP: "", 
      Premium: "", 
      Standard: "", 
      StandardSeats: "", 
      VIPSeats: "",      
      PremiumSeats: "",  
      EventMode: "", // ✅ नया field
      Status: 1 
    });
    setEventImage(null);
    setExistingImageUrl("");
    setEditMode(false);
    setEditEventId(null);
    setErrors({});
  }, []);

  
  const handleSchedule = useCallback((row) => {
    setSelectedEvent(row);
    setShowScheduleForm(true);
  }, []);

  const updatedColumns = useMemo(() => {
    return Columns.map(col => {
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
          )
        };
      }
      return col;
    });
  }, [handleSchedule]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleStatusChange = (e) => {
    const isChecked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      Status: isChecked ? 1 : 0
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Tittle.trim()) newErrors.Tittle = "Title is required.";
    if (!formData.EventType.trim()) newErrors.EventType = "Event Type is required.";
    if (!formData.AvailableSeats.trim()) newErrors.AvailableSeats = "Available Seats is required.";
    if (!formData.Location.trim()) newErrors.Location = "Location is required.";
    if (!formData.DateTime.trim()) newErrors.DateTime = "Date & Time is required.";
    if (!formData.Description.trim()) newErrors.Description = "Description is required."; 
    if (!formData.EventMode.trim()) newErrors.EventMode = "Event Mode is required."; // ✅ नया validation
    
    if (!editMode && !eventImage) {
      newErrors.eventImage = "Event image is required.";
    }
    
    if (formData.AvailableSeats && isNaN(formData.AvailableSeats)) {
      newErrors.AvailableSeats = "Available Seats must be a number.";
    }

    if (formData.VIP && isNaN(formData.VIP)) {
      newErrors.VIP = "VIP must be a number.";
    }
    if (formData.Premium && isNaN(formData.Premium)) {
      newErrors.Premium = "Premium must be a number.";
    }
    if (formData.Standard && isNaN(formData.Standard)) {
      newErrors.Standard = "Standard must be a number.";
    }

    // ✅ नए fields की validation
    if (formData.StandardSeats && isNaN(formData.StandardSeats)) {
      newErrors.StandardSeats = "Standard Seats must be a number.";
    }
    if (formData.VIPSeats && isNaN(formData.VIPSeats)) {
      newErrors.VIPSeats = "VIP Seats must be a number.";
    }
    if (formData.PremiumSeats && isNaN(formData.PremiumSeats)) {
      newErrors.PremiumSeats = "Premium Seats must be a number.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEventImage(file); 
    if (errors.eventImage) setErrors((prev) => ({ ...prev, eventImage: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitFormData = new FormData();
    
    if (editMode) {
      const currentAdminUserId = getAdminUserId();
      
      submitFormData.append("EventMasterID", editEventId);
      submitFormData.append("Tittle", formData.Tittle);
      submitFormData.append("EventType", formData.EventType);
      submitFormData.append("AvailableSeats", formData.AvailableSeats);
      submitFormData.append("Location", formData.Location);
      submitFormData.append("DateTime", formData.DateTime);
      submitFormData.append("Description", formData.Description); 
      submitFormData.append("VIP", formData.VIP); 
      submitFormData.append("Premium", formData.Premium); 
      submitFormData.append("Standard", formData.Standard); 
      submitFormData.append("StandardSeats", formData.StandardSeats); 
      submitFormData.append("VIPSeats", formData.VIPSeats);          
      submitFormData.append("PremiumSeats", formData.PremiumSeats);  
      submitFormData.append("EventMode", formData.EventMode); // ✅ नया field
      submitFormData.append("Updatedby", currentAdminUserId || "");
      submitFormData.append("Status", formData.Status.toString());
     
      if (eventImage instanceof File) {
        submitFormData.append("Image", eventImage);
      } else if (existingImageUrl) {
        try {
          const response = await fetch(existingImageUrl);
          const blob = await response.blob();
          const file = new File([blob], "existing-image.jpg", { type: blob.type });
          submitFormData.append("Image", file);
        } catch (error) {
          console.error("Failed to convert image URL to file:", error);
          const emptyFile = new File([""], "empty.jpg", { type: "image/jpeg" });
          submitFormData.append("Image", emptyFile);
        }
      } else {
        const emptyFile = new File([""], "empty.jpg", { type: "image/jpeg" });
        submitFormData.append("Image", emptyFile);
      }
    } else {
      const currentAdminUserId = getAdminUserId();
      
      submitFormData.append("Tittle", formData.Tittle);
      submitFormData.append("EventType", formData.EventType);
      submitFormData.append("AvailableSeats", formData.AvailableSeats);
      submitFormData.append("Location", formData.Location);
      submitFormData.append("DateTime", formData.DateTime);
      submitFormData.append("Description", formData.Description); 
      submitFormData.append("VIP", formData.VIP); 
      submitFormData.append("Premium", formData.Premium); 
      submitFormData.append("Standard", formData.Standard); 
      submitFormData.append("StandardSeats", formData.StandardSeats); 
      submitFormData.append("VIPSeats", formData.VIPSeats);          
      submitFormData.append("PremiumSeats", formData.PremiumSeats);  
      submitFormData.append("EventMode", formData.EventMode); // ✅ नया field
      submitFormData.append("Createdby", currentAdminUserId || "");
      submitFormData.append("Status", formData.Status.toString());
      
      if (eventImage) {
        submitFormData.append("Image", eventImage);
      } else {
        const emptyFile = new File([""], "empty.jpg", { type: "image/jpeg" });
        submitFormData.append("Image", emptyFile);
      }
    }

    try {
      let response;

      if (editMode) {
        response = await dispatch(updateevent(submitFormData)).unwrap();
      } else {
        response = await dispatch(addevent(submitFormData)).unwrap();
      }

      if (response.statusCode === 200 || response.statusCode === 1) {
        toast.success(response.message || `Event ${editMode ? 'updated' : 'added'} successfully!`);
        resetForm();
        setShowForm(false);
        dispatch(getevent());
      } else {
        toast.error(response.message || `Failed to ${editMode ? 'update' : 'add'} event`);
      }
    } catch (error) {
      console.error("Error during event submit:", error);
      toast.error(error?.response?.data?.message || `Failed to ${editMode ? 'update' : 'add'} event`);
    }
  };

 
const handleEdit = (event) => {
  const statusValue = (event.Status === 0 || event.Status === 1) 
    ? event.Status 
    : 1;
  
  setFormData({
    Tittle: event.Tittle || event.title || "",
    EventType: event.EventType || event.eventType || "",
    AvailableSeats: event.AvailableSeats || event.availableSeats || "",
    Location: event.Location || event.location || "",
    DateTime: event.EventDateTime || event.DateTime || event.eventDateTime || event.dateTime || "",
    Description: event.Description || event.description || event.Desc || event.desc || "",
    VIP: event.VIP || event.vip || event.Vip || "",
    Premium: event.Premium || event.premium || "",
    Standard: event.Standard || event.standard || "",
    StandardSeats: event.StandardSeats || event.standardSeats || "", 
    VIPSeats: event.VIPSeats || event.vipSeats || "",               
    PremiumSeats: event.PremiumSeats || event.premiumSeats || "",   
    EventMode: event.EventMode || event.eventMode || "", // ✅ नया field
    Status: statusValue
  });
  
  setEditEventId(event.EventMasterID || event.Id || event.eventMasterID);
  setEditMode(true);
  setShowForm(true);
  
  if (event.Image || event.image) {
    const imageUrl = event.Image || event.image;
    setExistingImageUrl(imageUrl);
    setEventImage(imageUrl); 
  } else {
    setExistingImageUrl("");
    setEventImage(null);
  }
};
  const handleDelete = (event) => {
    setEventToDelete(event);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      const eventId = eventToDelete?.EventMasterID || eventToDelete?.Id;
      const res = await dispatch(deleteEvent(eventId)).unwrap();
      if (res.statusCode === 200 || res.statusCode === 1) {
        toast.success(res.message || "Event deleted successfully!");
      } else {
        toast.error(res.message || "Failed to delete event");
      }
      dispatch(getevent());
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete event");
    } finally {
      setShowDeletePopup(false);
      setEventToDelete(null);
    }
  };

  const previewImage = useMemo(() => {
    if (!eventImage) return null;
    
    const src = typeof eventImage === 'string' ? eventImage : URL.createObjectURL(eventImage);
    return (
      <img
        src={src}
        width={128}
        height={128}
        alt="Preview"
        className="object-cover w-32 h-32 mt-2 border rounded"
      />
    );
  }, [eventImage]);

  const tableData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((item, index) => ({
      ...item,
      sno: index + 1
    }));
  }, [data]);

  const formTitle = editMode ? "Edit Event" : "Add New Event";
  const submitButtonText = loading ? 
    (editMode ? "Updating..." : "Adding...") : 
    (editMode ? "Update Event" : "Add Event");

  if (showScheduleForm) {
    return (
      <ScheduleModal
        event={selectedEvent}
        onClose={() => setShowScheduleForm(false)}
        onSuccess={() => {
          setShowScheduleForm(false);
          dispatch(getevent());
        }}
      />
    );
  }

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg">
      <div className="flex items-center justify-start p-4 pb-0 md:justify-between">
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setEditMode(false);
              resetForm();
            }}
            className="px-4 py-2 mx-auto mt-3 text-white rounded-md bg-add-btn md:mx-0"
          >
            + Add Event
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <h2 className="mb-6 text-xl font-bold text-left text-black">{formTitle}</h2>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium">Title</label>
              <input
                type="text"
                name="Tittle"
                placeholder="Enter Event Title"
                value={formData.Tittle}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.Tittle && <p className="mt-1 text-sm text-red-500">{errors.Tittle}</p>}
            </div>

            <div>
              <label className="block mb-2 font-medium">Event Type</label>
              <input
                type="text"
                name="EventType"
                placeholder="Enter Event Type"
                value={formData.EventType}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.EventType && <p className="mt-1 text-sm text-red-500">{errors.EventType}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium">Available Seats</label>
              <input
                type="number"
                name="AvailableSeats"
                placeholder="Enter Available Seats"
                value={formData.AvailableSeats}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.AvailableSeats && <p className="mt-1 text-sm text-red-500">{errors.AvailableSeats}</p>}
            </div>

            <div>
              <label className="block mb-2 font-medium">Event Mode</label>
              <select
                name="EventMode"
                value={formData.EventMode}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                {eventModeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.EventMode && <p className="mt-1 text-sm text-red-500">{errors.EventMode}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium">Location</label>
              <input
                type="text"
                name="Location"
                placeholder="Enter Event Location"
                value={formData.Location}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.Location && <p className="mt-1 text-sm text-red-500">{errors.Location}</p>}
            </div>

            <div>
              <label className="block mb-2 font-medium">Date & Time</label>
              <input
                type="datetime-local"
                name="DateTime"
                value={formData.DateTime}
                onChange={handleInputChange}
                min={new Date().toISOString().slice(0, 16)} 
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.DateTime && <p className="mt-1 text-sm text-red-500">{errors.DateTime}</p>}
            </div>
          </div>

          {/* ✅ Price and Seats fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-2 font-medium">VIP Seats</label>
              <input
                type="number"
                name="VIPSeats"
                placeholder="VIP Seats"
                value={formData.VIPSeats}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.VIPSeats && <p className="mt-1 text-sm text-red-500">{errors.VIPSeats}</p>}
            </div>
            <div>
              <label className="block mb-2 font-medium">VIP Price</label>
              <input
                type="number"
                name="VIP"
                placeholder="VIP Price"
                value={formData.VIP}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.VIP && <p className="mt-1 text-sm text-red-500">{errors.VIP}</p>}
            </div>
            <div>
              <label className="block mb-2 font-medium">Premium Seats</label>
              <input
                type="number"
                name="PremiumSeats"
                placeholder="Premium Seats"
                value={formData.PremiumSeats}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.PremiumSeats && <p className="mt-1 text-sm text-red-500">{errors.PremiumSeats}</p>}
            </div>

            <div>
              <label className="block mb-2 font-medium">Premium Price</label>
              <input
                type="number"
                name="Premium"
                placeholder="Premium Price"
                value={formData.Premium}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.Premium && <p className="mt-1 text-sm text-red-500">{errors.Premium}</p>}
            </div>
             <div>
              <label className="block mb-2 font-medium">Standard Seats</label>
              <input
                type="number"
                name="StandardSeats"
                placeholder="Standard Seats"
                value={formData.StandardSeats}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.StandardSeats && <p className="mt-1 text-sm text-red-500">{errors.StandardSeats}</p>}
            </div>

            <div>
              <label className="block mb-2 font-medium">Standard Price</label>
              <input
                type="number"
                name="Standard"
                placeholder="Standard Price"
                value={formData.Standard}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.Standard && <p className="mt-1 text-sm text-red-500">{errors.Standard}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 font-medium">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {previewImage}
              {errors.eventImage && <p className="mt-1 text-sm text-red-500">{errors.eventImage}</p>}
            </div>
          </div>

          {/* ✅ Description field - textarea */}
          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              name="Description"
              placeholder="Enter Event Description"
              value={formData.Description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md resize-none"
            />
            {errors.Description && <p className="mt-1 text-sm text-red-500">{errors.Description}</p>}
          </div>

          {editMode && (
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="statusCheckbox"
                checked={formData.Status === 1}
                onChange={handleStatusChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="statusCheckbox" className="ml-2 text-sm font-medium text-gray-900">
                Active
              </label>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="px-6 py-2 text-white rounded-md bg-submit-btn hover:bg-green-700"
              disabled={loading}
            >
              {submitButtonText}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
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
              title={"Events"}
              onEdit={handleEdit}
            //   onDelete={handleDelete}
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
  );
};

export default React.memo(Event);