'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAllTickets,
  addTicketReply,
  getAllTicketByTicketId,
  deleteTicket,
  clearTicketDetails,
} from '@/app/redux/ticketSlice'
import Table from '@/app/common/datatable'
import { Columns } from '@/app/constants/ticket-constant'
import { toast } from 'react-toastify'

const NewTicket = () => {
  const dispatch = useDispatch()
  const { tickets, error, ticketDetails } = useSelector((state) => state.ticket)

  const [showReplyBox, setShowReplyBox] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [replyImage, setReplyImage] = useState(null)
  const [replyLoading, setReplyLoading] = useState(false)
  const [replySuccess, setReplySuccess] = useState('')
  const [replyError, setReplyError] = useState('')
  const [lastReply, setLastReply] = useState(null)
  const [closeLoading, setCloseLoading] = useState(false)
  const [closeError, setCloseError] = useState('')
  const [closeSuccess, setCloseSuccess] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  useEffect(() => {
    const didFetch = window.__didFetchTickets
    if (didFetch) return
    window.__didFetchTickets = true
    dispatch(fetchAllTickets()).unwrap()
  }, [dispatch])

  useEffect(() => {
    setShowReplyBox(false)
    setLastReply(null)
    setReplyMessage('')
    setReplyImage(null)
    setReplySuccess('')
    setReplyError('')
  }, [ticketDetails])

  const tableColumns = Columns.map((col) =>
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
            render: (value, row) =>
              row.Status === 1 ? (
                <button
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation() // Prevent row click
                    dispatch(getAllTicketByTicketId(row.TicketId))
                    setShowPopup(true)
                  }}
                >
                  Reply
                </button>
              ) : null,
          }
        : { key: col.id, label: col.label },
  )

  const handleRowClick = (row) => {
    dispatch(getAllTicketByTicketId(row.TicketId)).unwrap()
  }

  const replies = ticketDetails?.replies || []

  const handleReplySubmit = async (ticket) => {
    if (!replyMessage.trim()) {
      setReplyError('Message is required')
      toast.error('Message is required')
      return
    }
    setReplyError('')
    setReplySuccess('')
    setReplyLoading(true)
    try {
      const formData = new FormData()
      formData.append('TicketId', ticket.TicketId)
      formData.append('Message', replyMessage)
      formData.append('CreatedBy', ticket.TicketId) // Ensure correct field
      formData.append('Status', 0) // Include status, assuming 1 for open/active reply
      formData.append('ImagePath', ticket.ImagePath)

      const result = await dispatch(addTicketReply(formData)).unwrap()
      if (result?.statusCode === 200) {
        await dispatch(getAllTicketByTicketId(ticket.TicketId))
        await dispatch(fetchAllTickets())
        setReplyMessage('')
        setReplyImage(null)
        setShowReplyBox(false)
      } else {
        toast.error('Failed to send reply')
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to send reply')
    } finally {
      setReplyLoading(false)
    }
  }

  const handleCloseTicket = async (ticket) => {
    if (!ticket) return
    setCloseLoading(true)
    setCloseError('')
    setCloseSuccess('')
    try {
      const result = await dispatch(deleteTicket(ticket.TicketId)).unwrap()
      if (result && result.statusCode === 200) {
        setCloseSuccess('Ticket closed successfully!')
        await dispatch(fetchAllTickets())
        toast.success('Ticket closed successfully!')
        setShowPopup(false)
        dispatch(clearTicketDetails())
      } else {
        setCloseError('Failed to close ticket.')
        toast.error('Failed to close ticket.')
      }
    } catch (err) {
      setCloseError(err?.message || 'Failed to close ticket.')
      toast.error(err?.message || 'Failed to close ticket.')
    } finally {
      setCloseLoading(false)
    }
  }
  const allMessages = [
    ...(ticketDetails?.replies?.length
      ? ticketDetails?.replies.map((item, index) => ({
          id: index,
          message: item.Message,
          timestamp: item.ReplyDate,
          Name: item.Name,
          Status: item.Status,
          user: item.appUserId ? 'User' : 'Admin',
        }))
      : []),
    ...replies,
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  return (
    <div className="p-5 mx-auto mt-0 border border-gray-200 shadow-2xl max-w-7xl bg-gradient-to-br from-blue-50 to-white rounded-3xl">
      {/* <h1 className="mb-4 text-3xl font-semibold text-gray-700">All Tickets</h1> */}
      <Table
        columns={tableColumns}
        data={tickets
          ?.filter((ticket) => ticket.Status === 1)
          .map((ticket, index) => ({
            ...ticket,
            sno: index + 1,
            image: ticket.ImagePath,
          }))}
        title="Tickets List"
        onRowClick={handleRowClick}
      />
      {showPopup &&
        ticketDetails?.ticket &&
        ticketDetails.ticket.map((ticket, index) => (
          <div
            key={index}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-2"
          >
            <div className="relative w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50">
                <h2 className="text-base font-semibold text-gray-800">
                  Ticket Details
                </h2>
                <button
                  onClick={() => {
                    dispatch(clearTicketDetails())
                    setShowPopup(false)
                  }}
                  className="text-gray-500 hover:text-red-500 text-xl leading-none font-bold"
                >
                  &times;
                </button>
              </div>

              {/* Ticket Info */}
              <div className="p-3">
                <div className="grid grid-cols-2 gap-y-1.5">
                  <div>
                    <p className="text-[10px] text-gray-500">User ID</p>
                    <p className="text-xs font-semibold text-gray-800">
                      {ticket.UserID || '-'}
                    </p>
                  </div>
                  <div className=" flex flex-col items-end">
                    <p className="text-[10px] text-gray-500">Date</p>
                    <p className="text-xs font-semibold text-gray-800">
                      {ticket.CreatedDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-500">Name</p>
                    <p className="text-xs font-semibold text-gray-800">
                      {ticket.UserName || '-'}
                    </p>
                  </div>
                  <div className=" flex flex-col items-end">
                    <p className="text-[10px] text-gray-500">Type</p>
                    <p className="text-xs font-semibold text-gray-800">
                      {ticket.TicketType || '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-500">Subject</p>
                    <p className="text-xs font-semibold text-gray-800">
                      {ticket.Subject || '-'}
                    </p>
                  </div>
                  <div className=" flex flex-col items-end">
                    <p className="text-[10px] text-gray-500">Status</p>
                    <p
                      className={`flex items-center gap-1 text-xs font-semibold ${ticket.StatusType === 'Open' ? 'text-green-600' : 'text-red-600'}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${ticket.StatusType === 'Open' ? 'bg-green-500' : 'bg-red-500'}`}
                      ></span>
                      {ticket.StatusType}
                    </p>
                  </div>
                </div>

                {ticket.ImagePath && (
                  <div className="mt-2">
                    <img
                      src={ticket.ImagePath}
                      alt="Ticket"
                      className="object-cover w-20 h-20 rounded"
                    />
                  </div>
                )}
              </div>

              {/* Conversation Section */}
              <div className="flex-1 px-3 pb-2">
                <h3 className="font-semibold text-gray-700 text-xs mb-2">
                  Conversation
                </h3>
                <div className="h-[28vh] overflow-y-auto space-y-2 p-2 bg-gray-100 dark:bg-[#0b141a] rounded-md scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
                  {allMessages
                    ?.filter(
                      (msg) => msg && msg.message && msg.message.trim() !== '',
                    )
                    .map((message, index) => {
                      const admin = message.Status === 0
                      return (
                        <div
                          key={message.id || `${message.timestamp}-${index}`}
                          className={`flex w-full ${admin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] p-2 rounded-xl text-[12px] leading-snug ${
                              admin
                                ? 'bg-[#dcf8c6] text-black rounded-br-none'
                                : 'bg-white dark:bg-[#202c33] text-black dark:text-gray-100 rounded-bl-none'
                            }`}
                          >
                            {!admin && (
                              <p className="font-semibold text-[11px] text-green-600 dark:text-green-400 mb-0.5">
                                {message.Name || 'Admin'}
                              </p>
                            )}
                            <p
                              className="text-[12px]"
                              dangerouslySetInnerHTML={{
                                __html: message.message,
                              }}
                            ></p>
                            <span
                              className={`text-[10px] text-gray-500 mt-0.5 block ${
                                admin ? 'text-right' : 'text-left'
                              }`}
                            >
                              {message.timestamp || ''}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>

              {/* Reply Section */}
              <div className="border-t bg-white p-2.5">
                <h3 className="font-semibold text-gray-700 text-xs mb-1.5">
                  Activity
                </h3>
                <div>
                  <textarea
                    type="text"
                    value={replyMessage}
                    className="w-full p-1 border rounded text-[12px] focus:outline-none dark:text-black dark:border-gray-600"
                    rows={2}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    required
                  />
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleReplySubmit(ticket)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs"
                  >
                    Send Reply
                  </button>
                  <button
                    onClick={() => handleCloseTicket(ticket)}
                    disabled={closeLoading}
                    className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-60"
                  >
                    {closeLoading ? 'Closing...' : 'Close Ticket'}
                  </button>
                </div>

                {closeError && (
                  <div className="mt-1 text-red-500 text-xs">{closeError}</div>
                )}
                {closeSuccess && (
                  <div className="mt-1 text-green-600 text-xs">
                    {closeSuccess}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

export default NewTicket
