"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllIncomeRequestAdmin } from '@/app/redux/fundManagerSlice';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';

const WithdrawalHistory = () => {
  const dispatch = useDispatch();
  const { withdrawRequestData, loading, error } = useSelector((state) => state.fundManager);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(getAllIncomeRequestAdmin());
  }, [dispatch]);

  const approvedRows = withdrawRequestData?.aprWithIncome || [];
  const rejectedRows = withdrawRequestData?.rejectedWithIncome || [];
  const allRows = [...approvedRows, ...rejectedRows];

const filteredRows = allRows.filter(row =>
  (row.AuthLogin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  row.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  (row.TotWithdl?.toString().includes(searchTerm)) ||
 (row.debit?.toString().includes(searchTerm)) ||
  row.Transhash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  row.PaymentDate?.toLowerCase().includes(searchTerm.toLowerCase()))
);

const rowsToDisplay = searchTerm ? filteredRows : allRows;

const paginatedRows = rowsToDisplay.slice(
  (currentPage - 1) * rowsPerPage, 
  currentPage * rowsPerPage
);
const totalPages = Math.ceil(rowsToDisplay.length / rowsPerPage);

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

      <div className='flex items-center justify-between mb-6'>
        <h1 className="w-full text-2xl font-bold text-center text-gray-700">Withdrawal History</h1>

        <div className="relative w-60">
          <input
            type="text"
            className="w-full py-2 pl-3 pr-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

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
                <th className="px-4 py-2 text-sm font-semibold text-center border">Name</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Amount ($)</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Debit ($)</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Admin Charges ($)</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">TransType</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Transaction Hash</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Withdrawal Mode</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-lg text-center text-gray-400">No Data Found</td>
                </tr>
              ) : (
                paginatedRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-50 transition'}
                  >
                    <td className="px-4 py-2 text-sm font-medium text-center text-gray-700 border">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.AuthLogin || '-'}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.FullName || '-'}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.TotWithdl}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.debit}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.AdminCharges}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.TransType}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      <div className="flex items-center justify-center gap-1">
                        <div className="relative group">
                          <span className="cursor-default">
                            {truncateRefNo(row.Transhash)}
                          </span>
                          {row.Transhash && row.Transhash.length > 15 && (
                            <div className="absolute z-10 hidden px-2 py-1 text-xs text-white transform -translate-x-1/2 bg-gray-600 rounded-md group-hover:block whitespace-nowrap -top-8 left-1/2">
                              {row.Transhash}
                            </div>
                          )}
                        </div>
                        {row.Transhash && (
                          <button
                            onClick={() => copyToClipboard(row.Transhash)}
                            className="p-1 text-blue-500 hover:text-blue-700"
                            title="Copy to clipboard"
                          >
                            <FaCopy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.withdrawalmode}</td>
                    <td className="px-4 py-2 text-sm text-center border">
                      <span className={`${row.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>
                        {row.status}
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

export default WithdrawalHistory;