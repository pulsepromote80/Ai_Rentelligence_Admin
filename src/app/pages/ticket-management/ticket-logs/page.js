
"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClosedTickets, getAllTicketByTicketId, clearTicketDetails } from '@/app/redux/ticketSlice';
import Table from '@/app/common/datatable';
import { Columns } from '@/app/constants/ticket-constant';

const TicketLogs = () => {
  const dispatch = useDispatch();
  const { closedTickets, ticketDetails } = useSelector((state) => state.ticket);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const didFetch = window.__didFetchTicketsLogs;
    if (didFetch) return;
    window.__didFetchTicketsLogs = true;
    dispatch(fetchClosedTickets());
  }, [dispatch]);

  const tableColumns = Columns?.map(col =>
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
            <button
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation(); // Prevent row click
                dispatch(getAllTicketByTicketId(row.TicketId));
                setShowPopup(true);
              }}
            >
              Details
            </button>
          )
        }
        : { key: col.id, label: col.label }
  );

  const handleRowClick = (row) => {
    dispatch(getAllTicketByTicketId(row.TicketId));
  };

  const replies = ticketDetails?.replies || [];

  return (
 <div className="p-5 mx-auto mt-0 border border-gray-200 shadow-2xl max-w-7xl bg-gradient-to-br from-blue-50 to-white rounded-3xl">
      <Table
        columns={tableColumns}
        data={closedTickets?.map((ticket, index) => ({ ...ticket, sno: index + 1 }))}
        title="Closed Tickets List"
        onRowClick={handleRowClick}
      />

      {showPopup && ticketDetails?.ticket && ticketDetails?.ticket?.map((ticket, index) => (
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
              {/* Status Display */}
              <div className="mb-4">
                <span className="font-bold text-black uppercase text-l">Status :</span>
                <span className={`font-semibold ml-2 ${ticket.Status === 1 ? 'text-green-600' : 'text-red-600'}`}>
                  {ticket.Status === 1 ? 'Open' : 'Closed'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col">
                  <span className="font-bold text-black uppercase text-l">UserId </span>
                  <span className="text-gray-800 break-all text-md">{ticket.UserID || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-black uppercase text-l">Name </span>
                  <span className="text-gray-800 break-all text-md">{ticket.UserName || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-black uppercase text-l">Subject </span>
                  <span className="text-gray-800 break-all text-md">{ticket.Subject || '-'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-black uppercase text-l">Type </span>
                  <span className="text-gray-800 break-all text-md">{ticket.Type || 'General'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-black uppercase text-l">Date </span>
                  <span className="text-gray-800 break-all text-md">{ticket.CreatedDate}</span>
                </div>
              </div>

              {/* Image Display Below Grid */}
              <div className="mt-4">
                <span className="font-bold text-black uppercase text-l">Image </span>
                {ticket.ImagePath ? (
                  <img src={ticket.ImagePath} alt="Ticket" className="object-cover w-20 h-20 mt-1 border rounded" />
                ) : (
                  <span className="text-base text-gray-800">-</span>
                )}
              </div>

              {/* Conversation Box */}
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-4">Conversation:</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto space-y-4">
                  {/* Replies */}
                  {replies?.map((reply, idx) => (
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
                </div>
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketLogs;