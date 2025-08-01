"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFundRequestReportAdmin, updateFundRequestStatusAdmin } from '@/app/redux/fundManagerSlice';
import { toast } from 'react-toastify';
import { FaCopy } from 'react-icons/fa';

const DepositRequest = () => {
  const dispatch = useDispatch();
  const { fundRequestData, loading, error } = useSelector((state) => state.fundManager);
  const [approvePopupOpen, setApprovePopupOpen] = useState(false);
  const [rejectPopupOpen, setRejectPopupOpen] = useState(false);
  const [selectedAuthLoginId, setSelectedAuthLoginId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [remark, setRemark] = useState('');
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(getAllFundRequestReportAdmin());
  }, [dispatch]);

  // Only show unapproved requests
  const unApprovedRows = fundRequestData?.unApproveFundRequest || [];
  const paginatedRows = unApprovedRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(unApprovedRows.length / rowsPerPage);
  
  const handleApproveClick = (authLoginId) => {
    setSelectedAuthLoginId(authLoginId);
    setApprovePopupOpen(true);
  };

  const handleRejectClick = (authLoginId) => {
    setSelectedAuthLoginId(authLoginId);
    setRejectPopupOpen(true);
  };

  const handleApprove = async () => {
    if (selectedAuthLoginId) {
      await dispatch(updateFundRequestStatusAdmin({
        authLoginId: selectedAuthLoginId,
        rfstatus: 1, // 1 for Approved
        remark: "Approved by admin"
      }));
      setApprovePopupOpen(false);
      setSelectedAuthLoginId(null);
      dispatch(getAllFundRequestReportAdmin());
    }
  };

 const handleReject = async () => {
  if (selectedAuthLoginId && remark.trim()) {
    try {
      await dispatch(updateFundRequestStatusAdmin({
        authLoginId: selectedAuthLoginId,
        rfstatus: 2, // 2 for Rejected
        remark: remark
      }));
      setRejectPopupOpen(false);
      setSelectedAuthLoginId(null);
      setRemark('');
      toast.success('Rejected Successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      dispatch(getAllFundRequestReportAdmin());
    } catch (error) {
      toast.error('Failed to reject request', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }
};

  const handleCancel = () => {
    setApprovePopupOpen(false);
    setRejectPopupOpen(false);
    setSelectedAuthLoginId(null);
    setRemark('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to Clipboard!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="max-w-6xl p-6 mx-auto mt-8 mb-10 bg-white border border-blue-100 shadow-2xl rounded-2xl">
      <h1 className="mb-4 text-2xl font-bold text-center text-gray-700">Deposit Request</h1>
      {loading ? (
        <div className="py-10 text-center">Loading...</div>
      ) : error ? (
        <div className="py-10 text-center text-red-500">{error}</div>
      ) : (
        <div className="mt-2 overflow-x-auto border border-blue-100 shadow-lg rounded-xl bg-white/90">
          <table className="min-w-full border border-gray-200 rounded-xl">
            <thead className="sticky top-0 z-10 text-white bg-blue-500">
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-center border rounded-tl-lg">Sr.No.</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">User ID</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">UserName</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Amount ($)</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Payment Method</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Transaction Hash</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Payment Date</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-lg text-center text-gray-400">No Unapproved Requests Found</td>
                </tr>
              ) : (
                paginatedRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-50 transition'}
                  >
                    <td className="px-4 py-2 text-sm font-medium text-center text-gray-700 border">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.AuthLogin || '-'}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.Name || '-'}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.Amount}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.PaymentMode}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      <div className="flex items-center justify-center gap-1 group ">
                        <span 
                          className="cursor-pointer"
                          title={row.RefrenceNo || '-'}
                        >
                          {row.RefrenceNo ? `${row.RefrenceNo.substring(0, 15)}...` : '-'}
                        </span>
                        {row.RefrenceNo && (
                          <button 
                            onClick={() => copyToClipboard(row.RefrenceNo)}
                            className="p-1 text-blue-500 hover:text-blue-700"
                            title="Copy to Clipboard"
                          >
                            <FaCopy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.PaymentDate}</td>
                    <td className="flex items-center px-4 py-2 space-x-2 text-sm text-center ">
                      <button
                        className="px-3 py-1 font-semibold text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => handleApproveClick(row.AuthLogin)}
                      >
                        UnApproved
                      </button>
                      <button
                        className="px-3 py-1 font-semibold text-white bg-yellow-500 rounded hover:bg-yellow-600"
                        onClick={() => handleRejectClick(row.AuthLogin)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {unApprovedRows.length > rowsPerPage && (
            <div className="flex items-center justify-center gap-2 py-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-800 hover:bg-blue-400'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Approve Popup Modal */}
      {approvePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-4 text-lg font-semibold text-gray-800">Do you want to approve AuthLoginID <span className="text-blue-600">{selectedAuthLoginId}</span>?</div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleApprove}
                className="px-4 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Popup Modal */}
      {rejectPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-4 text-lg font-semibold text-gray-800">Do you want to reject AuthLoginID <span className="text-blue-600">{selectedAuthLoginId}</span>?</div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Remark (Required)</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter rejection reason..."
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleReject}
                className={`px-4 py-2 font-semibold text-white rounded ${!remark.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                disabled={!remark.trim()}
              >
                Submit
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositRequest;