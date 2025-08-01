"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFundRequestReportAdmin } from '@/app/redux/fundManagerSlice';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';

const DepositHistory = () => {
  const dispatch = useDispatch();
  const { fundRequestData, loading, error } = useSelector((state) => state.fundManager);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(getAllFundRequestReportAdmin());
  }, [dispatch]);

  const approvedRows = fundRequestData?.approvedFundRequest || [];
  const rejectedRows = fundRequestData?.rejectedFundRequest || []; 
  const allRows = [...approvedRows, ...rejectedRows];
  
  const paginatedRows = allRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(allRows.length / rowsPerPage);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const truncateRefNo = (refNo) => {
    if (!refNo) return '-';
    return refNo.length > 15 ? `${refNo.substring(0, 15)}...` : refNo;
  };

  return (
    <div className="max-w-6xl p-6 mx-auto mt-8 mb-10 bg-white border border-blue-100 shadow-2xl rounded-2xl">
      <h1 className="mb-4 text-2xl font-bold text-center text-gray-700">Deposit History</h1>
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
                <th className="px-4 py-2 text-sm font-semibold text-center border rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-lg text-center text-gray-400">No Data Found</td>
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
                      <div className="flex items-center justify-center gap-1">
                        <div className="relative group">
                          <span className="cursor-default">
                            {truncateRefNo(row.RefrenceNo)}
                          </span>
                          {row.RefrenceNo && row.RefrenceNo.length > 15 && (
                            <div className="absolute z-10 hidden px-2 py-1 text-xs text-white transform -translate-x-1/2 bg-gray-600 rounded-md group-hover:block whitespace-nowrap -top-8 left-1/2">
                              {row.RefrenceNo}
                            </div>
                          )}
                        </div>
                        {row.RefrenceNo && (
                          <button 
                            onClick={() => copyToClipboard(row.RefrenceNo)}
                            className="p-1 text-blue-500 hover:text-blue-700"
                            title="Copy to clipboard"
                          >
                            <FaCopy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.PaymentDate}</td>
                    <td className="px-4 py-2 text-sm text-center border">
                      <span className={`px-2 py-1 rounded ${
                        row.Rf_Status === 'Approved' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {row.Rf_Status}
                      </span>
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
    </div>
  );
};

export default DepositHistory;