"use client";
import { useState, useEffect } from "react";
import { getLeaseStatemtnt, usernameLoginId } from "@/app/redux/adminMasterSlice";
import { getProductList } from "@/app/redux/productSlice";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Search, FileSpreadsheet } from "lucide-react";
import { Calendar, User, UserCircle2 } from "lucide-react";
import { FaSyncAlt } from "react-icons/fa";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const LeaseStatementData = useSelector(
    (state) => state.adminMaster?.LeaseStatementData?.data || []
  );
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
    hasSearched && LeaseStatementData? LeaseStatementData.reduce((sum, txn) => sum + (txn.Rkprice || 0), 0) :0 


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
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
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
    setHasSearched(false);

    const payload = {
      authLogin: userId || "",
      productName: selectedProductName || "",
      fromDate: formatDate(fromDate) || "",
      toDate: formatDate(toDate) || "",
    };
    dispatch(getLeaseStatemtnt(payload));
  };

  return (
    <div className="p-8 mx-auto mt-2 border border-blue-100 shadow-2xl max-w-7xl bg-gradient-to-b from-white via-blue-50 to-white rounded-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h6 className="heading">Order History</h6>
        <div className="flex items-center justify-between gap-4">
          <p className="font-semibold text-green-600">
            Total Price : ${Number(totalPrice).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-6 mt-2 md:grid-cols-2 lg:grid-cols-3">
        {/* From Date */}
        <div className="relative">
          <label className="block mb-1 text-sm font-semibold text-blue-700">
            From Date
          </label>
          <div className="relative">
            <Calendar className="absolute w-5 h-5 text-blue-500 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full py-2.5 pl-12 pr-4 transition bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* To Date */}
        <div className="relative">
          <label className="block mb-1 text-sm font-semibold text-blue-700">
            To Date
          </label>
          <div className="relative">
            <Calendar className="absolute w-5 h-5 text-blue-500 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full py-2.5 pl-12 pr-4 transition bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Product Name */}
        <div className="relative">
          <label className="block mb-1 text-sm font-semibold text-blue-700">
            Select Product
          </label>
          <select
            value={selectedProductName}
            onChange={(e) => setSelectedProductName(e.target.value)}
            className="w-full py-2.5 pl-4 pr-4 transition bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-Select Product-</option>
            {productList?.map((prod, idx) => (
              <option key={idx} value={prod.productName}>
                {prod.productName}
              </option>
            ))}
          </select>
        </div>

        {/* User ID */}
        <div className="relative">
          <label className="block mb-1 text-sm font-semibold text-blue-700">
            User ID
          </label>
          <div className="relative">
            <User className="absolute w-5 h-5 text-blue-500 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={`w-full pl-12 pr-4 py-2.5 rounded-lg border shadow-sm outline-none transition
                ${userError
                  ? "border-red-500 focus:ring-red-400 focus:border-red-500 bg-red-50"
                  : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                }`}
            />
          </div>
          {userError && (
            <p className="mt-1 text-sm text-red-500">{userError}</p>
          )}
        </div>

        {/* Username */}
        <div className="relative">
          <label className="block mb-1 text-sm font-semibold text-blue-700">
            Username
          </label>
          <div className="relative">
            <UserCircle2 className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              value={username}
              readOnly
              className="w-full py-2.5 pl-12 pr-4 text-gray-600 bg-gray-100 border border-gray-300 rounded-lg shadow-sm cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-start mt-3 space-x-4 col-span-full">
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
          className="flex items-center gap-2 px-5 py-2 text-white transition bg-gray-600 shadow rounded-xl hover:bg-gray-700"
        >
          <FaSyncAlt className="w-4 h-4 animate-spin-on-hover" />
          Refresh
        </button>
      </div>

      {/* Transactions Table */}
      {hasSearched && LeaseStatementData?.length > 0 && (
        <div className="mt-6 overflow-hidden bg-white border border-gray-200 shadow-2xl rounded-2xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center text-gray-700 border-collapse">
              <thead className="text-white bg-gradient-to-r from-blue-700 to-blue-500">
                <tr>
                  <th className="px-4 py-3">Sr.No.</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Price ($)</th>
                  <th className="px-4 py-3">Lease Hour</th>
                  <th className="px-4 py-3">Duration (Months)</th>
                  <th className="px-4 py-3">Weekly ROI ($)</th>
                  <th className="px-4 py-3">Total Return </th>
                  <th className="px-4 py-3">Credit ($)</th>
                  <th className="px-4 py-3">Max Limit ($)</th>
                  <th className="px-4 py-3">Order Date</th>
                  <th className="px-4 py-3">Last Pay Date</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((txn, index) => (
                  <tr
                    key={index}
                    className={`transition-colors duration-200 ${index % 2 === 0
                        ? "bg-blue-50 hover:bg-blue-100"
                        : "bg-white hover:bg-blue-50"
                      }`}
                  >
                    <td className="px-4 py-3 font-semibold">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-2 py-2">{txn.AuthLogin}</td>
                    <td className="px-2 py-2">{txn.FullName}</td>
                    <td className="px-2 py-2">{txn.name}</td>
                    <td className="px-2 py-2 font-semibold text-green-600">
                      {txn.Rkprice}
                    </td>
                    <td className="px-2 py-2">{txn.LeaseHour}</td>
                    <td className="px-2 py-2">{txn.DurationOnMonth}</td>
                    <td className="px-2 py-2">{txn.WeeklyReturn}</td>
                    <td className="px-2 py-2">{txn.TotalReturn}</td>
                    <td className="px-2 py-2 font-semibold text-blue-600">
                      {txn.CreditAmt}
                    </td>
                    <td className="px-2 py-2">{txn.MaxLimit}</td>
                    <td className="px-2 py-2">
                      {txn.RDate ? txn.RDate.split("T")[0] : "-"}
                    </td>
                    <td className="px-2 py-2">
                      {txn.LastDatePay ? txn.LastDatePay.split("T")[0] : "-"}
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
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-1 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400"
              >
                <option value={500}>500</option>
                <option value={1000}>1000</option>
                <option value={1500}>1500</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {indexOfFirstItem + 1}–
              {Math.min(indexOfLastItem, LeaseStatementData.length)} of{" "}
              {LeaseStatementData.length}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg border transition-colors ${currentPage === 1
                    ? "text-gray-400 border-gray-200"
                    : "text-blue-600 border-gray-300 hover:bg-blue-50"
                  }`}
              >
                ‹
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg border transition-colors ${currentPage === totalPages
                    ? "text-gray-400 border-gray-200"
                    : "text-blue-600 border-gray-300 hover:bg-blue-50"
                  }`}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
