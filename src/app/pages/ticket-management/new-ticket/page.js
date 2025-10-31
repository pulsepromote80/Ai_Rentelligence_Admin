"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTickets, addTicketReply, getAllTicketByTicketId, deleteTicket, clearTicketDetails } from '@/app/redux/ticketSlice';
import Table from '@/app/common/datatable';
import { Columns } from '@/app/constants/ticket-constant';
import { toast } from 'react-toastify';
import Tiptap from '@/app/common/rich-text-editor';


const NewTicket = () => {
  const dispatch = useDispatch();
  const { tickets, error, ticketDetails } = useSelector((state) => state.ticket);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyImage, setReplyImage] = useState(null);
  const [replyLoading, setReplyLoading] = useState(false);
  const [replySuccess, setReplySuccess] = useState('');
  const [replyError, setReplyError] = useState('');
  const [lastReply, setLastReply] = useState(null);
  const [closeLoading, setCloseLoading] = useState(false);
  const [closeError, setCloseError] = useState('');
  const [closeSuccess, setCloseSuccess] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const didFetch = window.__didFetchTickets;
    if (didFetch) return;
    window.__didFetchTickets = true;
    dispatch(fetchAllTickets())
      .unwrap();
  }, [dispatch]);

  useEffect(() => {
    setShowReplyBox(false);
    setLastReply(null);
    setReplyMessage('');
    setReplyImage(null);
    setReplySuccess('');
    setReplyError('');
  }, [ticketDetails]);

  const tableColumns = Columns.map(col =>
    col.id === 'Status'
      ? {
        key: col.id,
        label: col.label,
        render: (value) => (
          <span className={value === 1 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
            {value === 1 ? 'Open' : 'Closed'}
          </span>
        )
      }
      : col.id === 'action'
        ? {
          key: col.id,
          label: col.label,
          render: (value, row) => (
            row.Status === 1 ? (
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row click
                  dispatch(getAllTicketByTicketId(row.TicketId));
                  setShowPopup(true);
                }}
              >
                Reply
              </button>
            ) : null
          )
        }
        : { key: col.id, label: col.label }
  );

  const handleRowClick = (row) => {
    dispatch(getAllTicketByTicketId(row.TicketId))
      .unwrap()
  };

  const replies = ticketDetails?.replies || [];

  const handleReplySubmit = async (ticket) => {

    if (!replyMessage.trim()) {
      setReplyError('Message is required');
      toast.error('Message is required');
      return;
    }
    setReplyError('');
    setReplySuccess('');
    setReplyLoading(true);
    try {
      const formData = new FormData();
      formData.append('TicketId', ticket.TicketId);
      formData.append('Message', replyMessage);
      formData.append('CreatedBy', ticket.TicketId); // Ensure correct field
      formData.append('Status', 0); // Include status, assuming 1 for open/active reply
      formData.append('ImagePath', ticket.ImagePath);

      const result = await dispatch(addTicketReply(formData)).unwrap();
      if (result?.statusCode === 200) {
        await dispatch(getAllTicketByTicketId(ticket.TicketId));
        await dispatch(fetchAllTickets());
        setReplyMessage('');
        setReplyImage(null);
        setShowReplyBox(false);
      } else {
        toast.error('Failed to send reply');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleCloseTicket = async (ticket) => {
    if (!ticket) return;
    setCloseLoading(true);
    setCloseError('');
    setCloseSuccess('');
    try {
      const result = await dispatch(deleteTicket(ticket.TicketId)).unwrap();
      if (result && (result.statusCode === 200)) {
        setCloseSuccess('Ticket closed successfully!');
        await dispatch(fetchAllTickets());
        toast.success('Ticket closed successfully!');
        setShowPopup(false);
        dispatch(clearTicketDetails());
      } else {
        setCloseError('Failed to close ticket.');
        toast.error('Failed to close ticket.');
      }
    } catch (err) {
      setCloseError(err?.message || 'Failed to close ticket.');
      toast.error(err?.message || 'Failed to close ticket.');
    } finally {
      setCloseLoading(false);
    }
  };

  return (
    <div className="p-5 mx-auto mt-0 border border-gray-200 shadow-2xl max-w-7xl bg-gradient-to-br from-blue-50 to-white rounded-3xl">
      {/* <h1 className="mb-4 text-3xl font-semibold text-gray-700">All Tickets</h1> */}
      <Table
        columns={tableColumns}
        data={tickets?.filter(ticket => ticket.Status === 1).map((ticket, index) => ({ ...ticket, sno: index + 1, image: ticket.ImagePath }))}
        title="Tickets List"
        onRowClick={handleRowClick}
      />


      {showPopup && ticketDetails?.ticket && ticketDetails.ticket.map((ticket, index) => (
        <div key={index} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-xl bg-white rounded-lg shadow-lg max-h-[90vh] z-[10000] overflow-hidden flex flex-col">

            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-700">Ticket Details</h2>
              <button
                className="text-3xl font-bold text-gray-400 hover:text-red-500 focus:outline-none"
                onClick={() => {
                  dispatch(clearTicketDetails());
                  setShowPopup(false);
                }}
                aria-label="Close Ticket Details"
              >
                &times;
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col">
                  <span className="font-bold text-black uppercase text-l">UserId :</span>
                  <span className="text-gray-800 break-all text-md">{ticket.UserID || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-black uppercase text-l">Name :</span>
                  <span className="text-gray-800 break-all text-md">{ticket.UserName || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-black uppercase text-l">Subject :</span>
                  <span className="text-gray-800 break-all text-md">{ticket.Subject || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-black uppercase text-l">Image :</span>
                  {ticket.ImagePath ? (
                    <img src={ticket.ImagePath} alt="Ticket" className="object-cover w-20 h-20 mt-1 border rounded" />
                  ) : (
                    <span className="text-base text-gray-800">-</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-black uppercase text-l">Date :</span>
                  <span className="text-gray-800 break-all text-md">{ticket.CreatedDate}</span>
                </div>
              </div>


              {/* Conversation Box */}
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-4">Conversation:</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto space-y-4">
                  {/* Replies */}
                  {replies.map((reply, idx) => (
                    reply.Status === 1 ? (
                      // User Reply
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="bg-white p-4 rounded-2xl rounded-tl-md shadow-sm max-w-xs lg:max-w-md">
                          <div className="text-xs text-green-600 font-medium mb-1">User</div>
                          <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: reply.Message }} />
                          <div className="text-xs text-gray-500 mb-2">{reply.ReplyDate}</div>
                        </div>
                      </div>
                    ) : (
                      // Admin Reply
                      <div key={idx} className="flex items-start justify-end space-x-3">
                        <div className="bg-blue-500 p-4 rounded-2xl rounded-tr-md shadow-sm max-w-xs lg:max-w-md">
                          <div className="text-white" dangerouslySetInnerHTML={{ __html: reply.Message }} />
                          <div className="text-xs text-blue-200 mb-2">{reply.ReplyDate}</div>
                        </div>
                      </div>
                    )
                  ))}

                  {/* Last Reply if any */}
                  {lastReply && (
                    <div className="flex items-start justify-end space-x-3">
                      <div className="bg-blue-500 p-4 rounded-2xl rounded-tr-md shadow-sm max-w-xs lg:max-w-md">
                        <div className="text-xs text-blue-100 font-medium mb-1">Admin</div>
                        {lastReply.ImagePath && <img src={lastReply.ImagePath} alt="Reply" className="w-20 h-20 rounded-lg mb-2" />}
                        <div className="text-white">{lastReply.Message}</div>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z" /></svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Box */}
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-4">Activity:</h3>
                <input
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  type="text"
                  className="border rounded px-2 py-1 w-full mb-4"
                  placeholder="Enter your reply..."
                />
                <div className="flex gap-4">
                  <button
                    className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                    onClick={() => handleReplySubmit(ticket)}
                  >
                    Send Reply
                  </button>
                  <button className="px-6 py-2 text-white bg-gray-600 rounded hover:bg-gray-700 focus:outline-none disabled:opacity-60" onClick={() => handleCloseTicket(ticket)} disabled={closeLoading}>
                    {closeLoading ? 'Closing...' : 'Close'}
                  </button>
                </div>
                {closeError && <div className="mt-2 text-red-500">{closeError}</div>}
                {closeSuccess && <div className="mt-2 text-green-600">{closeSuccess}</div>}

              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewTicket;