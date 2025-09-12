"use client";
import { useState, useEffect } from "react";
import { getAccStatemtnt, usernameLoginId } from "@/app/redux/adminMasterSlice";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

const Statement = () => {
  const dispatch = useDispatch();
  const accStatementData = useSelector(
    (state) => state.adminMaster?.accStatementData?.data
  );
  const { usernameData } = useSelector((state) => state.adminMaster);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(500);
  const [currentPage, setCurrentPage] = useState(1);
  const [userError, setUserError] = useState("");
   const [hasSearched, setHasSearched] = useState(false);


  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentData = accStatementData?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(accStatementData?.length / entriesPerPage);


  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  // credit aur debit ka total nikalne ke liye reduce use karo
  const totalCredit = accStatementData?.reduce(
    (sum, txn) => sum + (txn.Credit || 0),
    0
  ) || 0;

  const totalDebit = accStatementData?.reduce(
    (sum, txn) => sum + (txn.Debit || 0),
    0
  ) || 0;




  // Wallet type ko backend ke hisaab se map karna hoga
  const getWalletType = (wallet) => {
    switch (wallet) {
      case "Income":
        return 1;
      case "DepositWallet":
        return 2;
      case "RentWallet":
        return 3;
      default:
        return 0;
    }
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
      transtype: transactionType || "",
      fromDate: formatDate(fromDate) || "",
      toDate: formatDate(toDate) || "",
      wtype: getWalletType(selectedWallet),
    };

    dispatch(getAccStatemtnt(payload));
    setHasSearched(true);
  };




  const handleExport = () => {
    if (!accStatementData || accStatementData.length === 0) {
      alert("No data available to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      accStatementData.map((txn, index) => ({
        "Sr.No.": index + 1,
        Username: txn.AuthLogin,
        Name: txn.FullName,
        Credit: `$${txn.Credit}`,
        Debit: `$${txn.Debit}`,
        RequestedDate: txn.CreatedDate ? txn.CreatedDate.split("T")[0] : "",
        ApprovalDate: txn.ApprovalDate ? txn.ApprovalDate.split("T")[0] : "",
        TransType: txn.TransType,
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


  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Filters Section */}
        <div className="p-6 mb-6 bg-white rounded-lg shadow">
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="mb-4 text-lg font-semibold text-gray-700">Wallet Statement</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    ${Number(totalCredit).toFixed(2)}
                  </p>
                  <p className="text-gray-600">Total Credit</p>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    ${Number(totalDebit).toFixed(2)}
                  </p>
                  <p className="text-gray-600">Total Debit</p>
                </div>
              </div>
            </div>
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
                Select Wallet
              </label>
              <select
                value={selectedWallet}
                onChange={(e) => setSelectedWallet(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              >
                <option value="">-Select Wallet-</option>
                <option value="Income">Income Wallet</option>
                <option value="DepositWallet">Deposit Wallet</option>
                <option value="RentWallet">Rent Wallet</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-blue-800">
                Transaction Type
              </label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
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
          </div>

          {/* Buttons center aligned */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={handleSearch}
              className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Search
            </button>
            <button
              onClick={handleExport}
              className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
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


        {/* Transactions Table */}
        {hasSearched  && accStatementData?.length > 0 && (
          <div className="mt-6 overflow-hidden bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-xl">
                <thead className="text-blue-900 bg-gradient-to-r from-blue-200 to-blue-400">
                  <tr>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700 border">
                      Sr.No.
                    </th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700 border">
                      Username
                    </th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700 border">
                      Name
                    </th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700 border">
                      Credit
                    </th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700 border">
                      Debit
                    </th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700 border">
                      Requested Date
                    </th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700 border">
                      Approval Date
                    </th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700 border">
                      TransType
                    </th>
                    <th className="px-4 py-2 text-sm font-semibold text-gray-700 border">
                      Remark
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((transaction, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                        {transaction.AuthLogin}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                        {transaction.FullName}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-green-700 border">
                        ${transaction.Credit}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-red-700 border">
                        ${transaction.Debit}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                        {transaction.CreatedDate ? transaction.CreatedDate.split("T")[0] : "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                        {transaction.ApprovalDate ? transaction.ApprovalDate.split("T")[0] : "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                        {transaction.TransType}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                        {transaction.Remark}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* Footer rows per page */}
            <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-600 border-t">
              <p>
                Rows per page:{" "}
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1); // reset to first page
                  }}
                  className="px-2 py-1 ml-2 border rounded"
                >
                  <option value={10}>500</option>
                  <option value={25}>1000</option>
                  <option value={50}>1500</option>
                </select>
              </p>

              <p>
                {indexOfFirstItem + 1}–
                {Math.min(indexOfLastItem, accStatementData.length)} of{" "}
                {accStatementData.length}
              </p>

              {/* Pagination arrows */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 rounded ${currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600"
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        )}


      </div>
    </div>
  );
};

export default Statement;
