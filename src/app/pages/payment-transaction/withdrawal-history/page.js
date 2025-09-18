"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllIncomeRequestAdmin } from '@/app/redux/fundManagerSlice';
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";  import { Search, FileSpreadsheet, RefreshCcw } from 'lucide-react'
import { Calendar, User, UserCircle2 } from 'lucide-react'
import { FaSearch, FaFileExcel, FaSyncAlt } from 'react-icons/fa'

const WithdrawalHistory = () => {
  const dispatch = useDispatch();
  const { withdrawRequestData, loading, error } = useSelector((state) => state.fundManager);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(500);
  const [searchTerm, setSearchTerm] = useState('');
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [userError, setUserError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchUsername = async () => {
      if (!userId.trim()) {
        setUsername("");
        setUserError("");
        return;
      }

      const result = await dispatch(usernameLoginId(userId));

      if (result?.payload && result.payload.name) {
        setUsername(result.payload.name);
        setUserError("");
      } else {
        setUsername("");
        setUserError("Invalid User ID");
      }
    };

    fetchUsername();
  }, [userId, dispatch]);

  const handleSearch = () => {
    const payload = {
      authLogin: userId || "",
      fromDate: formatDate(fromDate) || "",
      toDate: formatDate(toDate) || "",
    };

    dispatch(getAllIncomeRequestAdmin(payload));
    setHasSearched(true);
  };

  const handleExport = () => {
    if (!withdrawRequestData?.unApWithIncome || withdrawRequestData?.unApWithIncome?.length === 0) {
      alert("No data available to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      withdrawRequestData?.unApWithIncome?.map((txn, index) => ({
        "Sr.No.": index + 1,
        Username: txn.AuthLogin,
        Name: txn.FullName,
        Email: txn.Email,
        Amount: `$${txn.TotWithdl}`,
        Release: `$${txn.Release}`,
        Charges: txn.AdminCharges ? `$${txn.AdminCharges}` : "$0",
        WalletAddress: txn.Wallet,
        CreatedDate: txn.CreatedDate ? txn.CreatedDate.split("T")[0] : "-",
        ApprovalDate: txn.ApprovalDate ? txn.ApprovalDate.split("T")[0] : "-",
        TransactionHash: txn.Transhash,
        Remark: txn.Remark,
        Status: txn.status,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Transactions.xlsx");
  };

  const handleRefresh = () => {
    setFromDate('')
    setToDate('')
    setUserId('')
    setUsername('')
    setUserError('')
    setCurrentPage(1)
    setHasSearched(false)
  }

  const approvedRows = withdrawRequestData?.aprWithIncome || [];
  console.log("test-->",approvedRows);
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
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, rowsToDisplay.length);

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
     <div className="p-8 mx-auto mt-0 mb-12 border border-blue-100 shadow-2xl max-w-7xl bg-gradient-to-b from-white via-blue-50 to-white rounded-3xl">
      <h6 className="heading">
        Withdrawal History
      </h6> 
       
        <div className="grid grid-cols-1 gap-6 mt-0 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-blue-800">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-blue-800">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-blue-800">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
              {userError && <p className="mt-1 text-sm text-red-600">{userError}</p>}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-blue-800 cursor-not-allowed">
                Username
              </label>
              <input
                type="text"
                value={username}
                readOnly
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
            </div>

            {/* Buttons row */}
             <div className="flex items-center mt-2 space-x-4 justify-left col-span-full">
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-6 py-2 font-semibold text-white transition bg-blue-600 rounded-lg shadow hover:bg-blue-700"
        >
          <Search className="w-5 h-5" />
          Search
        </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-6 py-2 font-semibold text-white transition bg-green-600 rounded-lg shadow hover:bg-green-700"
                      >
                        <FileSpreadsheet className="w-5 h-5" />
                        Export Excel
                      </button>
               <button
                        onClick={handleRefresh}
                       className="flex items-center gap-2 px-5 py-2 text-white transition bg-gray-600 shadow rounded-xl hover:bg-gray-700"
                            >
                              <FaSyncAlt className="w-4 h-4 animate-spin-on-hover" />  
                              Refresh
                            </button>
            </div>
          </div>
         

      {hasSearched && (
        <>
         <div className="mt-6 overflow-hidden bg-white border border-gray-200 shadow-2xl rounded-2xl"></div>
          {loading ? (
            <div className="py-10 text-center">Loading...</div>
          ) : error ? (
            <div className="py-10 text-center text-red-500">{error}</div>
          ) : (
         <div className='mt-6 overflow-hidden bg-white border border-gray-200 shadow-2xl rounded-2xl'>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-center text-gray-700 border-collapse">
                {/* Table Header */}
                <thead className="text-white bg-gradient-to-r from-blue-700 to-blue-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">Sr.No.</th>
                    <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">User ID</th>
                    <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">Name</th>
                    <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">Email</th>
                    <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">Amount ($)</th>
                    <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">Charges ($)</th>
                    <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">Release ($)</th>
                    <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">Wallet Address</th>
                    <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">Transaction Hash</th>
                    <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">Created Date</th>
                    <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">Approval Date</th>
                    <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">Remark</th>
                    <th className="px-4 py-3 font-semibold tracking-wide uppercase th-wrap-text border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-10 text-lg text-center text-gray-400">No Data Found</td>
                    </tr>
                  ) : (
                    paginatedRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-50 transition'}
                      >
                        <td className="px-2 py-2 td-wrap-text border">{startItem + idx}</td>
                        <td className="px-2 py-2 td-wrap-text border">{row.AuthLogin || '-'}</td>
                        <td className="px-2 py-2 td-wrap-text border">{row.FullName || '-'}</td>
                        <td className="px-2 py-2 td-wrap-text border">{row.Email}</td>
                        <td className="px-2 py-2 td-wrap-text border">{row.TotWithdl}</td>

                        <td className="px-2 py-2 td-wrap-text border">{row.AdminCharges}</td>
                        <td className="px-2 py-2 td-wrap-text border">{row.Release}</td>
                        <td className="px-2 py-2 td-wrap-text border">
                          <div className="flex items-center justify-center gap-1">
                            <div className="relative group">
                              <span className="cursor-default">
                                {truncateRefNo(row.Wallet)}
                              </span>
                              {row.Wallet && row.Wallet.length > 15 && (
                                <div className="absolute z-10 hidden px-2 py-1 text-xs text-white transform -translate-x-1/2 bg-gray-600 rounded-md group-hover:block whitespace-nowrap -top-8 left-1/2">
                                  {row.Wallet}
                                </div>
                              )}
                            </div>
                            {row.Wallet && (
                              <button
                                onClick={() => copyToClipboard(row.Wallet)}
                                className="p-1 text-blue-500 hover:text-blue-700"
                                title="Copy to clipboard"
                              >
                                <FaCopy className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-2 td-wrap-text border">
                          <div className="flex items-center justify-center gap-1">
                            <div className="relative group">
                              <span className="cursor-default">
                                {truncateRefNo(row.TransHash)}
                              </span>
                              {row.Transhash && row.TransHash.length > 15 && (
                                <div className="absolute z-10 hidden px-2 py-1 text-xs text-white transform -translate-x-1/2 bg-gray-600 rounded-md group-hover:block whitespace-nowrap -top-8 left-1/2">
                                  {row.TransHash}
                                </div>
                              )}
                            </div>
                            {row.TransHash && (
                              <button
                                onClick={() => copyToClipboard(row.TransHash)}
                                className="p-1 text-blue-500 hover:text-blue-700"
                                title="Copy to clipboard"
                              >
                                <FaCopy className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-2 td-wrap-text border">
                          {row.CreatedDate ? row.CreatedDate.split("T")[0] : "-"}
                        </td>
                        <td className="px-2 py-2 td-wrap-text border">
                          {row.ApprovalDate ? row.ApprovalDate.split("T")[0] : "-"}
                        </td>


                        <td className="px-2 py-2 td-wrap-text border">{row.Remark}</td>

                        <td className="px-4 py-2 text-sm text-center">
                          <span className={`${row.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))

                  )}
                </tbody>
              </table>

              {rowsToDisplay.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows per page:</span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="p-1 mr-3 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="500">500</option>
                      <option value="1000">1000</option>
                      <option value="1500">1500</option>
                    </select>
                  </div>
                  <div className="text-sm text-gray-600">
                    {startItem}-{endItem} of {rowsToDisplay.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

            </div>
            </div>
          )} 
        </>
      )}

    </div>
  );
};

export default WithdrawalHistory;