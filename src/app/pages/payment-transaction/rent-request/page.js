
'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getRentWallet,
  updateRentWithdrawRequestStatusAdmin,
  updateRentWalletAdressUSDT,
} from '@/app/redux/fundManagerSlice'
import { usernameLoginId } from '@/app/redux/adminMasterSlice'
import { toast } from 'react-toastify'
import { FaCopy } from 'react-icons/fa'
import { ethers } from 'ethers'
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

const RentRequest = () => {
  const dispatch = useDispatch()
  const { rentWalletData, loading, error } = useSelector(
    (state) => state.fundManager,
  )

  // MetaMask state
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false)
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [usdBalance, setUsdBalance] = useState('0.00')
  const [isSending, setIsSending] = useState(false)
  const [balanceInUsdt, setBalanceInUsdt] = useState(0)

  // Table state
  const [approvePopupOpen, setApprovePopupOpen] = useState(false)
  const [rejectPopupOpen, setRejectPopupOpen] = useState(false)
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
  const [processedRequests, setProcessedRequests] = useState(new Set())
  const [selectedRequest, setSelectedRequest] = useState({ authLoginId: null, id: null })

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const [year, month, day] = dateString.split('-')
    return `${day}-${month}-${year}`
  }

  const totalRelease = hasSearched && rentWalletData?.unApWithrentwallet 
  ? rentWalletData.unApWithrentwallet.reduce(
      (sum, txn) => sum + (Number(txn.Release) || 0),
      0
    )
  : 0
  // BSC chain configuration
  const BSC_CHAIN_ID = '0x38' // BSC Mainnet
  const BSC_CHAIN_NAME = 'BNB Smart Chain'
  const BSC_RPC_URL = 'https://bsc-dataseed.binance.org/'
  const BSC_CURRENCY_SYMBOL = 'BNB'
  const BSC_BLOCK_EXPLORER_URL = 'https://bscscan.com'

  const ERC20_ABI = ['function balanceOf(address owner) view returns (uint256)']

  // USDT Contract Details (BEP-20)
  const USDT_CONTRACT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955'
  const USDT_DECIMALS = 18

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
      !rentWalletData?.unApWithrentwallet ||
      rentWalletData?.unApWithrentwallet?.length === 0
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
        Charges: txn.Charges ? `$${txn.Charges}` : "$0",
        WalletAddress: txn.Wallet,
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
  
  dispatch(getRentWallet({
    authLogin: '',
    fromDate: '',
    toDate: ''
  }))
}
  // Function to fetch BSC wallet balance
  const fetchWalletBalances = async (accountAddress) => {
    try {
      const provider = new ethers.JsonRpcProvider(BSC_RPC_URL)

      // BNB balance
      const balanceWei = await provider.getBalance(accountAddress)
      const balanceInBnb = parseFloat(ethers.formatEther(balanceWei))

      // USDT balance - FIXED calculation
      const usdtContract = new ethers.Contract(
        USDT_CONTRACT_ADDRESS,
        ERC20_ABI,
        provider,
      )

      const usdtRaw = await usdtContract.balanceOf(accountAddress)

      // USDT has 18 decimals on BSC, so we need to divide by 10^18
      const usdtBalance = parseFloat(ethers.formatUnits(usdtRaw, 18))

      // Set the USDT balance to state
      setBalanceInUsdt(usdtBalance)

      // Calculate total USD value (just USDT for now)
      const totalUsdValue = usdtBalance
      setUsdBalance(totalUsdValue.toFixed(2))

      return { usdt: usdtBalance }
    } catch (error) {
      console.error('Error fetching balances:', error)
      setUsdBalance('0.00')
      setBalanceInUsdt(0)
      return { bnb: 0, usdt: 0 }
    }
  }

  // Switch to BSC network
  const switchToBSCNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_CHAIN_ID }],
      })
      return true
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: BSC_CHAIN_ID,
                chainName: BSC_CHAIN_NAME,
                rpcUrls: [BSC_RPC_URL],
                nativeCurrency: {
                  name: 'Binance Coin',
                  symbol: BSC_CURRENCY_SYMBOL,
                  decimals: 18,
                },
                blockExplorerUrls: [BSC_BLOCK_EXPLORER_URL],
              },
            ],
          })
          return true
        } catch (addError) {
          console.error('Error adding BSC network:', addError)
          toast.error('Failed to add BSC network to MetaMask')
          return false
        }
      }
      console.error('Error switching to BSC network:', switchError)
      toast.error('Failed to switch to BSC network')
      return false
    }
  }

  // Send USDT transaction via MetaMask
  const sendUSDTTransaction = async (toAddress, amount) => {
    if (!window.ethereum || !account) {
      toast.error('MetaMask not connected')
      return null
    }

    try {
      setIsSending(true)

      // Convert amount to wei (considering USDT has 18 decimals)
      const amountInWei = BigInt(
        Math.floor(amount * 10 ** USDT_DECIMALS),
      ).toString(16)

      // Prepare transaction parameters
      const transactionParameters = {
        to: USDT_CONTRACT_ADDRESS,
        from: account,
        value: '0x0',
        data:
          '0xa9059cbb' +
          toAddress.toLowerCase().replace('0x', '').padStart(64, '0') +
          amountInWei.padStart(64, '0'),
        gasLimit: '0x' + (100000).toString(16),
      }

      // Send transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      })

      toast.success('Transaction sent! Waiting for confirmation...')

      return txHash
    } catch (error) {
      console.error('Error sending USDT:', error)
      if (error.code === 4001) {
        toast.error('Transaction rejected by user')
      } else {
        toast.error('Failed to send transaction')
      }
      return null
    } finally {
      setIsSending(false)
    }
  }

  // Detect MetaMask + restore connection
  useEffect(() => {
    if (typeof window === 'undefined') return
    const { ethereum } = window

    if (ethereum && ethereum.isMetaMask) {
      setIsMetamaskInstalled(true)

      const handleAccountsChanged = async (accounts) => {
        if (!accounts || accounts.length === 0) {
          setAccount(null)
          setBalanceInUsdt(0)
          return
        }
        setAccount(accounts[0])
        await fetchWalletBalances(accounts[0])
      }

      const handleChainChanged = (chainIdHex) => {
        setChainId(chainIdHex)
        if (account) {
          fetchWalletBalances(account)
        }
      }

      // Restore previously connected account and chain
      ethereum
        .request({ method: 'eth_accounts' })
        .then(async (accounts) => {
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0])
            await fetchWalletBalances(accounts[0])
          }
        })
        .catch(() => {})

      ethereum
        .request({ method: 'eth_chainId' })
        .then((id) => {
          setChainId(id)
        })
        .catch(() => {})

      // listeners
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('chainChanged', handleChainChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
          ethereum.removeListener('chainChanged', handleChainChanged)
        }
      }
    } else {
      setIsMetamaskInstalled(false)
    }
  }, [])

  // MetaMask helpers
  const connectWallet = async () => {
    if (!window?.ethereum) {
      toast.error('MetaMask not found. Please install it first.')
      return
    }
    try {
      setIsConnecting(true)

      // First switch to BSC network
      const switched = await switchToBSCNetwork()
      if (!switched) {
        setIsConnecting(false)
        return
      }

      // Then request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0])
        await fetchWalletBalances(accounts[0])
        const id = await window.ethereum.request({ method: 'eth_chainId' })
        setChainId(id)
        toast.success('Wallet connected to BSC!')
      }
    } catch (err) {
      if (err?.code === 4001) {
        toast.info('Connection request rejected.')
      } else {
        toast.error('Failed to connect wallet.')
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectLocal = () => {
    setAccount(null)
    setBalanceInUsdt(0)
    toast.info(
      'Disconnected locally. To fully disconnect, remove this site in MetaMask > Connected sites.',
    )
  }

  const formatAddress = (addr) => (addr ? addr : '-')

  const chainLabel = chainId === BSC_CHAIN_ID ? BSC_CHAIN_NAME : chainId || '-'

  const unApprovedRows =
    rentWalletData?.unApWithrentwallet?.filter(
      (row) => row.trStatus === 0 && row.transType === 'Withdrawal',
    ) || []

  const mappedRows = unApprovedRows.map((row) => ({
    id: row.ID, // ✅ Corrected: Use ID from API response
    AuthLogin: row.AuthLogin,
    FullName: row.FullName,
    Email: row.Email,
    payMode: row.payMode,
    transType: row.transType,
    trCode: row.trCode,
    Wallet: row.Wallet,
    credit: row.credit,
    debit: row.debit,
    Request: row.Request,
    Charges: row.Charges,
    Release: row.Release,
    CreatedDate: row.CreatedDate,
    ApprovalDate: row.ApprovalDate,
    Remark: row.Remark,
    originalRow: row,
  }))

  // Filter rows based on search term
  const filteredRows = mappedRows.filter((row) => {
    const term = searchTerm.toLowerCase()
    return (
      row.AuthLogin?.toLowerCase().includes(term) ||
      row.FullName?.toLowerCase().includes(term) ||
      row.payMode?.toLowerCase().includes(term) ||
      row.ExtraRemark?.toLowerCase().includes(term) ||
      row.credit?.toString().includes(searchTerm) ||
      row.debit?.toString().includes(searchTerm) ||
      row.Request?.toString().includes(searchTerm)
    )
  })

  const rowsToDisplay = searchTerm ? filteredRows : mappedRows
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

  // ✅ Corrected: Properly set selected request
  const handleApproveClick = (authLoginId, id) => {
    setSelectedRequest({ authLoginId, id })
    setApprovePopupOpen(true)
  }

  const handleApproveUSDTClick = async (row) => {
    if (!account) {
      toast.error('Please connect your MetaMask wallet first')
      return
    }

    if (chainId !== BSC_CHAIN_ID) {
      toast.error(`Please switch to ${BSC_CHAIN_NAME} in your wallet`)
      return
    }

    // ✅ Fetch balances
    const { usdt } = await fetchWalletBalances(account)

    // ✅ Ensure enough USDT for transfer
    if (usdt < row.Release) {
      toast.error(`Insufficient USDT Balance!`)
      return
    }

    try {
      setIsSending(true)
      toast.info('Please confirm the transaction in MetaMask...', {
        autoClose: 1000,
      })

      const txHash = await sendUSDTTransaction(row.Wallet, row.Release)

      if (txHash) {
        await dispatch(
          updateRentWalletAdressUSDT({
            authLoginId: row.AuthLogin,
            debit: row.Release,
            wallet: row.Wallet,
            transHash: txHash,
          }),
        )
        // ✅ FIXED: Use row.id instead of row.AuthLogin
        setProcessedRequests(prev => new Set([...prev, row.id]));
        toast.success('USDT Transaction Approved Successfully!')
      }
    } catch (error) {
      console.error('Error approving USDT:', error)
      toast.error(
        error.code === 4001
          ? 'Transaction rejected by Admin'
          : 'Failed to approve USDT transaction',
      )
    } finally {
      setIsSending(false)
    }
  }

  // ✅ Corrected: Properly set selected request
  const handleRejectClick = (authLoginId, id) => {
    setSelectedRequest({ authLoginId, id })
    setRejectPopupOpen(true)
  }

  const handleApprove = async () => {
    if (selectedRequest.authLoginId && selectedRequest.id) {
        try {
            await dispatch(
                updateRentWithdrawRequestStatusAdmin({
                    authLoginId: selectedRequest.authLoginId,
                    id: selectedRequest.id,
                    rfstatus: 1,
                    remark: 'Approved by admin',
                }),
            )
            // ✅ FIXED: Use selectedRequest.id instead of selectedRequest.authLoginId
            setProcessedRequests(prev => new Set([...prev, selectedRequest.id]));
            setApprovePopupOpen(false)
            setSelectedRequest({ authLoginId: null, id: null })
            toast.success('Approved Successfully!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            
        } catch (error) {
            console.error('Approve error:', error)
            toast.error('Failed to approve request', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    }
  }

  const handleReject = async () => {
    if (selectedRequest.authLoginId && selectedRequest.id && remark.trim()) {
        try {
            await dispatch(
                updateRentWithdrawRequestStatusAdmin({
                    authLoginId: selectedRequest.authLoginId,
                    id: selectedRequest.id,
                    rfstatus: 2,
                    remark: remark,
                }),
            )
            // ✅ FIXED: Use selectedRequest.id instead of selectedRequest.authLoginId
            setProcessedRequests(prev => new Set([...prev, selectedRequest.id]));
            setRejectPopupOpen(false)
            setSelectedRequest({ authLoginId: null, id: null })
            setRemark('')
            toast.success('Rejected Successfully!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            
        } catch (error) {
            console.error('Reject error:', error)
            toast.error('Failed to reject request', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
        }
    } else {
        toast.error('Please enter a remark for rejection')
    }
  }

  const handleCancel = () => {
    setApprovePopupOpen(false)
    setRejectPopupOpen(false)
    setSelectedRequest({ authLoginId: null, id: null })
    setRemark('')
  }

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
    <div className="max-w-6xl p-5 mx-auto bg-white border border-blue-100 shadow-2xl mt-0mb-10 rounded-2xl">
      <div className="flex flex-col gap-4 p-4 mb-6 border border-orange-200 shadow-sm md:flex-row md:items-center md:justify-between rounded-2xl bg-gradient-to-r from-orange-50 via-orange-100 to-orange-50">
        <div className="flex flex-col text-sm md:flex-row md:items-center md:gap-4">
          {!isMetamaskInstalled ? (
            <span className="text-gray-700">
              MetaMask not detected.{' '}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-orange-600 underline transition hover:text-orange-800"
              >
                Install MetaMask
              </a>
            </span>
          ) : account ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-medium text-gray-700">Connected :</span>
              <div className="flex items-center gap-2 px-3 py-1 bg-white border shadow-md rounded-xl">
                <span
                  className="font-mono text-xs text-gray-800"
                  title={account}
                >
                  {formatAddress(account)}
                </span>
                <button
                  onClick={() => copyToClipboard(account)}
                  className="p-1 text-gray-500 transition hover:text-gray-700"
                  title="Copy address"
                >
                  <FaCopy className="w-3 h-3" />
                </button>
              </div>
              {account && (
                <div className="flex flex-col ml-2">
                  <span className="font-semibold text-green-600 text-md">
                   💰 Wallet Balance: ${Number(balanceInUsdt).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-700">Wallet not connected.</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          {!isMetamaskInstalled ? (
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-sm font-semibold text-white transition bg-orange-600 shadow-md rounded-xl hover:bg-orange-700"
            >
              Install MetaMask
            </a>
          ) : account ? (
            <>
              {chainId !== BSC_CHAIN_ID && (
                <button
                  onClick={switchToBSCNetwork}
                  className="px-4 py-2 text-sm font-semibold text-white transition bg-yellow-600 shadow-md rounded-xl hover:bg-yellow-700"
                >
                  Switch to BSC
                </button>
              )}
              <button
                onClick={disconnectLocal}
                className="px-4 py-2 text-sm font-semibold text-gray-700 transition bg-gray-200 shadow-sm rounded-xl hover:bg-gray-300"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-md transition ${
                isConnecting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {isConnecting ? 'Connecting…' : 'Connect to BSC'}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <h6 className="heading">
          Yield Request:{' '}
            <span className="text-green-600">
             ${Number(totalRelease.toFixed(2))}
          </span>
        </h6>
         

        <div className="grid grid-cols-1 gap-6 mt-0 mb-6 md:grid-cols-2 lg:grid-cols-4">
          {/* From Date */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-blue-800">
              From Date
            </label>
            <div className="relative">
              <span className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2">
                <FaCalendarAlt />
              </span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          {/* To Date */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-blue-800">
              To Date
            </label>
            <div className="relative">
              <span className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2">
                <FaCalendarAlt />
              </span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          {/* User ID */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-blue-800">
              User ID
            </label>
            <div className="relative">
              <span className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2">
                <FaUser />
              </span>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              />
            </div>
            {userError && (
              <p className="mt-1 text-sm text-red-600">{userError}</p>
            )}
          </div>

          {/* Username */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-blue-800 cursor-not-allowed">
              Username
            </label>
            <div className="relative">
              <span className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2">
                <FaIdBadge />
              </span>
              <input
                type="text"
                value={username}
                readOnly
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 bg-gray-50"
              />
            </div>
          </div>

          {/* Buttons */}
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

      {hasSearched && (
        <>
          {loading ? (
            <div className="py-10 text-center">Loading...</div>
          ) : error ? (
            <div className="py-10 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-center border-collapse">
                  {/* Table Header */}
                  <thead className="text-white bg-blue-600">
                    <tr>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">
                      Sr.No.
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">
                      Action
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">
                      Action
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">
                      UserId
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">
                      Username
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">
                      Wallet Address
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">
                      Request ($)
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">
                      Charges ($)
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">
                      Release ($)
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">
                      Date
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">
                      Remark
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border-b border-blue-500 rounded-tr-lg th-wrap-text">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={16}
                        className="px-4 py-3 font-medium td-wrap-text"
                      >
                        {searchTerm
                          ? 'No matching requests found'
                          : 'No Unapproved Requests Found'}
                      </td>
                    </tr>
                  ) : (
                    paginatedRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={
                          idx % 2 === 0
                            ? 'bg-blue-50 hover:bg-blue-100 transition'
                            : 'bg-white hover:bg-blue-50 transition'
                        }
                      >
                        <td className="px-4 py-3 font-medium border td-wrap-text">
                          {startItem + idx}
                        </td>
                        <td className="px-4 py-3 font-medium border td-wrap-text">
                            <button
                              className={`px-4 py-3 font-medium rounded-full td-wrap-text ${
                                processedRequests.has(row.id)
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  : 'bg-green-100 hover:bg-green-200'
                              }`}
                              onClick={() => handleApproveUSDTClick(row)}
                              disabled={
                                processedRequests.has(row.id) ||
                                !account ||
                                chainId !== BSC_CHAIN_ID ||
                                isSending
                              }
                              title={
                                processedRequests.has(row.id)
                                  ? 'Already processed'
                                  : !account
                                    ? 'Connect wallet first'
                                    : chainId !== BSC_CHAIN_ID
                                      ? 'Switch to BSC network'
                                      : ''
                              }
                            >
                              {processedRequests.has(row.id) 
                                ? 'Approved USDT' 
                                : 'Approve USDT'}
                            </button>
                          </td>
                       <td className="px-4 py-3 font-medium border td-wrap-text">
                            <div className="flex items-center justify-center gap-1">
                                <button
                                  className={`px-4 py-3 rounded-full ${
                                    processedRequests.has(row.id)
                                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                      : 'text-blue-500 bg-green-100 hover:text-blue-700 hover:bg-green-200'
                                  }`}
                                  onClick={() => handleApproveClick(row.AuthLogin, row.id)}
                                  disabled={processedRequests.has(row.id)}
                                  title={processedRequests.has(row.id) ? 'Already processed' : ''}
                                >
                                  {processedRequests.has(row.id) ? 'Approved' : 'Approve'}
                                </button>
                            </div>
                          </td>
                        <td className="px-4 py-3 font-medium border td-wrap-text">
                          {row.AuthLogin || '-'}
                        </td>
                        <td className="px-4 py-3 font-medium border td-wrap-text">
                          {row.FullName || '-'}
                        </td>
                        <td className="px-4 py-3 font-medium border td-wrap-text">
                          {row.Email || '-'}
                        </td>
                        <td className="px-4 py-3 font-medium border td-wrap-text">
                          <div className="flex items-center justify-center gap-1 group">
                           {row.Wallet || '-'}
                            {row.Wallet && (
                              <button
                                onClick={() => copyToClipboard(row.Wallet)}
                                className="p-1 text-blue-500 hover:text-blue-700"
                                title="Copy to Clipboard"
                              >
                                <FaCopy className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium border td-wrap-text">
                          {row.Request}
                        </td>
                        <td className="px-4 py-3 font-medium border td-wrap-text">
                          {row.Charges || '-'}
                        </td>
                        <td className="px-4 py-3 font-medium border td-wrap-text">
                          {row.Release || '-'}
                        </td>
                        <td className="px-4 py-3 font-medium border td-wrap-text">
                          {row.CreatedDate
                            ? row.CreatedDate.split('T')[0]
                            : '-'}
                        </td>
                        <td className="px-4 py-3 font-medium border td-wrap-text">
                          {row.Remark || '-'}
                        </td>

                        <td className="px-4 py-3 font-medium border td-wrap-text">
                          <button
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              processedRequests.has(row.id)
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-red-100 hover:bg-red-200'
                            }`}
                            onClick={() => handleRejectClick(row.AuthLogin, row.id)}
                            disabled={processedRequests.has(row.id)}
                            title={processedRequests.has(row.id) ? 'Already processed' : 'Reject request'}
                          >
                            {processedRequests.has(row.id) ? 'Rejected' : 'Reject'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {rowsToDisplay.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Rows per page:
                    </span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value))
                        setCurrentPage(1)
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`p-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
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

      {/* Approve Popup Modal */}
      {approvePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-4 text-lg font-semibold text-gray-800">
              Do you want to approve AuthLoginID{' '}
              <span className="text-blue-600">{selectedRequest.authLoginId}</span>?
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleApprove}
                className="px-4 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700"
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Popup Modal */}
      {rejectPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-4 text-lg font-semibold text-gray-800">
              Do you want to reject AuthLoginID{' '}
              <span className="text-blue-600">{selectedRequest.authLoginId}</span>?
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Remark (Required)
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter rejection reason..."
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleReject}
                className={`px-4 py-2 font-semibold text-white rounded ${!remark.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                disabled={!remark.trim()}
              >
                Submit
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
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

export default RentRequest