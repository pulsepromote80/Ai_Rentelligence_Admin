"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRentWallet } from '@/app/redux/fundManagerSlice';
import { toast } from 'react-toastify';
import { FaCopy } from 'react-icons/fa';

const RentWallet = () => {
  const dispatch = useDispatch();
  const { rentWalletData, loading, error } = useSelector((state) => state.fundManager);
  const [currentPage, setCurrentPage] = useState(1);
   const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(getRentWallet());
  }, [dispatch]);

  const walletRows = rentWalletData?.rentWallet || [];
  const filteredRows = walletRows.filter(row =>
    (row.AuthLogin?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.FullName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.payMode?.toString().includes(searchTerm)) ||
    (row.transType?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.trCode?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.PaymentDate?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.ExtraRemark?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const rowsToDisplay = searchTerm ? filteredRows : walletRows;


  const paginatedRows = rowsToDisplay.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(rowsToDisplay.length / rowsPerPage);

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
      
      <div className='flex items-center justify-between mb-6'>
        <h1 className="w-full text-2xl font-bold text-center text-gray-700">Rent Wallet History</h1>

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

                <th className="px-4 py-2 text-sm font-semibold text-center border">UserId</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Username</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Payment Mode</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Transaction Type</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Transaction Code</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Transaction Hash</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Credit</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Debit</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Request</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Charges</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Release</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Created Date</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Approval Date</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Status</th>
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
                    key={row.ID || idx}
                    className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-50 transition'}
                  >
                    <td className="px-4 py-2 text-sm font-medium text-center text-gray-700 border">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.AuthLogin || '-'}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.FullName || '-'}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.payMode || '-'}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.transType || '-'}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.trCode || '-'}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                                          <div className="flex items-center justify-center gap-1 group ">
                                            <span
                                              className="cursor-pointer"
                                              title={row.ExtraRemark || '-'}
                                            >
                                              {row.ExtraRemark ? `${row.ExtraRemark.substring(0, 15)}...` : '-'}
                                            </span>
                                            {row.ExtraRemark && (
                                              <button
                                                onClick={() => copyToClipboard(row.ExtraRemark)}
                                                className="p-1 text-blue-500 hover:text-blue-700"
                                                title="Copy to Clipboard"
                                              >
                                                <FaCopy className="w-3 h-3" />
                                              </button>
                                            )}
                                          </div>
                                        </td>
                    <td className="px-4 py-2 text-sm text-center text-green-700 border">{row.credit}</td>
                    <td className="px-4 py-2 text-sm text-center text-red-700 border">{row.debit}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.Request}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.Charges || '-'}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.Release || '-'}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.CreatedDate ? new Date(row.CreatedDate).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.ApprovalDate ? new Date(row.ApprovalDate).toLocaleString() : '-'}</td>
                    <td className="px-4 py-2 text-sm text-center border">
                      <span className={` ${row.Status === 'Approved' ? 'text-green-600' :
                          row.Status === 'Pending' ? 'text-yellow-600' :
                            'text-red-600'
                        }`}>
                        {row.Status}
                      </span>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
          {walletRows.length > rowsPerPage && (
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

export default RentWallet;
