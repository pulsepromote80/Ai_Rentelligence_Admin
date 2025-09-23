'use client'
import { useState, useEffect } from 'react'
import { getAccStatemtnt, usernameLoginId } from '@/app/redux/adminMasterSlice'
import { useDispatch, useSelector } from 'react-redux'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { Search, FileSpreadsheet, RefreshCcw } from 'lucide-react'
import { Calendar, User, UserCircle2 } from 'lucide-react'
import { FaSearch, FaFileExcel, FaSyncAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

const Statement = () => {
  const dispatch = useDispatch()
  const accStatementData = useSelector(
    (state) => state.adminMaster?.accStatementData?.data,
  )
  const { usernameData } = useSelector((state) => state.adminMaster)

  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [selectedWallet, setSelectedWallet] = useState('')
  const [transactionType, setTransactionType] = useState('')
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const [entriesPerPage, setEntriesPerPage] = useState(500)
  const [currentPage, setCurrentPage] = useState(1)
  const [userError, setUserError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const indexOfLastItem = currentPage * entriesPerPage
  const indexOfFirstItem = indexOfLastItem - entriesPerPage
  const currentData = accStatementData?.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(accStatementData?.length / entriesPerPage)

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-')
    return `${day}-${month}-${year}`
  }

  // credit aur debit ka total nikalne ke liye reduce use karo
  const totalCredit =
    hasSearched && accStatementData
      ? accStatementData.reduce((sum, txn) => sum + (txn.Credit || 0), 0)
      : 0

  const totalDebit =
    hasSearched && accStatementData
      ? accStatementData.reduce((sum, txn) => sum + (txn.Debit || 0), 0)
      : 0

  const getWalletType = (wallet) => {
    switch (wallet) {
      case 'Income':
        return 1
      case 'DepositWallet':
        return 2
      case 'RentWallet':
        return 3
        case 'transactionwallet':
        return 4
      default:
        return 0
    }
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

  // const handleSearch = () => {
  //   const payload = {
  //     authLogin: userId || '',
  //     transtype: transactionType || '',
  //     fromDate: formatDate(fromDate) || '',
  //     toDate: formatDate(toDate) || '',
  //     wtype: getWalletType(selectedWallet),
  //   }

  //   dispatch(getAccStatemtnt(payload))
  //   setHasSearched(true)
  // }

  const handleSearch = async () => {
  const payload = {
    authLogin: userId || '',
    transtype: transactionType || '',
    fromDate: formatDate(fromDate) || '',
    toDate: formatDate(toDate) || '',
    wtype: getWalletType(selectedWallet),
  };

  try {
    const resultAction = await dispatch(getAccStatemtnt(payload));

    if (getAccStatemtnt.fulfilled.match(resultAction)) {
      const res = resultAction.payload;

      if (res?.statusCode !== 200) {
        toast.error(res?.message || "Something went wrong!");
      } else {
        toast.success("Data fetched successfully!");
      }
    } else if (getAccStatemtnt.rejected.match(resultAction)) {
      toast.error(resultAction.payload || "API Request Failed!");
    }
  } catch (err) {
    toast.error("Unexpected error occurred!");
  }

  setHasSearched(true);
};

  const handleExport = () => {
    if (!accStatementData || accStatementData.length === 0) {
      alert('No data available to export')
      return
    }

    const worksheet = XLSX.utils.json_to_sheet(
      accStatementData.map((txn, index) => ({
        'Sr.No.': index + 1,
        Username: txn.AuthLogin,
        Name: txn.FullName,
        Credit: `$${txn.Credit}`,
        Debit: `$${txn.Debit}`,
        RequestedDate: txn.CreatedDate ? txn.CreatedDate.split('T')[0] : '',
        ApprovalDate: txn.ApprovalDate ? txn.ApprovalDate.split('T')[0] : '',
        TransType: txn.TransType,
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
    const payload = {
      authLogin: userId || '',
      transtype: transactionType || '',
      fromDate: formatDate(fromDate) || '',
      toDate: formatDate(toDate) || '',
      wtype: getWalletType(selectedWallet),
    }

    dispatch(getAccStatemtnt(payload))
  }

  return (
    <div className="p-8 mx-auto mt-2 border border-blue-100 shadow-2xl max-w-7xl bg-gradient-to-b from-white via-blue-50 to-white rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center justify-between gap-4">
          <h6 className="heading" style={{ paddingBottom: '0px' }}>
            Wallet Statement
          </h6>
          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold text-green-600">
              Total Credit : ${Number(totalCredit).toFixed(2)}
            </p>
            <p className="font-semibold text-red-600">
              Total Debit : ${Number(totalDebit).toFixed(2)}
            </p>
          </div>
        </div>
         <button
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-2 font-semibold text-white transition bg-green-600 rounded-lg shadow hover:bg-green-700"
        >
          <FileSpreadsheet className="w-5 h-5" />
          Export Excel
        </button>
      </div>

      {/* Filters */}
   <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2 lg:grid-cols-4">
  {/* From Date */}
  <div className="relative">
    <label htmlFor="fromDate" className="block mb-1 text-sm font-semibold text-blue-700">
      From Date
    </label>
    <div className="relative">
      <Calendar className="absolute w-5 h-5 text-blue-500 -translate-y-1/2 left-3 top-1/2" />
      <input
        type="date"
        id="fromDate"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="w-full py-2.5 pl-12 pr-4 transition bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
      />
    </div>
  </div>

  {/* To Date */}
  <div className="relative">
    <label htmlFor="toDate" className="block mb-1 text-sm font-semibold text-blue-700">
      To Date
    </label>
    <div className="relative">
      <Calendar className="absolute w-5 h-5 text-blue-500 -translate-y-1/2 left-3 top-1/2" />
      <input
        type="date"
        id="toDate"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="w-full py-2.5 pl-12 pr-4 transition bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
      />
    </div>
  </div>

  {/* Wallet Select */}
  <div className="relative">
    <label className="block mb-1 text-sm font-semibold text-blue-700">Select Wallet</label>
    <select
      value={selectedWallet}
      onChange={(e) => setSelectedWallet(e.target.value)}
      className="w-full py-2.5 pl-4 pr-4 transition bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
    >
      <option value="">-Select Wallet-</option>
      <option value="Income">Income Wallet</option>
      <option value="DepositWallet">Deposit Wallet</option>
      <option value="RentWallet">Rent Wallet</option>
      <option value="transactionwallet">Transaction Wallet</option>
    </select>
  </div>

  {/* Transaction Type */}
  <div className="relative">
    <label className="block mb-1 text-sm font-semibold text-blue-700">Transaction Type</label>
    <select
      value={transactionType}
      onChange={(e) => setTransactionType(e.target.value)}
      className="w-full py-2.5 pl-4 pr-4 transition bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
    >
      <option value="">Select Transaction</option>
      <option value="PayoutEarnings">Payout Earnings</option>
      <option value="FundTransfer">Fund Transfer</option>
      <option value="FundDepositByAdmin">Fund Deposit By Admin</option>
      <option value="Charges">Charges</option>
      <option value="Withdrawal">Withdrawal</option>
      <option value="Recharge">Recharge</option>
    </select>
  </div>

  {/* User ID */}
  <div className="relative">
    <label htmlFor="userId" className="block mb-1 text-sm font-semibold text-blue-700">
      User ID
    </label>
    <div className="relative">
      <User className="absolute w-5 h-5 text-blue-500 -translate-y-1/2 left-3 top-1/2" />
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        id="userId"
        className={`w-full pl-12 pr-4 py-2.5 rounded-lg border shadow-sm outline-none transition
          ${userError
            ? 'border-red-500 focus:ring-red-400 focus:border-red-500 bg-red-50'
            : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-400'
          }`}
      />
    </div>
    {userError && <p className="mt-1 text-sm text-red-500">{userError}</p>}
  </div>

  {/* Username */}
  <div className="relative">
    <label htmlFor="username" className="block mb-1 text-sm font-semibold text-blue-700">
      Username
    </label>
    <div className="relative">
      <UserCircle2 className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
      <input
        type="text"
        value={username}
        readOnly
        id="username"
        className="w-full py-2.5 pl-12 pr-4 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg shadow-sm cursor-not-allowed"
      />
    </div>
  </div>

  {/* Search Button */}
  <div className="flex items-end">
    <button
      onClick={handleSearch}
      className="flex items-center justify-center w-full gap-2 px-6 py-2 font-semibold text-white transition bg-blue-600 rounded-lg shadow hover:bg-blue-700"
    >
      <Search className="w-5 h-5" />
      Search
    </button>
  </div>

  {/* Refresh Button */}
  <div className="flex items-end">
    <button
      onClick={handleRefresh}
      className="flex items-center justify-center w-full gap-2 px-5 py-2 text-white transition bg-gray-600 shadow rounded-xl hover:bg-gray-700"
    >
      <FaSyncAlt className="w-4 h-4 animate-spin-on-hover" />
      Refresh
    </button>
  </div>
</div>

 
      {/* Transactions Table */}
      {hasSearched && accStatementData?.length > 0 && (
        <div className="mt-6 overflow-hidden bg-white border border-gray-200 shadow-2xl rounded-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center text-gray-700 border-collapse">
              {/* Table Header */}
              <thead className="text-white bg-gradient-to-r from-blue-700 to-blue-500">
                <tr>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase border th-wrap-text">
                    Sr.No.
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase border th-wrap-text">
                    Username
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase border th-wrap-text">
                    Name
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase border th-wrap-text">
                    Credit
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase border th-wrap-text">
                    Debit
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase border th-wrap-text">
                    Requested Date
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase border th-wrap-text">
                    Approval Date
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase border th-wrap-text">
                    TransType
                  </th>
                  <th className="px-4 py-3 font-semibold tracking-wide uppercase border th-wrap-text">
                    Remark
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((transaction, index) => (
                  <tr
                    key={index}
                    className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-blue-50'}`}
                  >
                    <td className="px-2 py-2 border td-wrap-text">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-2 py-2 border td-wrap-text">
                      {transaction.AuthLogin}
                    </td>
                    <td className="px-2 py-2 border td-wrap-text">
                      {transaction.FullName}
                    </td>
                    <td className="px-2 py-2 border td-wrap-text">
                      ${transaction.Credit}
                    </td>
                    <td className="px-2 py-2 border td-wrap-text">
                      ${transaction.Debit}
                    </td>
                    <td className="px-2 py-2 border td-wrap-text">
                      {transaction.CreatedDate
                        ? transaction.CreatedDate.split('T')[0]
                        : '-'}
                    </td>
                    <td className="px-2 py-2 border td-wrap-text">
                      {transaction.ApprovalDate
                        ? transaction.ApprovalDate.split('T')[0]
                        : '-'}
                    </td>
                    <td className="px-2 py-2 border td-wrap-text">
                      {transaction.TransType}
                    </td>
                    <td className="px-2 py-2 border td-wrap-text">
                      {transaction.Remark}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="p-1 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400"
              >
                <option value={10}>500</option>
                <option value={25}>1000</option>
                <option value={50}>1500</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {indexOfFirstItem + 1}–
              {Math.min(indexOfLastItem, accStatementData.length)} of{' '}
              {accStatementData.length}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
        </div>
      )}
    </div>
  )
}

export default Statement
