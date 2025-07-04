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

  useEffect(() => {
    dispatch(fetchAllTickets())
      .unwrap()
      .then(() => {
        toast.success('Tickets fetched successfully!');
      })
      .catch((err) => {
        toast.error(err?.message || 'Failed to load tickets');
      });
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
    col.id === 'active'
      ? {
          key: col.id,
          label: col.label,
          render: (value) => (
            <span className={value ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
              {value ? 'Open' : 'Closed'}
            </span>
          )
        }
      : { key: col.id, label: col.label }
  );

  const handleRowClick = (row) => {
    dispatch(getAllTicketByTicketId(row.ticketId))
      .unwrap()
      .then(() => {
        toast.success('Ticket Details Fetched Successfully!');
      })
      .catch((err) => {
        toast.error(err?.message || 'Failed to load ticket details');
      });
  };

  const ticket = ticketDetails?.ticket;
  const replies = ticketDetails?.ticketReplies || [];

  const handleReplySubmit = async () => {
    if (!replyMessage) {
      setReplyError('Message is required');
      toast.error('Message is required');
      return;
    }
    setReplyError('');
    setReplySuccess('');
    setReplyLoading(true);
    try {
      const formData = new FormData();
      formData.append('ticketId', ticket.ticketId);
      formData.append('ticketType', ticket.ticketType);
      formData.append('message', replyMessage);
      formData.append('appUserId', ticket.appUserId);
      formData.append('createdBy', ticket.createdBy);
      formData.append('image', replyImage);
      const result = await dispatch(addTicketReply(formData)).unwrap();
      if (result?.statusCode === 200 ) {
        await dispatch(getAllTicketByTicketId(ticket.ticketId));
        toast.success('Reply sent successfully!');
      }
      setReplyMessage('');
      setReplyImage(null);
      setShowReplyBox(false);
    } catch (err) {
      toast.error(err?.message || 'Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };
  
  const handleCloseTicket = async () => {
    if (!ticket) return;
    setCloseLoading(true);
    setCloseError('');
    setCloseSuccess('');
    try {
      const result = await dispatch(deleteTicket({ ticketId: ticket.ticketId })).unwrap();
      if (result && (result.statusCode === 200)) {
        setCloseSuccess('Ticket closed successfully!');
        await dispatch(fetchAllTickets());
        toast.success('Ticket closed successfully!');
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
    <div className="p-4">
      {/* <h1 className="mb-4 text-3xl font-semibold text-gray-700">All Tickets</h1> */}
      <Table
        columns={tableColumns}
        data={tickets}
        title="Tickets List"
        onRowClick={handleRowClick}
      />

      
      {ticketDetails && ticket && (
        <div className="relative p-4 mt-6 border rounded-lg shadow bg-gray-50">
          
          <button
            className="absolute text-3xl font-bold text-gray-400 top-2 right-2 hover:text-red-500 focus:outline-none"
            onClick={() => dispatch(clearTicketDetails())}
            aria-label="Close Ticket Details"
          >
            &times;
          </button>
          <h2 className="mb-2 text-xl font-semibold text-gray-700">Ticket Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
             <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 uppercase">Name</span>
              <span className="text-base text-gray-800 break-all">{ticket.name || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 uppercase">Ticket Type</span>
              <span className="text-base text-gray-800 break-all">{ticket.ticketType || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 uppercase">Subject</span>
              <span className="text-base text-gray-800 break-all">{ticket.subject || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 uppercase">Message</span>
              <span className="text-base text-gray-800 break-all">{ticket.message || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 uppercase">Image</span>
              {ticket.image ? (
                <img src={ticket.image} alt="Ticket" className="object-cover w-20 h-20 mt-1 border rounded" />
              ) : (
                <span className="text-base text-gray-800">-</span>
              )}
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            {ticket.active && (
              <>
                <button
                  className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                  onClick={() => setShowReplyBox((prev) => !prev)}
                >
                  Reply
                </button>
                <button className="px-6 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none disabled:opacity-60" onClick={handleCloseTicket} disabled={closeLoading}>
                  {closeLoading ? 'Closing...' : 'Close'}
                </button>
              </>
            )}
          </div>
          {ticket.active && showReplyBox && (
            <div className="p-4 mt-6 bg-white border rounded-lg shadow-inner">
              
              <h3 className="mb-2 text-lg font-semibold text-gray-700">Reply to Ticket</h3>
              <Tiptap value={replyMessage} onChange={setReplyMessage} />
              <input
                type="file"
                accept="image/*"
                className="mt-3"
                onChange={e => setReplyImage(e.target.files[0])}
                disabled={replyLoading}
              />
              <button
                className="px-6 py-2 mt-3 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none disabled:opacity-60"
                onClick={handleReplySubmit}
                disabled={replyLoading}
              >
                {replyLoading ? 'Sending...' : 'Submit'}
              </button>
              {replyError && <div className="mt-2 text-red-500">{replyError}</div>}
              {replySuccess && <div className="mt-2 text-green-600">{replySuccess}</div>}
            </div>
          )}
          {/* Replies Section */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700">Replies:</h3>
            {replies.length === 0 && <div>No replies yet.</div>}
            {replies.map((reply, idx) => (
              <div key={idx} className="flex flex-col p-2 my-2 bg-gray-100 border rounded">
                <div className="flex items-center justify-end mb-1">
                  <svg className="w-4 h-4 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z" /></svg>
                  <span className="text-xs font-bold text-blue-700 uppercase">Admin</span>
                </div>
                <div className="flex items-center justify-between">
                  {reply.image && <img src={reply.image} alt="Reply" className="w-16 h-16" />}
                  <div className="flex-1 ml-4 text-right" dangerouslySetInnerHTML={{ __html: reply.message }} />
                </div>
              </div>
            ))}
            {lastReply && (
              <div className="flex items-center justify-between p-2 my-2 border rounded bg-blue-50">
                {lastReply.image && <img src={lastReply.image} alt="Reply" className="w-16 h-16" />}
                <div className="flex-1 ml-4 text-right">{lastReply.message}</div>
              </div>
            )}
          </div>
          {closeError && <div className="mt-2 text-red-500">{closeError}</div>}
          {closeSuccess && <div className="mt-2 text-green-600">{closeSuccess}</div>}
        </div>
      )}
    </div>
  );
};

export default NewTicket;