"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllIncomeRequestAdmin } from '@/app/redux/fundManagerSlice';
import { usernameLoginId } from "@/app/redux/adminMasterSlice";
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


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
    if (!withdrawRequestData?.aprWithIncome || withdrawRequestData?.aprWithIncome?.length === 0) {
      alert("No data available to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      withdrawRequestData?.aprWithIncome?.map((txn, index) => ({
        "Sr.No.": index + 1,
        Username: txn.AuthLogin,
        Name: txn.FullName,
        Email: txn.Email,
        Amount: `$${txn.TotWithdl}`,
        Release: `$${txn.Release}`,
        WalletAddress: txn.Wallet,
        CreatedDate: txn.CreatedDate ? txn.CreatedDate.split("T")[0] : "-",
        ApprovalDate: txn.ApprovalDate ? txn.ApprovalDate.split("T")[0] : "-",
        TransactionHash: txn.TransHash,
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
    setFromDate("");
    setToDate("");
    setUserId("");
    setUsername("");
    setUserError("");
    setCurrentPage(1);
    setHasSearched(false);
  };

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
    <div className="max-w-6xl p-6 mx-auto mt-8 mb-10 bg-white border border-blue-100 shadow-2xl rounded-2xl">
      <h1 className="w-full text-2xl font-bold text-center text-gray-700">Withdrawal History</h1>
      <div className="flex justify-center mt-4 mb-6">
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
            <div className="flex items-center justify-center mt-2 space-x-4 col-span-full">
              <button
                onClick={handleSearch}
                className="px-5 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Search
              </button>
              <button
                onClick={handleExport}
                className="px-5 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Export Excel
              </button>
              <button
                onClick={handleRefresh}
                className="px-5 py-2 text-sm text-white bg-gray-600 rounded-md hover:bg-gray-700"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {hasSearched && (
        <>
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
                    <th className="px-4 py-2 text-sm font-semibold text-center border">Email</th>
                    <th className="px-4 py-2 text-sm font-semibold text-center border">Amount ($)</th>
                    <th className="px-4 py-2 text-sm font-semibold text-center border">Charges ($)</th>
                    <th className="px-4 py-2 text-sm font-semibold text-center border">Release ($)</th>
                    <th className="px-4 py-2 text-sm font-semibold text-center border">Wallet Address</th>
                    <th className="px-4 py-2 text-sm font-semibold text-center border">Transaction Hash</th>
                    <th className="px-4 py-2 text-sm font-semibold text-center border">Created Date</th>
                    <th className="px-4 py-2 text-sm font-semibold text-center border">Approval Date</th>
                    <th className="px-4 py-2 text-sm font-semibold text-center border">Remark</th>
                    <th className="px-4 py-2 text-sm font-semibold text-center border rounded-tr-lg">Status</th>
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
                        <td className="px-4 py-2 text-sm font-medium text-center text-gray-700 border">{startItem + idx}</td>
                        <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.AuthLogin || '-'}</td>
                        <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.FullName || '-'}</td>
                        <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.Email}</td>
                        <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.TotWithdl}</td>

                        <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.AdminCharges}</td>
                        <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.Release}</td>
                        <td className="px-4 py-2 text-sm text-center text-gray-700 border">
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
                        <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                          <div className="flex items-center justify-center gap-1">
                            <div className="relative group">
                              <span className="cursor-default">
                                {truncateRefNo(row.TransHash)}
                              </span>
                              {row.TransHash && row.TransHash.length > 15 && (
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
                        <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                          {row.CreatedDate ? row.CreatedDate.split("T")[0] : "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                          {row.ApprovalDate ? row.ApprovalDate.split("T")[0] : "-"}
                        </td>


                        <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.Remark}</td>

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
                      <option value="10">500</option>
                      <option value="25">1000</option>
                      <option value="50">1500</option>
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
          )}
        </>
      )}

    </div>
  );
};

export default WithdrawalHistory;