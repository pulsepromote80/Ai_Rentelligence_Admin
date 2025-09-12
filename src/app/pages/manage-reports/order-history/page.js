"use client";
import { useState, useEffect } from "react";
import { getLeaseStatemtnt, usernameLoginId } from "@/app/redux/adminMasterSlice";
import { getProductList } from '@/app/redux/productSlice';
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaWallet } from "react-icons/fa6";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const LeaseStatementData = useSelector(
    (state) => state.adminMaster?.LeaseStatementData?.data || []
  );
  const { usernameData } = useSelector((state) => state.adminMaster);
  const productList = useSelector((state) => state.product?.data ?? []);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(500);
  const [currentPage, setCurrentPage] = useState(1);
  const [userError, setUserError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const indexOfLastItem = currentPage * entriesPerPage;
  const indexOfFirstItem = indexOfLastItem - entriesPerPage;
  const currentData = LeaseStatementData?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(LeaseStatementData?.length / entriesPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const totalPrice =
    LeaseStatementData?.reduce((sum, txn) => sum + (txn.Rkprice || 0), 0) || 0;

  useEffect(() => {
    dispatch(getProductList());
  }, [dispatch]);

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
      productName: selectedProductName || "",
      fromDate: formatDate(fromDate) || "",
      toDate: formatDate(toDate) || "",
    };

    dispatch(getLeaseStatemtnt(payload));
    setHasSearched(true);
  };

  const handleExport = () => {
    if (!LeaseStatementData || LeaseStatementData.length === 0) {
      alert("No data available to export");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      LeaseStatementData.map((txn, index) => ({
        "Sr.No.": index + 1,
        Username: txn.AuthLogin,
        Name: txn.FullName,
        ProductName: txn.name,
        Price: `$${txn.Rkprice}`,
        LeaseHour: txn.LeaseHour,
        DurationMonth: txn.DurationOnMonth,
        WeeklyROI: txn.WeeklyReturn,
        TotalReturn: txn.TotalReturn,
        Credit: `$${txn.CreditAmt}`,
        MaxLimit: `$${txn.MaxLimit}`,
        OrderDate: txn.RDate ? txn.RDate.split("T")[0] : "",
        LastDatePay: txn.LastDatePay ? txn.LastDatePay.split("T")[0] : "",
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
    setSelectedProductName("");
    setUserId("");
    setUsername("");
    setUserError("");
    setCurrentPage(1);
    setHasSearched(false); // hide table
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Filters Section */}
        
          <div className="p-6 mb-6 bg-white rounded-lg shadow">
   <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
  <div className="p-6 bg-white rounded-lg shadow">
    <h2 className="mb-4 text-lg font-semibold text-gray-700">Order History</h2>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-green-600">
          ${Number(totalPrice).toFixed(2)}
        </p>
        <p className="text-gray-600">Total Price</p>
      </div>
    </div>
  </div>
</div>

          {/* Filters */}
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
                Select Product Name
              </label>
              <select
                value={selectedProductName}
                onChange={(e) => setSelectedProductName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
              >
                <option value="">-Select Product-</option>
                {productList?.map((prod, idx) => (
                  <option key={idx} value={prod.productName}>
                    {prod.productName}
                  </option>
                ))}
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
              {userError && (
                <p className="mt-1 text-sm text-red-600">{userError}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-blue-800">
                Username
              </label>
              <input
                type="text"
                value={username}
                readOnly
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center mt-6 space-x-4">
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

        {/* Transactions Table */}
        {hasSearched && LeaseStatementData?.length > 0 && (
          <div className="mt-6 overflow-hidden bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-xl">
                <thead className="text-blue-900 bg-gradient-to-r from-blue-200 to-blue-400">
                  <tr>
                    {[
                      "Sr.No.",
                      "Username",
                      "Name",
                      "Product Name",
                      "Price ($)",
                      "Lease Hour",
                      "Duration Month",
                      "Weekly ROI ($)",
                      "Total Return ($)",
                      "Credit ($)",
                      "Max. Limit ($)",
                      "Order Date",
                      "Last Date Pay",
                    ].map((col, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 border"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((transaction, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                    >
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
                        {transaction.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-green-700 border">
                        {Number(transaction.Rkprice).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                        {transaction.LeaseHour}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                        {transaction.DurationOnMonth}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                        {Number(transaction.WeeklyReturn).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                        {Number(transaction.TotalReturn).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-green-700 border">
                        {Number(transaction.CreditAmt).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                        {Number(transaction.MaxLimit).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                        {transaction.RDate
                          ? transaction.RDate.split("T")[0]
                          : "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                        {transaction.LastDatePay
                          ? transaction.LastDatePay.split("T")[0]
                          : "-"}
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
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 ml-2 border rounded"
                >
                  <option value={500}>500</option>
                  <option value={1000}>1000</option>
                  <option value={1500}>1500</option>
                </select>
              </p>

              <p>
                {indexOfFirstItem + 1}–
                {Math.min(indexOfLastItem, LeaseStatementData.length)} of{" "}
                {LeaseStatementData.length}
              </p>

              {/* Pagination */}
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-2 py-1 rounded ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600"
                  }`}
                >
                  ◀
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 rounded ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-blue-600"
                  }`}
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
