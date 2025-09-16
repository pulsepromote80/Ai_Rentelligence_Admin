"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllIncomeRequestAdmin } from '@/app/redux/fundManagerSlice';
import { usernameLoginId } from "@/app/redux/adminMasterSlice";
import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaCalendarAlt, FaUser, FaIdBadge, FaSearch, FaFileExcel, FaSyncAlt } from 'react-icons/fa';

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
        Charges: txn.AdminCharges ? `$${txn.AdminCharges}` : "$0",
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

      <h6 className="heading">
         Withdrawal History 
        </h6> 
<div className="flex justify-center mt-4 mb-6">
  <div className="w-full max-w-6xl">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

      {/* From Date */}
      <div className="relative">
        <label className="block mb-1 text-sm font-medium text-blue-800">
          From Date
        </label>
        <FaCalendarAlt className="absolute text-gray-500 left-3 top-9" />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

      {/* To Date */}
      <div className="relative">
        <label className="block mb-1 text-sm font-medium text-blue-800">
          To Date
        </label>
        <FaCalendarAlt className="absolute text-gray-500 left-3 top-9" />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

      {/* User ID */}
      <div className="relative">
        <label className="block mb-1 text-sm font-medium text-blue-800">
          User ID
        </label>
        <FaIdBadge className="absolute text-gray-500 left-3 top-9" />
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        />
        {userError && <p className="mt-1 text-sm text-red-600">{userError}</p>}
      </div>

      {/* Username */}
      <div className="relative">
        <label className="block mb-1 text-sm font-medium text-blue-800 cursor-not-allowed">
          Username
        </label>
        <FaUser className="absolute text-gray-500 left-3 top-9" />
        <input
          type="text"
          value={username}
          readOnly
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Buttons row */}
      <div className="flex items-end space-x-4">
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 px-5 py-2 text-white transition bg-blue-600 shadow rounded-xl hover:bg-blue-700"
                   >
                     <FaSearch className="w-4 h-4" /> Search
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2 text-white transition bg-green-600 shadow rounded-xl hover:bg-green-700"
                 >
                   <FaFileExcel className="w-4 h-4" /> Export
        </button>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-5 py-2 text-white transition bg-gray-600 shadow rounded-xl hover:bg-gray-700"
                 >
                   <FaSyncAlt className="w-4 h-4 animate-spin-on-hover" /> Refresh
        </button>
      </div>
    </div>
  </div>
</div>

{hasSearched && (
  <>
    {loading ? (
      <div className="py-10 text-center text-blue-600">Loading...</div>
    ) : error ? (
      <div className="py-10 text-center text-red-500">{error}</div>
    ) : (
      <div className="mt-4 overflow-x-auto bg-white border border-blue-200 shadoew-lg rounded-2xl">
        <table className="min-w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10 text-white bg-blue-600">
            <tr>
              <th className="px-4 py-3 font-semibold text-center border border-blue-300 rounded-tl-2xl">
                SR.NO.
              </th>
              <th className="px-4 py-3 font-semibold text-center border border-blue-300">
                ACTION
              </th>
              <th className="px-4 py-3 font-semibold text-center border border-blue-300">
                ACTION
              </th>
              <th className="px-4 py-3 font-semibold text-center border border-blue-300">
                USER ID
              </th>
              <th className="px-4 py-3 font-semibold text-center border border-blue-300">
                NAME
              </th>
              <th className="px-4 py-3 font-semibold text-center border border-blue-300">
                DATE
              </th>
              <th className="px-4 py-3 font-semibold text-center border border-blue-300">
                REQUEST ($)
              </th>
              <th className="px-4 py-3 font-semibold text-center border border-blue-300">
                CHARGES ($)
              </th>
              <th className="px-4 py-3 font-semibold text-center border border-blue-300 rounded-tr-2xl">
                RELEASE ($)
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="py-10 text-base text-center text-gray-400"
                >
                  No Data Found
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`transition ${
                    idx % 2 === 0
                      ? "bg-white hover:bg-blue-50"
                      : "bg-blue-50 hover:bg-blue-100"
                  }`}
                >
                  <td className="px-4 py-2 font-medium text-center text-gray-700 border border-blue-100">
                    {startItem + idx}
                  </td>
                  <td className="px-4 py-2 font-medium text-center text-blue-600 border border-blue-100">
                    Approve USDT
                  </td>
                  <td className="px-4 py-2 text-center text-blue-600 border border-blue-100 cursor-pointer hover:underline">
                    Approve
                  </td>
                  <td className="px-4 py-2 text-center text-gray-700 border border-blue-100">
                    {row.AuthLogin || "-"}
                  </td>
                  <td className="px-4 py-2 text-center text-gray-700 border border-blue-100">
                    {row.FullName || "-"}
                  </td>
                  <td className="px-4 py-2 text-center text-gray-700 border border-blue-100">
                    {row.CreatedDate ? row.CreatedDate.split("T")[0] : "-"}
                  </td>
                  <td className="px-4 py-2 text-center text-gray-700 border border-blue-100">
                    {row.TotWithdl}
                  </td>
                  <td className="px-4 py-2 text-center text-gray-700 border border-blue-100">
                    {row.AdminCharges}
                  </td>
                  <td className="px-4 py-2 text-center text-gray-700 border border-blue-100">
                    {row.Release}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {rowsToDisplay.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-blue-100 rounded-b-2xl">
            {/* Rows per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-1 text-sm border rounded focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="10">500</option>
                <option value="25">1000</option>
                <option value="50">1500</option>
              </select>
            </div>

            {/* Page info */}
            <div className="text-sm text-gray-600">
              {startItem}-{endItem} of {rowsToDisplay.length}
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-1 rounded ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-800"
                }`}
              >
                ‹
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`p-1 rounded ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-800"
                }`}
              >
                ›
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