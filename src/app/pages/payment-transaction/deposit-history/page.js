'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllFundRequestReportAdmin } from '@/app/redux/fundManagerSlice'
import { usernameLoginId } from '@/app/redux/adminMasterSlice'
import { FaCopy } from 'react-icons/fa'
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import { FaCalendarAlt, FaUser, FaIdBadge } from "react-icons/fa";
import { FaSearch, FaFileExcel, FaSyncAlt } from "react-icons/fa";

const DepositHistory = () => {
  const dispatch = useDispatch()
  const { fundRequestData, loading, error } = useSelector(
    (state) => state.fundManager,
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(500)
  const [searchTerm, setSearchTerm] = useState('')
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [userError, setUserError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-')
    return `${day}-${month}-${year}`
  }

  const totalRelease =
    fundRequestData?.approvedFundRequest?.reduce(
      (sum, txn) => sum + (Number(txn.Amount) || 0),
      0,
    ) || 0

  useEffect(() => {
    const fetchUsername = async () => {
      if (!userId.trim()) {
        setUsername('')
        setUserError('')
        return
      }
      const result = await dispatch(usernameLoginId(userId))
      if (result?.payload && result.payload.name) {
        setUsername(result.payload.name)
        setUserError('')
      } else {
        setUsername('')
        setUserError('Invalid User ID')
      }
    }
    fetchUsername()
  }, [userId, dispatch])

  const handleSearch = () => {
    const payload = {
      authLogin: userId || '',
      fromDate: formatDate(fromDate) || '',
      toDate: formatDate(toDate) || '',
    }
    dispatch(getAllFundRequestReportAdmin(payload))
    setHasSearched(true)
  }

  const handleExport = () => {
    if (
      !fundRequestData?.approvedFundRequest ||
      fundRequestData?.approvedFundRequest?.length === 0
    ) {
      alert('No data available to export')
      return
    }
    const worksheet = XLSX.utils.json_to_sheet(
      fundRequestData?.approvedFundRequest?.map((txn, index) => ({
        'Sr.No.': index + 1,
        Username: txn.AuthLogin,
        Name: txn.Name,
        Email: txn.Email,
        Amount: `$${txn.Amount}`,
        TransactionHash: txn.RefrenceNo,
        PaymentMode: txn.PaymentMode,
        PaymentDate: txn.PaymentDate,
      })),
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions')
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(data, 'Transactions.xlsx')
  }

  const handleRefresh = () => {
    setFromDate('')
    setToDate('')
    setUserId('')
    setUsername('')
    setUserError('')
    setSearchTerm('')
    setCurrentPage(1)
    setHasSearched(false)
  }

  const approvedRows = fundRequestData?.approvedFundRequest || []
  const rejectedRows = fundRequestData?.rejectedFundRequest || []
  const allRows = [...approvedRows, ...rejectedRows]

  const filteredRows = allRows.filter(
    (row) =>
      row.AuthLogin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.Amount?.toString().includes(searchTerm) ||
      row.PaymentMode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.RefrenceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.PaymentDate?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const rowsToDisplay = searchTerm ? filteredRows : allRows
  const paginatedRows = rowsToDisplay.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )
  const totalPages = Math.ceil(rowsToDisplay.length / rowsPerPage)
  const startItem = (currentPage - 1) * rowsPerPage + 1
  const endItem = Math.min(currentPage * rowsPerPage, rowsToDisplay.length)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!', {
      position: 'top-right',
      autoClose: 2000,
    })
  }

  const truncateRefNo = (refNo) => {
    if (!refNo) return '-'
    return refNo.length > 15 ? `${refNo.substring(0, 15)}...` : refNo
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-8 bg-gradient-to-br from-blue-50 to-white shadow-2xl border border-gray-200 rounded-3xl">
      {/* Header */}
      <h6 className="heading">
        Deposit History Total Released:{' '}
        <span className="text-green-600 font-bold">
          ${Number(totalRelease.toFixed(2))}
        </span>
      </h6>


{/* Filters Section */}
<div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2 lg:grid-cols-4">
  {/* From Date */}
  <div>
    <label className="block mb-1 text-sm font-semibold text-blue-700">
      From Date
    </label>
    <div className="relative">
      <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm"
      />
    </div>
  </div>

  {/* To Date */}
  <div>
    <label className="block mb-1 text-sm font-semibold text-blue-700">
      To Date
    </label>
    <div className="relative">
      <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm"
      />
    </div>
  </div>

  {/* User ID */}
  <div>
    <label className="block mb-1 text-sm font-semibold text-blue-700">
      User ID
    </label>
    <div className="relative">
      <FaIdBadge className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm"
      />
    </div>
    {userError && (
      <p className="mt-1 text-sm text-red-600">{userError}</p>
    )}
  </div>

  {/* Username */}
  <div>
    <label className="block mb-1 text-sm font-semibold text-blue-700">
      Username
    </label>
    <div className="relative">
      <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={username}
        readOnly
        className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-100 cursor-not-allowed shadow-inner"
      />
    </div>
  </div>
</div>

{/* Buttons */}
<div className="flex flex-wrap btn-flex gap-3 mt-6 mb-6">
  {/* Search Button */}
  <button
    onClick={handleSearch}
    className="px-5 py-2 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 transition flex items-center gap-2"
  >
    <FaSearch className="w-4 h-4" /> Search
  </button>

  {/* Export Button */}
  <button
    onClick={handleExport}
    className="px-5 py-2 rounded-xl bg-green-600 text-white shadow hover:bg-green-700 transition flex items-center gap-2"
  >
    <FaFileExcel className="w-4 h-4" /> Export Excel
  </button>

  {/* Refresh Button */}
  <button
    onClick={handleRefresh}
    className="px-5 py-2 rounded-xl bg-gray-600 text-white shadow hover:bg-gray-700 transition flex items-center gap-2"
  >
    <FaSyncAlt className="w-4 h-4 animate-spin-on-hover" /> Refresh
  </button>
</div>


      {/* Table Section */}
    {/* Table Section */}
{hasSearched && (
  <>
    {loading ? (
      <div className="mt-10 bg-white border border-gray-200 rounded-2xl shadow-xl py-10 text-center text-blue-600 font-semibold">
        Loading...
      </div>
    ) : error ? (
      <div className="text-center py-10 text-red-500 font-semibold">
        {error}
      </div>
    ) : (
      <div className="overflow-hidden border border-gray-200 rounded-2xl shadow-xl bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border-collapse">
            {/* Table Header */}
            <thead className="bg-blue-600 text-white">
              <tr>
                {[
                  'Sr.No.',
                  'User ID',
                  'Username',
                  'Email',
                  'Amount ($)',
                  'Payment Method',
                  'Transaction Hash',
                  'Payment Date',
                  'Remark',
                  'Status',
                ].map((heading, i) => (
                  <th
                    key={i}
                    className="th-wrap-text px-4 py-3 font-semibold uppercase tracking-wide text-xs border-b border-blue-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-10 text-center text-gray-400 text-lg"
                  >
                    No Data Found
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-blue-50 transition-colors border-b last:border-none td-wrap-text"
                  >
                    <td className="px-4 py-3 font-medium td-wrap-text">{startItem + idx}</td>
                    <td className="px-4 py-3 td-wrap-text">{row.AuthLogin || '-'}</td>
                    <td className="px-4 py-3 td-wrap-text">{row.Name || '-'}</td>
                    <td className="px-4 py-3 td-wrap-text">{row.Email || '-'}</td>
                    <td className="px-4 py-3 text-blue-700 font-semibold td-wrap-text">
                      {row.Amount}
                    </td>
                    <td className="px-4 py-3 td-wrap-text">{row.PaymentMode}</td>
                    <td className="px-4 py-3 td-wrap-text">
                      <div className="flex items-center justify-center gap-1">
                        <span
                          className="truncate max-w-[100px]"
                          title={row.RefrenceNo}
                        >
                          {truncateRefNo(row.RefrenceNo)}
                        </span>
                        {row.RefrenceNo && (
                          <button
                            onClick={() => copyToClipboard(row.RefrenceNo)}
                            className="text-blue-500 hover:text-blue-700 bg-blue px-3 py-1 rounded-full text-xs font-semibold"
                          >
                            <FaCopy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 td-wrap-text">{row.PaymentDate}</td>
                    <td className="px-4 py-3 td-wrap-text">{row.Remark}</td>
                    <td className="px-4 py-3 td-wrap-text">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          row.Rf_Status === 'Approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {row.Rf_Status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {rowsToDisplay.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 gap-3 bg-gray-50 rounded-b-2xl">
            {/* Rows per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-1 rounded-md border border-gray-300 focus:ring focus:ring-blue-300"
              >
                <option value="500">500</option>
                <option value="1000">1000</option>
                <option value="1500">1500</option>
              </select>
            </div>

            {/* Item range display */}
            <div className="text-sm text-gray-600">
              {startItem}-{endItem} of {rowsToDisplay.length}
            </div>

            {/* Pagination buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-100'
                }`}
              >
                ‹ Prev
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-100'
                }`}
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </div>
    )}
  </>
)}

    </div>
  )
}

export default DepositHistory
