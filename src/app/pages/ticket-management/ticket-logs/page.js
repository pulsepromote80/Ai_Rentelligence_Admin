
"use client"
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTickets, getAllTicketByTicketId, clearTicketDetails } from '@/app/redux/ticketSlice';
import Table from '@/app/common/datatable';
import { Columns } from '@/app/constants/ticket-constant';

const TicketLogs = () => {
  const dispatch = useDispatch();
  const { tickets, ticketDetails } = useSelector((state) => state.ticket);

  useEffect(() => {
    const didFetch = window.__didFetchTicketsLogs;
    if (didFetch) return;
    window.__didFetchTicketsLogs = true;
    dispatch(fetchAllTickets());
  }, [dispatch]);

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
    dispatch(getAllTicketByTicketId(row.ticketId));
  };

  const ticket = ticketDetails?.ticket;
  const replies = ticketDetails?.ticketReplies || [];

  return (
    <div className="p-4">
      <Table
        columns={tableColumns}
        data={tickets?.filter(ticket => ticket.active === false)}
        title="Closed Tickets List"
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
              <span className="font-bold text-black uppercase text-l">Name :</span>
              <span className="text-gray-800 break-all text-md">{ticket.name || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-black uppercase text-l">Ticket Type :</span>
              <span className="text-gray-800 break-all text-md">{ticket.ticketType || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-black uppercase text-l">Subject :</span>
              <span className="text-gray-800 break-all text-md">{ticket.subject || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-black uppercase text-l">Message :</span>
              <span className="text-gray-800 break-all text-md">{ticket.message || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-black uppercase text-l">Image :</span>
              {ticket.image ? (
                <img src={ticket.image} alt="Ticket" className="object-cover w-20 h-20 mt-1 border rounded" />
              ) : (
                <span className="text-base text-gray-800">-</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-black uppercase text-l">Created Date :</span>
              <span className="text-gray-800 break-all text-md">{ticket.createdDate || '-'}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-black uppercase text-l">Created By :</span>
              <span className="text-gray-800 break-all text-md">{ticket.authLogin || ticket.createdBy || '-'}</span>
            </div>
          </div>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketLogs;