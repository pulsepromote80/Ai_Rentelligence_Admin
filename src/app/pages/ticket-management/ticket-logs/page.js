'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchClosedTickets,
  getAllTicketByTicketId,
  clearTicketDetails,
} from '@/app/redux/ticketSlice'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/ticket-constant'

const TicketLogs = () => {
  const dispatch = useDispatch()
  const { closedTickets, ticketDetails } = useSelector((state) => state.ticket)
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    const didFetch = window.__didFetchTicketsLogs
    if (didFetch) return
    window.__didFetchTicketsLogs = true
    dispatch(fetchClosedTickets())
  }, [dispatch])

  const tableColumns = Columns?.map((col) =>
    col.id === 'Status'
      ? {
          key: col.id,
          label: col.label,
          render: (value) => (
            <span
              className={
                value === 1
                  ? 'text-green-600 font-semibold'
                  : 'text-red-600 font-semibold'
              }
            >
              {value === 1 ? 'Open' : 'Closed'}
            </span>
          ),
        }
      : col.id === 'action'
        ? {
            key: col.id,
            label: col.label,
            render: (value, row) => (
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation() // Prevent row click
                  dispatch(getAllTicketByTicketId(row.TicketId))
                  setShowPopup(true)
                }}
              >
                Details
              </button>
            ),
          }
        : { key: col.id, label: col.label },
  )

  const handleRowClick = (row) => {
    dispatch(getAllTicketByTicketId(row.TicketId))
  }

  const replies = ticketDetails?.replies || []

  return (
    <div className="p-5 mx-auto mt-0 border border-gray-200 shadow-2xl max-w-7xl bg-gradient-to-br from-blue-50 to-white rounded-3xl">
      <Table
        columns={tableColumns}
        data={closedTickets?.map((ticket, index) => ({
          ...ticket,
          sno: index + 1,
        }))}
        title="Closed Tickets List"
        onRowClick={handleRowClick}
      />

      {showPopup &&
        ticketDetails?.ticket &&
        ticketDetails?.ticket?.map((ticket, index) => (
          <div
            key={index}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4"
          >
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                  Ticket Details
                </h2>
                <button
                  className="text-2xl font-bold text-gray-400 hover:text-red-500 focus:outline-none"
                  onClick={() => {
                    dispatch(clearTicketDetails())
                    setShowPopup(false)
                  }}
                  aria-label="Close Ticket Details"
                >
                  &times;
                </button>
              </div>

              {/* Content */}
              <div className="px-3 py-2 overflow-y-auto flex-1 text-[13px] sm:text-sm">
                {/* Ticket Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700 uppercase text-xs">
                      UserId
                    </span>
                    <span className="text-gray-800 break-all text-xs font-semibold ">
                      {ticket.UserID || '-'}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-semibold text-gray-700 uppercase text-xs">
                      Name
                    </span>
                    <span className="text-gray-800 break-all text-xs font-semibold ">
                      {ticket.UserName || '-'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700 uppercase text-xs">
                      Subject
                    </span>
                    <span className="text-gray-800 break-all text-xs font-semibold ">
                      {ticket.Subject || '-'}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-semibold text-gray-700 uppercase text-xs">
                      Type
                    </span>
                    <span className="text-gray-800 break-all text-xs font-semibold ">
                      {ticket.TicketType || 'General'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700 uppercase text-xs">
                      Date
                    </span>
                    <span className="text-gray-800 break-all text-xs font-semibold ">
                      {ticket.CreatedDate}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-xs">Status</p>
                    <span
                      className={`inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        ticket.StatusType?.toLowerCase() === 'open'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          ticket.StatusType?.toLowerCase() === 'open'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      ></span>
                      {ticket.StatusType || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Image */}
                {ticket.ImagePath && (
                  <div className="mt-3">
                    <span className="font-semibold text-gray-700 uppercase text-xs">
                      Image
                    </span>
                    <img
                      src={ticket.ImagePath}
                      alt="Ticket"
                      className="object-cover w-16 h-16 mt-1 border rounded-lg"
                    />
                  </div>
                )}

                {/* Conversation */}
                <div className="mt-3">
                  <h3 className="font-semibold text-gray-700 text-sm mb-2">
                    Conversation:
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 max-h-60 overflow-y-auto space-y-3">
                    {replies?.map((reply, idx) =>
                      reply.Status === 1 ? (
                        // User Reply
                        <div key={idx} className="flex items-start space-x-2">
                          <div className="bg-white p-3 rounded-2xl rounded-tl-md shadow-sm max-w-xs lg:max-w-md">
                            <div className="text-[11px] text-green-600 font-medium mb-1">
                              {reply?.Name || "User"}
                            </div>
                            <div
                              className="text-gray-800 text-[13px]"
                              dangerouslySetInnerHTML={{
                                __html: reply.Message,
                              }}
                            />
                            <div className="text-[10px] text-gray-500 mt-1">
                              {reply.ReplyDate}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Admin Reply
                        <div
                          key={idx}
                          className="flex items-start justify-end space-x-2"
                        >
                          <div className="bg-blue-500 p-3 rounded-2xl rounded-tr-md shadow-sm max-w-xs lg:max-w-md">
                            <div
                              className="text-white text-[13px]"
                              dangerouslySetInnerHTML={{
                                __html: reply.Message,
                              }}
                            />
                            <div className="text-[10px] text-blue-200 mt-1">
                              {reply.ReplyDate}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default TicketLogs
