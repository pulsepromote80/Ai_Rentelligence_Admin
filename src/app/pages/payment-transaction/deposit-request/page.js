"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFundRequestReportAdmin, updateFundRequestStatusAdmin } from '@/app/redux/fundManagerSlice';

const DepositRequest = () => {
  const dispatch = useDispatch();
  const { fundRequestData, loading, error } = useSelector((state) => state.fundManager);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedAuthLoginId, setSelectedAuthLoginId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
 

  useEffect(() => {
    dispatch(getAllFundRequestReportAdmin());
  }, [dispatch]);

  const allRows = (fundRequestData?.unApproveFundRequest || []).concat(fundRequestData?.approvedFundRequest || []);
  const paginatedRows = allRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(allRows.length / rowsPerPage);
  
  const handleUnApprovedClick = (authLoginId) => {
    setSelectedAuthLoginId(authLoginId);
    setPopupOpen(true);
  };

  const handleApprove = async () => {
    if (selectedAuthLoginId) {
      await dispatch(updateFundRequestStatusAdmin(selectedAuthLoginId));
      setPopupOpen(false);
      setSelectedAuthLoginId(null);
      dispatch(getAllFundRequestReportAdmin());
    }
  };

  const handleCancel = () => {
    setPopupOpen(false);
    setSelectedAuthLoginId(null);
  };

  const renderRows = (rows) =>
    rows.map((row, idx) => (
      <tr key={idx} className="border-b hover:bg-gray-50">
        <td className="px-3 py-2 text-sm">{row.AuthLogin || '-'}</td>
        <td className="px-3 py-2 text-sm">{row.Amount}</td>
        <td className="px-3 py-2 text-sm">{row.PaymentDate}</td>
        
        <td className="px-3 py-2 text-sm">
          <button
            className={`px-3 py-1 rounded text-white font-semibold ${row.Rf_Status === 'Approved' ? 'bg-green-500 hover:bg-green-600 cursor-not-allowed' : 'bg-gray-400 cursor-not-allowed'}`}
            disabled={row.Rf_Status !== 'Approved'}
          >
            {row.Rf_Status === 'Approved' ? 'Approved' : 'UnApproved'}
          </button>
        </td>
      </tr>
    ));

  const unApproveFundRequest = fundRequestData?.unApproveFundRequest || [];
  const approvedFundRequest = fundRequestData?.approvedFundRequest || [];

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
                <th className="px-4 py-2 text-sm font-semibold text-center border">Payment Date</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-lg text-center text-gray-400">No Data Found</td>
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
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.PaymentDate}</td>
                    <td className="px-4 py-2 text-sm text-center border">
                      <button
                        className={`px-3 py-1 rounded text-white font-semibold ${row.Rf_Status === 'Approved' ? 'bg-green-500 hover:bg-green-600 cursor-not-allowed' : 'bg-red-500 hover:bg-red-500'}`}
                        disabled={row.Rf_Status === 'Approved'}
                        onClick={row.Rf_Status !== 'Approved' ? () => handleUnApprovedClick(row.AuthLogin) : undefined}
                      >
                        {row.Rf_Status === 'Approved' ? 'Approved' : 'UnApproved'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {allRows.length > rowsPerPage && (
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

      {/* Popup Modal */}
      {popupOpen && (
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
    </div>
  );
};

export default DepositRequest;