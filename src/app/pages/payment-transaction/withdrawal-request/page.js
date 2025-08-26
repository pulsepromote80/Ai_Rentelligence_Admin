
"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllIncomeRequestAdmin, UpIncomeWithdReqStatusAdmin, updateIncomeWalletAdressUSDT } from '@/app/redux/fundManagerSlice';
import { toast } from 'react-toastify';
import { FaCopy } from 'react-icons/fa';

const WithdrawalRequest = () => {
  const dispatch = useDispatch();
  const { withdrawRequestData, loading, error } = useSelector((state) => state.fundManager);

  // MetaMask state
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [isSending, setIsSending] = useState(false);

  // Table state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [approvePopupOpen, setApprovePopupOpen] = useState(false);
  const [rejectPopupOpen, setRejectPopupOpen] = useState(false);
  const [selectedAuthLoginId, setSelectedAuthLoginId] = useState(null);
  const [remark, setRemark] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // BSC chain configuration
  const BSC_CHAIN_ID = '0x38'; // BSC Mainnet
  const BSC_CHAIN_NAME = 'BNB Smart Chain';
  const BSC_RPC_URL = 'https://bsc-dataseed.binance.org/';
  const BSC_CURRENCY_SYMBOL = 'BNB';
  const BSC_BLOCK_EXPLORER_URL = 'https://bscscan.com';

  // USDT Contract Details (BEP-20)
  const USDT_CONTRACT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
  const USDT_DECIMALS = 18;

  useEffect(() => {
    dispatch(getAllIncomeRequestAdmin());
  }, [dispatch]);

  // Function to fetch BSC wallet balance
  const fetchWalletBalance = async (accountAddress) => {
    if (!window.ethereum || !accountAddress) {
      console.error('MetaMask not available or account address is invalid');
      setWalletBalance('0.0000');
      return 0;
    }

    try {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accountAddress, 'latest'],
      });

      // Convert from wei to BNB
      const balanceInBnb = parseInt(balance, 16) / 1e18; 
      const formattedBalance = balanceInBnb.toFixed(4);
      setWalletBalance(formattedBalance);
      return balanceInBnb;
    } catch (error) {
      console.error('Error fetching balance:', error.message || error);
      setWalletBalance('Error');
      return 0;
    }
  };

  // Switch to BSC network
  const switchToBSCNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_CHAIN_ID }],
      });
      return true;
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
          });
          return true;
        } catch (addError) {
          console.error('Error adding BSC network:', addError);
          toast.error('Failed to add BSC network to MetaMask');
          return false;
        }
      }
      console.error('Error switching to BSC network:', switchError);
      toast.error('Failed to switch to BSC network');
      return false;
    }
  };

  // Send USDT transaction via MetaMask
  const sendUSDTTransaction = async (toAddress, amount) => {
    if (!window.ethereum || !account) {
      toast.error('MetaMask not connected');
      return null;
    }

    try {
      setIsSending(true);

      // Convert amount to wei (considering USDT has 18 decimals)
      const amountInWei = BigInt(Math.floor(amount * 10 ** USDT_DECIMALS)).toString(16);

      // Prepare transaction parameters
      const transactionParameters = {
        to: USDT_CONTRACT_ADDRESS, // USDT contract address
        from: account, // User's address
        value: '0x0', // No BNB sent
        data:
          '0xa9059cbb' +
          toAddress.toLowerCase().replace('0x', '').padStart(64, '0') +
          amountInWei.padStart(64, '0'),
        gasLimit: '0x' + (100000).toString(16), // Gas limit
      };

      // Send transaction
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      toast.success('Transaction sent! Waiting for confirmation...');

      return txHash;
    } catch (error) {
      console.error('Error sending USDT:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected by user');
      } else {
        toast.error('Failed to send transaction');
      }
      return null;
    } finally {
      setIsSending(false);
    }
  };

  // Detect MetaMask + restore connection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { ethereum } = window;

    if (ethereum && ethereum.isMetaMask) {
      setIsMetamaskInstalled(true);

      const handleAccountsChanged = async (accounts) => {
        if (!accounts || accounts.length === 0) {
          setAccount(null);
          setWalletBalance(null);
          return;
        }
        setAccount(accounts[0]);
        await fetchWalletBalance(accounts[0]); // Fetch balance after account change
      };

      const handleChainChanged = (chainIdHex) => {
        setChainId(chainIdHex);
        if (account) {
          fetchWalletBalance(account); // Refresh balance on chain change
        }
      };

      // Restore previously connected account and chain
      ethereum
        .request({ method: 'eth_accounts' })
        .then(async (accounts) => {
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            await fetchWalletBalance(accounts[0]);
          }
        })
        .catch((err) => console.error('Error fetching accounts:', err));

      ethereum
        .request({ method: 'eth_chainId' })
        .then((id) => setChainId(id))
        .catch((err) => console.error('Error fetching chainId:', err));

      // Listeners
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    } else {
      setIsMetamaskInstalled(false);
    }
  }, []);

  // MetaMask helpers
  const connectWallet = async () => {
    if (!window?.ethereum) {
      toast.error('MetaMask not found. Please install it first.');
      return;
    }
    try {
      setIsConnecting(true);

      // First switch to BSC network
      const switched = await switchToBSCNetwork();
      if (!switched) {
        setIsConnecting(false);
        return;
      }

      // Then request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        await fetchWalletBalance(accounts[0]);
        const id = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(id);
        toast.success('Wallet connected to BSC!');
      }
    } catch (err) {
      if (err?.code === 4001) {
        toast.info('Connection request rejected.');
      } else {
        toast.error('Failed to connect wallet.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectLocal = () => {
    setAccount(null);
    setWalletBalance(null);
    toast.info('Disconnected locally. To fully disconnect, remove this site in MetaMask > Connected sites.');
  };

  const formatAddress = (addr) => (addr ? addr : '-');

  const chainLabel = chainId === BSC_CHAIN_ID ? BSC_CHAIN_NAME : (chainId || '-');

  // Only show unapproved withdrawal requests
  const unApprovedRows = withdrawRequestData?.unApWithIncome || [];

  const filteredRows = unApprovedRows.filter(row =>
    (row.AuthLogin?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.FullName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.TotWithdl?.toString().includes(searchTerm)) ||
    (row.debit?.toString().includes(searchTerm)) ||
    (row.TransType?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.Wallet?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (row.PaymentDate?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const rowsToDisplay = searchTerm ? filteredRows : unApprovedRows;

  const paginatedRows = rowsToDisplay.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(rowsToDisplay.length / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, rowsToDisplay.length);

  const handleApproveClick = (authLoginId) => {
    setSelectedAuthLoginId(authLoginId);
    setApprovePopupOpen(true);
  };

  const handleApproveUSDTClick = async (row) => {
    // Check if wallet is connected
    if (!account) {
      toast.error('Please connect your MetaMask wallet first');
      return;
    }

    // Check if connected to BSC
    if (chainId !== BSC_CHAIN_ID) {
      toast.error(`Please switch to ${BSC_CHAIN_NAME} in your wallet`);
      return;
    }

    // Get current balance
    const currentBalance = await fetchWalletBalance(account);
    if (currentBalance < row.Release) {
      toast.error(`Insufficient BNB!`);
      return;
    }

    // Directly trigger MetaMask transaction
    try {
      setIsSending(true);
      toast.info('Please confirm the transaction in MetaMask...', { autoClose: 1000 });

      const txHash = await sendUSDTTransaction(row.Wallet, row.Release);

      if (txHash) {
        // Update the database with the transaction hash
        await dispatch(updateIncomeWalletAdressUSDT({
          authLoginId: row.AuthLogin,
          debit: row.Release,
          wallet: row.Wallet,
          transHash: txHash,
        }));

        toast.success('USDT Transaction Approved Successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        dispatch(getAllIncomeRequestAdmin());
      }
    } catch (error) {
      console.error('Error approving USDT:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected by Admin');
      } else {
        toast.error('Failed to approve USDT transaction');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleRejectClick = (authLoginId) => {
    setSelectedAuthLoginId(authLoginId);
    setRejectPopupOpen(true);
  };

  const handleApprove = async () => {
    if (selectedAuthLoginId) {
      try {
        await dispatch(UpIncomeWithdReqStatusAdmin({
          authLoginId: selectedAuthLoginId,
          rfstatus: 1,
          remark: 'Approved by admin',
        }));
        setApprovePopupOpen(false);
        setSelectedAuthLoginId(null);
        toast.success('Approved Successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        dispatch(getAllIncomeRequestAdmin());
      } catch (error) {
        toast.error('Failed to approve request', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const handleReject = async () => {
    if (selectedAuthLoginId && remark.trim()) {
      try {
        await dispatch(UpIncomeWithdReqStatusAdmin({
          authLoginId: selectedAuthLoginId,
          rfstatus: 2,
          remark: remark,
        }));
        setRejectPopupOpen(false);
        setSelectedAuthLoginId(null);
        setRemark('');
        toast.success('Rejected Successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        dispatch(getAllIncomeRequestAdmin());
      } catch (error) {
        toast.error('Failed to reject request', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  const handleCancel = () => {
    setApprovePopupOpen(false);
    setRejectPopupOpen(false);
    setSelectedAuthLoginId(null);
    setRemark('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to Clipboard!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="max-w-6xl p-6 mx-auto mt-8 mb-10 bg-white border border-blue-100 shadow-2xl rounded-2xl">
      {/* MetaMask Wallet Connection Section */}
      <div className="flex flex-col gap-2 p-3 mb-6 border border-orange-200 rounded-xl bg-orange-50 md:flex-row md:items-center md:justify-between">
        <div className="text-sm">
          {!isMetamaskInstalled ? (
            <span className="text-gray-700">
              MetaMask not detected.{' '}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline"
              >
                Install MetaMask
              </a>
            </span>
          ) : account ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-700">Connected :</span>
              <div className="flex items-center gap-2 px-2 py-1 bg-white border rounded shadow-sm">
                <span className="font-mono text-xs" title={account}>
                  {formatAddress(account)}
                </span>
                <button
                  onClick={() => copyToClipboard(account)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Copy address"
                >
                  <FaCopy className="w-3 h-3" />
                </button>
              </div>
              {walletBalance !== null && (
                <span className="ml-2 font-semibold text-green-600 text-md">
                  Balance: {walletBalance}
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-700">Wallet not connected.</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isMetamaskInstalled ? (
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 text-sm font-semibold text-white bg-orange-600 rounded hover:bg-orange-700"
            >
              Install MetaMask
            </a>
          ) : account ? (
            <>
              {chainId !== BSC_CHAIN_ID && (
                <button
                  onClick={switchToBSCNetwork}
                  className="px-3 py-1 text-sm font-semibold text-white bg-yellow-600 rounded hover:bg-yellow-700"
                >
                  Switch to BSC
                </button>
              )}
              <button
                onClick={disconnectLocal}
                className="px-3 py-1 text-sm font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className={`px-3 py-1 text-sm font-semibold text-white rounded ${isConnecting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}
            >
              {isConnecting ? 'Connecting…' : 'Connect to BSC'}
            </button>
          )}
        </div>
      </div>

      {/* Original Table Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="w-full mb-4 text-2xl font-bold text-center text-gray-700">Withdrawal Requests</h1>

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
                <th className="px-4 py-2 text-sm font-semibold text-center border">Action</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Action</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">User ID</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Name</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Amount ($)</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Debit ($)</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Admin Charges ($)</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Release ($)</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">TransType</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Transaction Hash</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Withdrawal Mode</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-10 text-lg text-center text-gray-400">
                    No Approve Withdrawal Requests Found
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-50 transition'}
                  >
                    <td className="px-4 py-2 text-sm font-medium text-center text-gray-700 border">
                      {startItem + idx}
                    </td>

                    <td className="px-4 py-2 text-sm text-center">
                      <button
                        className="px-3 py-1 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
                        onClick={() => handleApproveUSDTClick(row)}
                        disabled={!account || chainId !== BSC_CHAIN_ID || isSending}
                        title={
                          !account
                            ? 'Connect wallet first'
                            : chainId !== BSC_CHAIN_ID
                            ? 'Switch to BSC network'
                            : ''
                        }
                      >
                        Approve USDT
                      </button>
                    </td>

                    <td className="flex items-center px-4 py-2 space-x-2 text-sm text-center">
                      <button
                        className="px-3 py-1 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
                        onClick={() => handleApproveClick(row.AuthLogin)}
                      >
                        Approve
                      </button>
                    </td>

                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {row.AuthLogin || '-'}
                    </td>

                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {row.FullName || '-'}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {row.TotWithdl}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {row.debit}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {row.AdminCharges}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {row.Release}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {row.TransType}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      <div className="flex items-center justify-center gap-1 group">
                        <span className="cursor-pointer" title={row.Wallet || '-'}>
                          {row.Wallet ? `${row.Wallet.substring(0, 15)}...` : '-'}
                        </span>
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
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {row.withdrawalmode}
                    </td>
                    <td className="flex items-center px-4 py-2 space-x-2 text-sm text-center">
                      <button
                        className="px-3 py-1 mt-2 font-semibold text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => handleRejectClick(row.AuthLogin)}
                      >
                        Reject
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
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="p-1 mr-3 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
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
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
      )}

      {/* Approve Popup Modal (kept for non-USDT approve) */}
      {approvePopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
            <div className="mb-4 text-lg font-semibold text-gray-800">
              Do you want to approve AuthLoginID <span className="text-blue-600">{selectedAuthLoginId}</span>?
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
              Do you want to reject AuthLoginID <span className="text-blue-600">{selectedAuthLoginId}</span>?
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Remark (Required)</label>
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
  );
};

export default WithdrawalRequest;