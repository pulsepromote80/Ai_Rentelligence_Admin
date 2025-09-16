
"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRentWallet, updateRentWithdrawRequestStatusAdmin,updateRentWalletAdressUSDT } from '@/app/redux/fundManagerSlice';
import { usernameLoginId } from "@/app/redux/adminMasterSlice";
import { toast } from 'react-toastify';
import { FaCopy } from 'react-icons/fa';
import { ethers } from "ethers";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const RentRequest = () => {
  const dispatch = useDispatch();
  const { rentWalletData, loading, error } = useSelector((state) => state.fundManager);
  
  // MetaMask state
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
const [usdBalance, setUsdBalance] = useState('0.00');
  const [isSending, setIsSending] = useState(false);
  const [balanceInUsdt, setBalanceInUsdt] = useState(0)

  // Table state
  const [approvePopupOpen, setApprovePopupOpen] = useState(false);
  const [rejectPopupOpen, setRejectPopupOpen] = useState(false);
  const [selectedAuthLoginId, setSelectedAuthLoginId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(500);
  const [remark, setRemark] = useState('');
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

  const totalRelease = rentWalletData?.unApWithrentwallet?.reduce(
    (sum, txn) => sum + (Number(txn.Release) || 0),
    0
  ) || 0;
  // BSC chain configuration
  const BSC_CHAIN_ID = '0x38'; // BSC Mainnet
  const BSC_CHAIN_NAME = 'BNB Smart Chain';
  const BSC_RPC_URL = 'https://bsc-dataseed.binance.org/';
  const BSC_CURRENCY_SYMBOL = 'BNB';
  const BSC_BLOCK_EXPLORER_URL = 'https://bscscan.com';

   const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

  // USDT Contract Details (BEP-20)
  const USDT_CONTRACT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955';
  const USDT_DECIMALS = 18;

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

  // useEffect(() => {
  //   dispatch(getRentWallet());
  // }, [dispatch]);
   const handleSearch = () => {
      const payload = {
        authLogin: userId || "",
        fromDate: formatDate(fromDate) || "",
        toDate: formatDate(toDate) || "",
      };
  
      dispatch(getRentWallet(payload));
      setHasSearched(true);
    };

     const handleExport = () => {
        if (!rentWalletData?.unApWithrentwallet || rentWalletData?.unApWithrentwallet?.length === 0) {
          alert("No data available to export");
          return;
        }
      
        const worksheet = XLSX.utils.json_to_sheet(
          rentWalletData?.unApWithrentwallet?.map((txn, index) => ({
            "Sr.No.": index + 1,
            Username: txn.AuthLogin,
            Name: txn.FullName,
            Email:txn.Email,
            Request: `$${txn.Request}`,
            Release:`$${txn.Release}`,
            Charges: txn.Charges ? `$${txn.Charges}` : "$0",
            WalletAddress:txn.Wallet,
            Remark: txn.Remark,
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
  // Function to fetch BSC wallet balance
  const fetchWalletBalances = async (accountAddress) => {
      try {
        const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
  
        // BNB balance
        const balanceWei = await provider.getBalance(accountAddress);
        const balanceInBnb = parseFloat(ethers.formatEther(balanceWei));
  
        // USDT balance - FIXED calculation
        const usdtContract = new ethers.Contract(
          USDT_CONTRACT_ADDRESS,
          ERC20_ABI,
          provider
        );
        
        const usdtRaw = await usdtContract.balanceOf(accountAddress);
        
        // USDT has 18 decimals on BSC, so we need to divide by 10^18
        const usdtBalance = parseFloat(ethers.formatUnits(usdtRaw, 18));
        
        // Set the USDT balance to state
        setBalanceInUsdt(usdtBalance);
  
        // Calculate total USD value (just USDT for now)
        const totalUsdValue = usdtBalance;
        setUsdBalance(totalUsdValue.toFixed(2));
  
        return {  usdt: usdtBalance };
      } catch (error) {
        console.error("Error fetching balances:", error);
        setUsdBalance('0.00');
        setBalanceInUsdt(0);
        return { bnb: 0, usdt: 0 };
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
        to: USDT_CONTRACT_ADDRESS,
        from: account,
        value: '0x0',
        data: 
          '0xa9059cbb' + 
          toAddress.toLowerCase().replace('0x', '').padStart(64, '0') + 
          amountInWei.padStart(64, '0'),
        gasLimit: '0x' + (100000).toString(16),
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
          setBalanceInUsdt(0);
          return;
        }
        setAccount(accounts[0]);
        await fetchWalletBalances(accounts[0]);
      };

      const handleChainChanged = (chainIdHex) => {
        setChainId(chainIdHex);
        if (account) {
          fetchWalletBalances(account);
        }
      };

      // Restore previously connected account and chain
      ethereum
        .request({ method: 'eth_accounts' })
        .then(async (accounts) => {
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
            await fetchWalletBalances(accounts[0]);
          }
        })
        .catch(() => {});

      ethereum
        .request({ method: 'eth_chainId' })
        .then((id) => {
          setChainId(id);
        })
        .catch(() => {});

      // listeners
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
        await fetchWalletBalances(accounts[0]);
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
    setBalanceInUsdt(0);
    toast.info('Disconnected locally. To fully disconnect, remove this site in MetaMask > Connected sites.');
  };

  const formatAddress = (addr) => (addr ? addr : '-');

  const chainLabel = chainId === BSC_CHAIN_ID ? BSC_CHAIN_NAME : (chainId || '-');

 
 
  const unApprovedRows = rentWalletData?.unApWithrentwallet?.filter(
  row => row.trStatus === 0 && row.transType === "Withdrawal"
) || [];
  
  const mappedRows = unApprovedRows.map(row => ({
    AuthLogin: row.AuthLogin,
    FullName: row.FullName,
    Email:row.Email,
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
    originalRow: row
  }));

  // Filter rows based on search term
  const filteredRows = mappedRows.filter(row => {
    const term = searchTerm.toLowerCase();
    return (
      (row.AuthLogin?.toLowerCase().includes(term)) ||
      (row.FullName?.toLowerCase().includes(term)) ||
      (row.payMode?.toLowerCase().includes(term)) ||
      (row.ExtraRemark?.toLowerCase().includes(term)) ||
      (row.credit?.toString().includes(searchTerm)) ||
      (row.debit?.toString().includes(searchTerm)) ||
      (row.Request?.toString().includes(searchTerm))
    );
  });

  const rowsToDisplay = searchTerm ? filteredRows : mappedRows;
  const paginatedRows = rowsToDisplay.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(rowsToDisplay.length / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, rowsToDisplay.length);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleApproveClick = (authLoginId) => {
    setSelectedAuthLoginId(authLoginId);
    setApprovePopupOpen(true);
  };

  const handleApproveUSDTClick = async (row) => {
    if (!account) {
      toast.error('Please connect your MetaMask wallet first');
      return;
    }
  
    if (chainId !== BSC_CHAIN_ID) {
      toast.error(`Please switch to ${BSC_CHAIN_NAME} in your wallet`);
      return;
    }
  
    // ✅ Fetch balances
    const {  usdt } = await fetchWalletBalances(account);
  
    // ✅ Ensure enough USDT for transfer
    if (usdt < row.Release) {
      toast.error(`Insufficient USDT Balance!`);
      return;
    }
  
    // ✅ Ensure enough BNB for gas
    // if (bnb < row.Release) { // ~small gas buffer
    //   toast.error(`Insufficient BNB for gas fees!`);
    //   return;
    // }
  
    try {
      setIsSending(true);
      toast.info('Please confirm the transaction in MetaMask...', { autoClose: 1000 });
  
      const txHash = await sendUSDTTransaction(row.Wallet, row.Release);
  
      if (txHash) {
        await dispatch(updateRentWalletAdressUSDT({
          authLoginId: row.AuthLogin,
          debit: row.Release,
          wallet: row.Wallet,
          transHash: txHash,
        }));
  
        toast.success('USDT Transaction Approved Successfully!');
          dispatch(getRentWallet({
          authLogin: userId || "",
          fromDate: formatDate(fromDate) || "",
          toDate: formatDate(toDate) || "",
        }));
      }
    } catch (error) {
      console.error('Error approving USDT:', error);
      toast.error(error.code === 4001 ? 'Transaction rejected by Admin' : 'Failed to approve USDT transaction');
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
        await dispatch(updateRentWithdrawRequestStatusAdmin({
          authLoginId: selectedAuthLoginId,
          rfstatus: 1,
          remark: "Approved by admin"
        }));
        setApprovePopupOpen(false);
        setSelectedAuthLoginId(null);
        toast.success('Approved Successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
         dispatch(getRentWallet({
          authLogin: userId || "",
          fromDate: formatDate(fromDate) || "",
          toDate: formatDate(toDate) || "",
        }));
      } catch (error) {
        toast.error('Failed to approve request', {
          position: "top-right",
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
        await dispatch(updateRentWithdrawRequestStatusAdmin({
          authLoginId: selectedAuthLoginId,
          rfstatus: 2,
          remark: remark
        }));
        setRejectPopupOpen(false);
        setSelectedAuthLoginId(null);
        setRemark('');
        toast.success('Rejected Successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
         dispatch(getRentWallet({
          authLogin: userId || "",
          fromDate: formatDate(fromDate) || "",
          toDate: formatDate(toDate) || "",
        }));
      } catch (error) {
        toast.error('Failed to reject request', {
          position: "top-right",
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
      {/* MetaMask Wallet Connection Section */}
      <div className="flex flex-col gap-2 p-3 mb-6 border border-orange-200 rounded-xl bg-orange-50 md:flex-row md:items-center md:justify-between">
        <div className="text-sm">
          {!isMetamaskInstalled ? (
            <span className="text-gray-700">
              MetaMask not detected.{" "}
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
              {/* <span className="text-gray-700">Connected to {chainLabel}:</span> */}
              <span className="text-gray-700">Connected :</span>
              <div className="flex items-center gap-2 px-2 py-1 bg-white border rounded shadow-sm">
                <span
                  className="font-mono text-xs"
                  title={account}
                >
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
             {account && (
                <div className="flex flex-col ml-2">
                  <span className="font-semibold text-green-600 text-md">
                    Wallet Balance: ${Number(balanceInUsdt).toFixed(2)}
                  </span>
                </div>
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

      <div className="flex items-center justify-between mb-6">
        <h1 className="w-full text-2xl font-bold text-center text-gray-700">Yield Request: ${Number(totalRelease.toFixed(2))}</h1>

        {/* Search Box */}
       
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

  {/* Search Button row */}
<div className="flex items-end space-x-4">
  <button
    onClick={handleSearch}
    className="w-32 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 whitespace-nowrap"
  >
    Search
  </button>
  <button
    onClick={handleExport}
    className="w-32 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 whitespace-nowrap"
  >
    Export Excel
  </button>
  <button
    onClick={handleRefresh}
    className="w-32 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 whitespace-nowrap"
  >
    Refresh
  </button>
</div>
</div>
{hasSearched && (
        <>
      {loading ? (
        <div className="py-10 text-center">Loading...</div>
      ) : error ? (
        <div className="py-10 text-center text-red-500">{error}</div>
      ) : (
        <div className="mt-4 overflow-x-auto border border-blue-100 shadow-lg rounded-xl bg-white/90">
          <table className="min-w-full border border-gray-200 rounded-xl">
            <thead className="sticky top-0 z-10 text-white bg-blue-500">
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-center border rounded-tl-lg">Sr.No.</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Action</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Action</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">UserId</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Username</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Email</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Wallet Address</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Request ($)</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Charges ($)</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Release ($)</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Date</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Remark</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border rounded-tr-lg">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={16} className="py-10 text-lg text-center text-gray-400">
                    {searchTerm ? 'No matching requests found' : 'No Unapproved Requests Found'}
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-50 transition'}
                  >
                    <td className="px-4 py-2 text-sm font-medium text-center text-gray-700 border">{startItem + idx}</td>
                    <td className="px-4 py-2 text-sm text-center">
                      <button
                        className="px-3 py-1 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
                        onClick={() => handleApproveUSDTClick(row)}
                        disabled={!account || chainId !== BSC_CHAIN_ID || isSending}
                        title={!account ? "Connect wallet first" : chainId !== BSC_CHAIN_ID ? "Switch to BSC network" : ""}
                      >
                        Approve USDT
                      </button>
                    </td>
                    <td className="px-4 py-2 text-sm text-center">
                      <button
                        className="px-3 py-1 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
                        onClick={() => handleApproveClick(row.AuthLogin)}
                      >
                        Approve
                      </button>
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.AuthLogin || '-'}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.FullName || '-'}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.Email || '-' }</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      <div className="flex items-center justify-center gap-1 group">
                        <span
                          className="cursor-pointer"
                          title={row.Wallet || '-'}
                        >
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
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.Request}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.Charges || '-'}</td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.Release || '-'}</td>
                     <td className="px-4 py-2 text-sm text-center text-gray-700 border">
  {row.CreatedDate ? row.CreatedDate.split("T")[0] : "-"}
</td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 border">{row.Remark || '-'}</td>
                   
                    <td className="px-4 py-2 text-sm text-center">
                      <button
                        className="px-3 py-1 font-semibold text-white bg-red-500 rounded hover:bg-red-600"
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
      )}
      </>
      )}

      {/* Approve Popup Modal */}
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

export default RentRequest;