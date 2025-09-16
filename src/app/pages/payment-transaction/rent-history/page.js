'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getRentWallet } from '@/app/redux/fundManagerSlice'
import { usernameLoginId } from '@/app/redux/adminMasterSlice'
import { toast } from 'react-toastify'
import { FaCopy } from 'react-icons/fa'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

import {
  FaCalendarAlt,
  FaUser,
  FaIdBadge,
  FaSearch,
  FaFileExcel,
  FaSyncAlt,
} from 'react-icons/fa'

const RentWallet = () => {
  const dispatch = useDispatch()
  const { rentWalletData, loading, error } = useSelector(
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

    dispatch(getRentWallet(payload))
    setHasSearched(true)
  }

  const handleExport = () => {
    if (
      !rentWalletData?.aprWithrentwallet ||
      rentWalletData?.aprWithrentwallet?.length === 0
    ) {
      alert('No data available to export')
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(
      rentWalletData?.unApWithrentwallet?.map((txn, index) => ({
        'Sr.No.': index + 1,
        Username: txn.AuthLogin,
        Name: txn.FullName,
        Email: txn.Email,
        Request: `$${txn.Request}`,
        Release: `$${txn.Release}`,
        WalletAddress: txn.Wallet,
        TransactionHash: txn.TransHash,
        CreatedDate: txn.CreatedDate ? txn.CreatedDate.split('T')[0] : '-',
        ApprovalDate: txn.ApprovalDate ? txn.ApprovalDate.split('T')[0] : '-',
        Remark: txn.Remark,
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
    setCurrentPage(1)
    setHasSearched(false)
  }

  const walletRows = rentWalletData?.aprWithrentwallet || []
  const filteredRows = walletRows.filter(
    (row) =>
      row.AuthLogin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.FullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.payMode?.toString().includes(searchTerm) ||
      row.transType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.trCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.PaymentDate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.ExtraRemark?.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const rowsToDisplay = searchTerm ? filteredRows : walletRows

  const paginatedRows = rowsToDisplay.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )
  const totalPages = Math.ceil(rowsToDisplay.length / rowsPerPage)
  const startItem = (currentPage - 1) * rowsPerPage + 1
  const endItem = Math.min(currentPage * rowsPerPage, rowsToDisplay.length)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to Clipboard!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  return (
    <div className="max-w-6xl p-6 mx-auto mt-8 mb-10 bg-white border border-blue-100 shadow-2xl rounded-2xl">
      <h6 className="heading">Yield Wallet History</h6>

      <div className="grid grid-cols-1 gap-6 mt-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
        {/* From Date */}
        <div>
          <label className="block mb-1 text-sm font-medium text-blue-800">
            From Date
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        {/* To Date */}
        <div>
          <label className="block mb-1 text-sm font-medium text-blue-800">
            To Date
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        {/* User ID */}
        <div>
          <label className="block mb-1 text-sm font-medium text-blue-800">
            User ID
          </label>
          <div className="relative">
            <FaIdBadge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
          </div>
          {userError && (
            <p className="mt-1 text-sm text-red-600">{userError}</p>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="block mb-1 text-sm font-medium text-blue-800 cursor-not-allowed">
            Username
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={username}
              readOnly
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Buttons row */}
        <div className="flex items-end space-x-4">
          <button
            onClick={handleSearch}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaSearch className="w-4 h-4" /> Search
          </button>
          <button
            onClick={handleExport}
            className="px-5 py-2 rounded-xl bg-green-600 text-white shadow hover:bg-green-700 transition flex items-center gap-2"
          >
            <FaFileExcel className="w-4 h-4" /> Export
          </button>
          <button
            onClick={handleRefresh}
            className="px-5 py-2 rounded-xl bg-gray-600 text-white shadow hover:bg-gray-700 transition flex items-center gap-2"
          >
            <FaSyncAlt className="w-4 h-4 animate-spin-on-hover" /> Refresh
          </button>
        </div>
      </div>

    {hasSearched && (
  <>
    {loading ? (
      <div className="py-10 text-center text-blue-600 font-medium">Loading...</div>
    ) : error ? (
      <div className="py-10 text-center text-red-500 font-medium">{error}</div>
    ) : (
      <div className="mt-2 overflow-x-auto border border-gray-200 shadow-lg rounded-xl bg-white">
        <table className="min-w-full border border-gray-200 rounded-xl">
          {/* Header */}
          <thead className="sticky top-0 z-10 text-white bg-blue-600">
            <tr>
              <th className="px-4 py-3 text-sm uppercase tracking-wide th-wrap-text">Sr.No.</th>
              <th className="px-4 py-3 text-sm uppercase tracking-wide th-wrap-text">User ID</th>
              <th className="px-4 py-3 text-sm uppercase tracking-wide th-wrap-text">Username</th>
              <th className="px-4 py-3 text-sm uppercase tracking-wide th-wrap-text">Email</th>
              <th className="px-4 py-3 text-sm uppercase tracking-wide th-wrap-text">Wallet</th>
              <th className="px-4 py-3 text-sm uppercase tracking-wide th-wrap-text">Txn Hash</th>
              <th className="px-4 py-3 text-sm uppercase tracking-wide th-wrap-text">Request ($)</th>
              <th className="px-4 py-3 text-sm uppercase tracking-wide th-wrap-text">Charges ($)</th>
              <th className="px-4 py-3 text-sm uppercase tracking-wide th-wrap-text">Release ($)</th>
              <th className="px-4 py-3 text-sm uppercase tracking-wide th-wrap-text">Created</th>
              <th className="px-4 py-3 text-sm uppercase tracking-wide th-wrap-text">Approval</th>
              <th className="px-4 py-3 text-sm uppercase tracking-wide th-wrap-text">Remark</th>
              <th className="px-4 py-3 text-sm uppercase tracking-wide th-wrap-text">Status</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={13} className="py-10 text-lg text-center text-gray-400 td-wrap-text">
                  No Data Found
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => (
                <tr
                  key={row.ID || idx}
                  className={
                    idx % 2 === 0
                      ? 'bg-white hover:bg-blue-50 transition'
                      : 'bg-blue-50 hover:bg-blue-100 transition'
                  }
                >
                  <td className="px-4 py-2 text-sm font-medium text-center text-gray-700 border td-wrap-text">
                    {startItem + idx}
                  </td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700 border td-wrap-text">{row.AuthLogin || '-'}</td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700 border td-wrap-text">{row.FullName || '-'}</td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700 border td-wrap-text">{row.Email || '-'}</td>

                  {/* Wallet with copy */}
                  <td className="px-4 py-2 text-sm text-center text-gray-700 border td-wrap-text">
                    <div className="flex items-center justify-center gap-1">
                      <span title={row.Wallet || '-'}>{row.Wallet ? `${row.Wallet.substring(0, 12)}...` : '-'}</span>
                      {row.Wallet && (
                        <button
                          onClick={() => copyToClipboard(row.Wallet)}
                          className="p-1 text-blue-500 hover:text-blue-700"
                          title="Copy"
                        >
                          <FaCopy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Txn Hash with copy */}
                  <td className="px-4 py-2 text-sm text-center text-gray-700 border td-wrap-text">
                    <div className="flex items-center justify-center gap-1">
                      <span title={row.TransHash || '-'}>{row.TransHash ? `${row.TransHash.substring(0, 12)}...` : '-'}</span>
                      {row.TransHash && (
                        <button
                          onClick={() => copyToClipboard(row.TransHash)}
                          className="p-1 text-blue-500 hover:text-blue-700"
                          title="Copy"
                        >
                          <FaCopy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-2 text-sm text-center text-gray-700 border td-wrap-text">${row.Request}</td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700 border td-wrap-text">{row.Charges || '-'}</td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700 border td-wrap-text">{row.Release || '-'}</td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700 border td-wrap-text">
                    {row.CreatedDate ? row.CreatedDate.split('T')[0] : '-'}
                  </td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700 bordertd-wrap-text">
                    {row.ApprovalDate ? row.ApprovalDate.split('T')[0] : '-'}
                  </td>
                  <td className="px-4 py-2 text-sm text-center text-red-600 border td-wrap-text">{row.Remark}</td>
                  <td className="px-4 py-2 text-sm font-semibold text-center border td-wrap-text">
                    <span
                      className={
                        row.Status === 'Approved'
                          ? 'text-green-600'
                          : row.Status === 'Pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }
                    >
                      {row.Status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {rowsToDisplay.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-b-xl border-t">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="p-1 mr-3 text-sm border rounded focus:ring-1 focus:ring-blue-500"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">{startItem}-{endItem} of {rowsToDisplay.length}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
              >
                ◀
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
              >
                ▶
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

export default RentWallet
