'use client'

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllFundRequestReportAdmin,
  updateFundRequestStatusAdmin,
} from '@/app/redux/fundManagerSlice'
import { usernameLoginId } from '@/app/redux/adminMasterSlice'
import { toast } from 'react-toastify'
import { FaCopy } from 'react-icons/fa'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Search, FileSpreadsheet, RefreshCcw } from 'lucide-react'
import { Calendar, User, UserCircle2 } from 'lucide-react'
import { FaSearch, FaFileExcel, FaSyncAlt } from 'react-icons/fa'
const DepositRequest = () => {
  const dispatch = useDispatch()
  const { fundRequestData, loading, error } = useSelector(
    (state) => state.fundManager,
  )
  const [approvePopupOpen, setApprovePopupOpen] = useState(false)
  const [rejectPopupOpen, setRejectPopupOpen] = useState(false)
  const [selectedAuthLoginId, setSelectedAuthLoginId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(500)
  const [remark, setRemark] = useState('')
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
    fundRequestData?.unApproveFundRequest?.reduce(
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
      !fundRequestData?.unApproveFundRequest ||
      fundRequestData?.unApproveFundRequest?.length === 0
    ) {
      alert('No data available to export')
      return
    }
    const worksheet = XLSX.utils.json_to_sheet(
      fundRequestData?.unApproveFundRequest?.map((txn, index) => ({
        'Sr.No.': index + 1,
        Username: txn.AuthLogin,
        Name: txn.Name,
        Email: txn.Email,
        Amount: `$${txn.Amount}`,
        PaymentMode: txn.PaymentMode,
        TransactionHash: txn.RefrenceNo,
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
    setCurrentPage(1)
    setHasSearched(false)
  }

  const unApprovedRows = fundRequestData?.unApproveFundRequest || []

  const filteredRows = unApprovedRows.filter(
    (row) =>
      row.AuthLogin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.Amount?.toString().includes(searchTerm) ||
      row.PaymentMode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.RefrenceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.PaymentDate?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const rowsToDisplay = searchTerm ? filteredRows : unApprovedRows
  const paginatedRows = rowsToDisplay.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )
  const totalPages = Math.ceil(rowsToDisplay.length / rowsPerPage)
  const startItem = (currentPage - 1) * rowsPerPage + 1
  const endItem = Math.min(currentPage * rowsPerPage, rowsToDisplay.length)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleApproveClick = (authLoginId) => {
    setSelectedAuthLoginId(authLoginId)
    setApprovePopupOpen(true)
  }

  const handleRejectClick = (authLoginId) => {
    setSelectedAuthLoginId(authLoginId)
    setRejectPopupOpen(true)
  }

  const handleApprove = async () => {
    if (selectedAuthLoginId) {
      await dispatch(
        updateFundRequestStatusAdmin({
          authLoginId: selectedAuthLoginId,
          rfstatus: 1,
          remark: 'Approved by admin',
        }),
      )
      setApprovePopupOpen(false)
      setSelectedAuthLoginId(null)
      dispatch(getAllFundRequestReportAdmin())
    }
  }

  const handleReject = async () => {
    if (selectedAuthLoginId && remark.trim()) {
      try {
        await dispatch(
          updateFundRequestStatusAdmin({
            authLoginId: selectedAuthLoginId,
            rfstatus: 2,
            remark: remark,
          }),
        )
        setRejectPopupOpen(false)
        setSelectedAuthLoginId(null)
        setRemark('')
        toast.success('Rejected Successfully!', {
          position: 'top-right',
          autoClose: 3000,
        })
        dispatch(getAllFundRequestReportAdmin())
      } catch (error) {
        toast.error('Failed to rejected request', {
          position: 'top-right',
          autoClose: 3000,
        })
      }
    }
  }

  const handleCancel = () => {
    setApprovePopupOpen(false)
    setRejectPopupOpen(false)
    setSelectedAuthLoginId(null)
    setRemark('')
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to Clipboard!', {
      position: 'top-right',
      autoClose: 2000,
    })
  }

  return (
    <div className="max-w-7xl p-8 mx-auto mt-10 mb-12 bg-gradient-to-b from-white via-blue-50 to-white border border-blue-100 shadow-2xl rounded-3xl">
      <h6 className="heading">
        Deposit Request:{' '}
        <span className="text-green-600">
          ${Number(totalRelease.toFixed(2))}
        </span>
      </h6>

      {/* Filters */}

      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
        {/* From Date */}
        <div className="relative">
          <label
            htmlFor="fromDate"
            className="block mb-1 text-sm font-semibold text-blue-700"
          >
            From Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm 
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>
        </div>

        {/* To Date */}
        <div className="relative">
          <label
            htmlFor="toDate"
            className="block mb-1 text-sm font-semibold text-blue-700"
          >
            To Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm 
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>
        </div>

        <div className="relative">
          <label
            htmlFor="userId"
            className="block mb-1 text-sm font-semibold text-blue-700"
          >
            User ID
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              id="userId"
              className={`w-full pl-12 pr-4 py-3 rounded-lg border shadow-sm outline-none transition
        ${
          userError
            ? 'border-red-500 focus:ring-red-400 focus:border-red-500 bg-red-50'
            : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-400'
        }`}
            />
          </div>
          {userError && (
            <p className="mt-1 text-sm text-red-500">{userError}</p>
          )}
        </div>

        {/* Username (read-only) */}
        <div className="relative">
          <label
            htmlFor="username"
            className="block mb-1 text-sm font-semibold text-blue-700"
          >
            Username
          </label>
          <div className="relative">
            <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={username}
              readOnly
              id="username"
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-gray-100 shadow-sm cursor-not-allowed text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center mt-2 space-x-4 col-span-full">
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
          className="px-5 py-2 rounded-xl bg-gray-600 text-white shadow hover:bg-gray-700 transition flex items-center gap-2"
        >
          <FaSyncAlt className="w-4 h-4 animate-spin-on-hover" />  
          Refresh
        </button>
      </div>

      {/* Table */}
      {hasSearched && (
        <div className="mt-6 overflow-hidden border border-gray-200 rounded-2xl shadow-2xl bg-white">
          {loading ? (
            <div className="py-10 text-center text-blue-600 animate-pulse">
              Loading...
            </div>
          ) : error ? (
            <div className="py-10 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-center text-gray-700 border-collapse">
                {/* Table Header */}
                <thead className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wide th-wrap-text">
                      #
                    </th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wide th-wrap-text">
                      Approve
                    </th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wide th-wrap-text">
                      User ID
                    </th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wide th-wrap-text">
                      Name
                    </th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wide th-wrap-text">
                      Email
                    </th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wide th-wrap-text">
                      Amount ($)
                    </th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wide th-wrap-text">
                      Payment Method
                    </th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wide th-wrap-text">
                      Txn Hash
                    </th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wide th-wrap-text">
                      Date
                    </th>
                    <th className="px-4 py-3 font-semibold uppercase tracking-wide th-wrap-text">
                      Reject
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {paginatedRows.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-10 text-lg text-gray-400">
                        {searchTerm
                          ? 'No matching requests found'
                          : 'No Unapproved Requests Found'}
                      </td>
                    </tr>
                  ) : (
                    paginatedRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors duration-200 ${idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-blue-50'}`}
                      >
                        <td className="px-4 py-3 font-semibold">
                          {startItem + idx}
                        </td>
                        <td>
                          <button
                            onClick={() => handleApproveClick(row.AuthLogin)}
                            className="px-3 py-1 text-xs font-semibold text-white bg-green-500 rounded-lg shadow hover:bg-green-600 hover:scale-105 transition-transform"
                          >
                            Approve
                          </button>
                        </td>
                        <td className="px-2 py-2 td-wrap-text">
                          {row.AuthLogin || '-'}
                        </td>
                        <td className="px-2 py-2 td-wrap-text">
                          {row.Name || '-'}
                        </td>
                        <td className="px-2 py-2 td-wrap-text">
                          {row.Email || '-'}
                        </td>
                        <td className="font-semibold text-green-600 px-2 py-2 td-wrap-text">
                          ${row.Amount}
                        </td>
                        <td className="px-2 py-2 td-wrap-text">
                          {row.PaymentMode}
                        </td>
                        <td className="px-2 py-2 td-wrap-text">
                          <div className="flex items-center justify-center gap-1 ">
                            <span title={row.RefrenceNo || '-'}>
                              {row.RefrenceNo
                                ? `${row.RefrenceNo.substring(0, 10)}...`
                                : '-'}
                            </span>
                            {row.RefrenceNo && (
                              <button
                                onClick={() => copyToClipboard(row.RefrenceNo)}
                                className="p-1 text-blue-600 hover:text-blue-800 hover:scale-110 transition-transform"
                              >
                                <FaCopy className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-2 td-wrap-text">
                          {row.PaymentDate}
                        </td>
                        <td>
                          <button
                            onClick={() => handleRejectClick(row.AuthLogin)}
                            className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-lg shadow hover:bg-red-600 hover:scale-105 transition-transform"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {rowsToDisplay.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="p-1 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                  <option value="1500">1500</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                {startItem}-{endItem} of {rowsToDisplay.length}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg border transition-colors ${currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-blue-600 border-gray-300 hover:bg-blue-50'}`}
                >
                  ‹
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg border transition-colors ${currentPage === totalPages ? 'text-gray-400 border-gray-200' : 'text-blue-600 border-gray-300 hover:bg-blue-50'}`}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Approve Modal */}
      {approvePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl animate-fadeIn">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Approve request for{' '}
              <span className="text-blue-600">{selectedAuthLoginId}</span>?
            </h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleApprove}
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 hover:scale-105 transition-transform"
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl animate-fadeIn">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Reject request for{' '}
              <span className="text-blue-600">{selectedAuthLoginId}</span>?
            </h2>
            <textarea
              className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-red-400"
              rows={3}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter rejection reason..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={handleReject}
                disabled={!remark.trim()}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${!remark.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:scale-105 transition-transform'}`}
              >
                Submit
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DepositRequest
