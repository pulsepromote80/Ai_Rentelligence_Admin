import React from "react";
import Image from "next/image";

export const API_ENDPOINTS = {
  GET_ALL_EVENT_MASTER: "/Event/getAllEventMaster",
  ADD_EVENT_MASTER: "/Event/addEventMaster",
  UPDATE_EVENT:"/Event/UpdateEvent",
  ADD_EVENT_SCHEDULE:"/Event/addEventSchedule",
  GET_SCHEDULE_BY_EID:"/Event/getScheduleByEID",
  GET_ALL_USER_EVENT_BOOKING_MASTER:"/Event/getAllUserEventbookingMaster"
};


export const Columns = [
    { 
  key: 'schedule', 
  label: 'Event Schedule',
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
},

 { 
    key: 'sno', 
    label: 'S.No.',
    render: (value) => value 
  },
  { key: 'Tittle', label: 'Tittle' },
  { key: 'Image', label: 'Image',render: (value) => (
    <div className="overflow-hidden rounded-md">
      <Image 
        src={value} 
        alt="Category" 
        layout="responsive" 
        width={64} 
        height={80}
        className="object-cover hello"
      />
    </div>
  ),},
  { key: 'EventType', label: 'Event Type' },
  { key: 'AccessType', label: 'Access Type' },
  { key: 'AvailableSeats', label: 'Available Seats' },
  { key: 'Location', label: 'Location' },
  { key: 'EventStartDate', label: 'Event Start Date' },
   { key: 'EndStartDate', label: 'Event End Date' },
  { key: 'EventStatus', label: 'Event Status', 
  render: (value) => {
    const getStatusClass = (status) => {
      switch(status?.toLowerCase()) {
        case 'open':
          return 'bg-blue-100 text-blue-800 border border-blue-200';
        case 'closed':
          return 'bg-gray-100 text-gray-800 border border-gray-200';
        case 'cancelled':
          return 'bg-red-100 text-red-800 border border-red-200';
        case 'completed':
          return 'bg-blue-100 text-blue-800 border border-blue-200';
        default:
          return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      }
    };

    return (
      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(value)}`}>
        {value || 'Unknown'}
      </span>
    );
  }
}
];