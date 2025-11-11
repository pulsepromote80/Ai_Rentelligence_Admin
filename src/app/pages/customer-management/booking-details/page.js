"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserEventbookingMaster } from "@/app/redux/eventSlice";
import Table from "@/app/common/datatable";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';

const bookingData = (state) => state.event.Bookingdetails?.event || [];
const bookingLoading = (state) => state.event.loading;

const EventBooking = () => {
  const dispatch = useDispatch();
  const loading = useSelector(bookingLoading);
  const data = useSelector(bookingData);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    dispatch(getAllUserEventbookingMaster());
  }, [dispatch]);

  const columns = useMemo(() => [
    {
      key: 'sno',
      label: 'S.No.',
      render: (value, row, index) => index + 1
    },
    {
      key: 'Name',
      label: 'Customer Name',
      render: (value) => value || "—"
    },
    {
      key: 'AuthLogin',
      label: 'Auth Login',
      render: (value) => value || "—"
    },
    {
      key: 'TicketNumber',
      label: 'Ticket Number',
      render: (value) => value || "—"
    },
    {
      key: 'CreatedDate',
      label: 'Booking Date',
      render: (value) => value || "—"
    },
    
    {
      key: 'Price',
      label: 'Total Price',
      render: (value) => value ? `$${typeof value === 'number' ? value.toLocaleString() : value}` : "—"
    },
    {
      key: 'SeatsBooked',
      label: 'Seats Booked',
      render: (value) => value || "—"
    },
    {
      key: 'Tittle',
      label: 'Event Title',
      render: (value) => value || "—"
    },
    {
      key: 'EventDateTime',
      label: 'Event Date & Time',
      render: (value) => value || "—"
    },
    {
      key: 'EventType',
      label: 'Event Type',
      render: (value) => value || "—"
    },
    {
      key: 'location',
      label: 'Location',
      render: (value) => value || "—"
    },
    {
      key: 'TicketType',
      label: 'Plan Type',
      render: (value) => {
        const getPlanTypeClass = (TicketType) => {
          switch(TicketType?.toLowerCase()) {
            case 'vip':
              return 'bg-purple-100 text-purple-800 border border-purple-200';
            case 'premium':
              return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'standard':
              return 'bg-blue-100 text-blue-800 border border-blue-200';
            default:
              return 'bg-gray-100 text-gray-800 border border-gray-200';
          }
        };

        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanTypeClass(value)}`}>
            {value || "—"}
          </span>
        );
      }
    },
  ], []);

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) {
      if (data && typeof data === 'object') {
        return Object.values(data);
      }
      return [];
    }
    const filtered = data.filter(booking =>
      Object.values(booking).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    return filtered;
  }, [data, searchTerm]);

  const currentRows = useMemo(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const rows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
    return rows;
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Export to Excel function
  const handleExportToExcel = () => {
    try {
      if (!filteredData || filteredData.length === 0) {
        toast.warning("No data available to export");
        return;
      }

      // Prepare data for Excel
      const excelData = filteredData.map((item, index) => ({
        'S.No.': index + 1,
        'Customer Name': item.Name || '—',
        'Auth Login': item.AuthLogin || '—',
        'Ticket Number': item.TicketNumber || '—',
        'Booking Date': item.CreatedDate || '—',
        'Total Price': item.Price ? `$${typeof item.Price === 'number' ? item.Price.toLocaleString() : item.Price}` : '—',
        'Seats Booked': item.SeatsBooked || '—',
        'Event Title': item.Tittle || '—',
        'Event Date & Time': item.EventDateTime || '—',
        'Event Type': item.EventType || '—',
        'Location': item.location || '—',
        'Plan Type': item.TicketType || '—'
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const colWidths = [
        { wch: 8 },  // S.No.
        { wch: 20 }, // Customer Name
        { wch: 15 }, // Auth Login
        { wch: 15 }, // Ticket Number
        { wch: 15 }, // Booking Date
        { wch: 12 }, // Total Price
        { wch: 12 }, // Seats Booked
        { wch: 25 }, // Event Title
        { wch: 20 }, // Event Date & Time
        { wch: 15 }, // Event Type
        { wch: 20 }, // Location
        { wch: 12 }  // Plan Type
      ];
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Event Bookings');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `Event_Bookings_${timestamp}.xlsx`;

      // Save the file
      XLSX.writeFile(wb, filename);
      
      toast.success(`Exported ${filteredData.length} records to Excel`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export data to Excel');
    }
  };

  // Alternative export function using native method (if you don't want to use xlsx)
  const handleExportToExcelNative = () => {
    try {
      if (!filteredData || filteredData.length === 0) {
        toast.warning("No data available to export");
        return;
      }

      // Prepare CSV data
      const headers = [
        'S.No.',
        'Customer Name',
        'Auth Login',
        'Ticket Number',
        'Booking Date',
        'Total Price',
        'Seats Booked',
        'Event Title',
        'Event Date & Time',
        'Event Type',
        'Location',
        'Plan Type'
      ];

      const csvData = filteredData.map((item, index) => [
        index + 1,
        `"${(item.Name || '—').replace(/"/g, '""')}"`,
        `"${(item.AuthLogin || '—').replace(/"/g, '""')}"`,
        `"${(item.TicketNumber || '—').replace(/"/g, '""')}"`,
        `"${(item.CreatedDate || '—').replace(/"/g, '""')}"`,
        `"${item.Price ? `$${typeof item.Price === 'number' ? item.Price.toLocaleString() : item.Price}` : '—'}"`,
        `"${item.SeatsBooked || '—'}"`,
        `"${(item.Tittle || '—').replace(/"/g, '""')}"`,
        `"${(item.EventDateTime || '—').replace(/"/g, '""')}"`,
        `"${(item.EventType || '—').replace(/"/g, '""')}"`,
        `"${(item.location || '—').replace(/"/g, '""')}"`,
        `"${(item.TicketType || '—').replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `Event_Bookings_${timestamp}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exported ${filteredData.length} records to CSV`);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast.error('Failed to export data');
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Event Bookings</h1>
          </div>
        </div>
      </div>

      {/* Search and Export Section */}
      <div className="px-4 py-2 ">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          {/* Total Count Display */}
          <div className="text-sm font-medium text-gray-700">
            Total Events: <span className="font-bold text-blue-600">{filteredData.length}</span>
          </div>
          
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search Box */}
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Export to Excel Button */}
            <button
              onClick={handleExportToExcel}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export to Excel
            </button>

            {/* Alternative CSV Export Button (Optional) */}
            {/* <button
              onClick={handleExportToExcelNative}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export to CSV
            </button> */}
          </div>
        </div>
      </div>

      {/* Rest of your component remains the same */}
      {/* Booking Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 text-white border-b border-gray-200 rounded-t-lg bg-gradient-to-r from-blue-600 to-blue-700">
              <h2 className="text-xl font-bold">Booking Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 text-white transition-colors rounded-full hover:bg-blue-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-900 border-b">Customer Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Customer Name</label>
                    <p className="mt-1 font-medium text-gray-900">{selectedBooking.Name || "—"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Auth Login</label>
                    <p className="mt-1 font-mono text-gray-900">{selectedBooking.AuthLogin || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div>
                <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-900 border-b">Booking Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Ticket Number</label>
                    <p className="mt-1 font-medium text-gray-900">{selectedBooking.TicketNumber || "—"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Booking Date</label>
                    <p className="mt-1 text-gray-900">{selectedBooking.CreatedDate || "—"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Seats Booked</label>
                    <p className="mt-1 text-gray-900">{selectedBooking.SeatsBooked || "—"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Plan Type</label>
                    <span className={`inline-flex px-3 py-1 mt-1 text-xs font-semibold rounded-full ${
                      selectedBooking.TicketType?.toLowerCase() === 'vip' 
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : selectedBooking.TicketType?.toLowerCase() === 'premium'
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : selectedBooking.TicketType?.toLowerCase() === 'standard'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {selectedBooking.TicketType || "—"}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Plan Price</label>
                    <p className="mt-1 font-medium text-gray-900">
                      {selectedBooking.PlanPrice ? `₹${typeof selectedBooking.PlanPrice === 'number' ? selectedBooking.PlanPrice.toLocaleString() : selectedBooking.PlanPrice}` : "—"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Total Price</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {selectedBooking.Price ? `₹${typeof selectedBooking.Price === 'number' ? selectedBooking.Price.toLocaleString() : selectedBooking.Price}` : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Event Information */}
              <div>
                <h3 className="pb-2 mb-4 text-lg font-semibold text-gray-900 border-b">Event Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Event Title</label>
                    <p className="mt-1 font-medium text-gray-900">{selectedBooking.Tittle || "—"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Event Date & Time</label>
                    <p className="mt-1 text-gray-900">{selectedBooking.EventDateTime || "—"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Event Type</label>
                    <p className="mt-1 text-gray-900">{selectedBooking.EventType || "—"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Location</label>
                    <p className="mt-1 text-gray-900">{selectedBooking.location || "—"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowDetails(false)}
                className="px-6 py-2 text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4">
        {/* ... (rest of your table and pagination code remains exactly the same) */}
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <p className="text-sm text-gray-600">Loading bookings...</p>
            </div>
          </div>
        ) : filteredData.length > 0 ? (
          <>
            <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column.key}
                          className="px-3 py-2 text-xs font-semibold tracking-wider text-center text-white uppercase"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRows.map((row, index) => (
                      <tr 
                        key={row.Id || index} 
                        className="transition-colors hover:bg-blue-50"
                      >
                        {columns.map((column) => (
                          <td
                            key={column.key}
                            className="px-3 py-2 text-sm text-center text-gray-900 whitespace-nowrap"
                          >
                            {column.render ? column.render(row[column.key], row, index) : row[column.key] || "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="space-y-3 md:hidden">
                {currentRows.map((row, index) => (
                  <div 
                    key={row.TicketNumber || index} 
                    className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                  >
                    <div className="space-y-2">
                      {columns.map((column) => (
                        <div key={column.key} className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">{column.label}:</span>
                          <span className="text-sm text-right text-gray-900">
                            {column.render ? column.render(row[column.key], row, index) : row[column.key] || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 mt-3 bg-white border-t border-gray-200">
              {/* Left side - Rows per page */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {[5, 10, 25, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Center - Page info */}
              <div className="text-sm text-gray-700">
                <span>
                  {((currentPage - 1) * rowsPerPage) + 1}-{Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length}
                </span>
              </div>
              
              {/* Right side - Pagination buttons */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-1 rounded ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg font-bold">&lt;</span>
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-1 rounded ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg font-bold">&gt;</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="mt-2 text-sm font-medium text-gray-500">No bookings found</p>
            <p className="mt-1 text-xs text-gray-400">
              {searchTerm ? "Try adjusting your search terms" : "There are no event bookings to display"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-3 py-1 mt-2 text-xs text-blue-600 hover:text-blue-800"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventBooking;