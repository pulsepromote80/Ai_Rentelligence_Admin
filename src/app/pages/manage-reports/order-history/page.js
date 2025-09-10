"use client";
import { useState, useEffect } from "react";
import { getLeaseStatemtnt, usernameLoginId } from "@/app/redux/adminMasterSlice";
import { getProductList } from '@/app/redux/productSlice';
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import ImagePopup from "@/app/pages/image-popup/page";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const LeaseStatementData = useSelector(
    (state) => state.adminMaster?.LeaseStatementData?.data
  );
  const { usernameData } = useSelector((state) => state.adminMaster);
  const  productList  = useSelector((state) => state.product?.data ?? []);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedProductName, setSelectedProductName] = useState(""); 
  const [productName, setproductName] = useState("");
  const [userId, setUserId] = useState(""); 
  const [username, setUsername] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [userError, setUserError] = useState("");

  
const indexOfLastItem = currentPage * entriesPerPage;
const indexOfFirstItem = indexOfLastItem - entriesPerPage;
const currentData = LeaseStatementData?.slice(indexOfFirstItem, indexOfLastItem);

const totalPages = Math.ceil(LeaseStatementData?.length / entriesPerPage);


  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const totalPrice = LeaseStatementData?.reduce(
  (sum, txn) => sum + (txn.Rkprice || 0),
  0
) || 0;

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
      productName: selectedProductName  || "",
      fromDate: formatDate(fromDate) || "",
      toDate: formatDate(toDate) || "",
    };

    dispatch(getLeaseStatemtnt(payload));
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
      Price: txn.Rkprice,
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
  </div>
</div>


{/* Transactions Table */}
{LeaseStatementData && LeaseStatementData.length > 0 ? (
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
              Product Name
            </th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-700 border">
              Price
            </th>
            <th className="px-4 py-2 text-sm font-semibold text-gray-700 border">
              Image
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
        ${transaction.name}
      </td>
      <td className="px-4 py-2 text-sm text-center text-red-700 border">
        ${transaction.Rkprice}
      </td>
    <td className="px-4 py-2 text-center border">
                    {transaction.imageUrl ? (
                      <ImagePopup src={transaction.imageUrl} alt="Agent" />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
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
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
    </select>
  </p>

  <p>
    {indexOfFirstItem + 1}–
    {Math.min(indexOfLastItem, LeaseStatementData.length)} of{" "}
    {LeaseStatementData.length}
  </p>

  {/* Pagination arrows */}
  <div className="flex space-x-2">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className={`px-2 py-1 rounded ${
        currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-blue-600"
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
    </button>
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className={`px-2 py-1 rounded ${
        currentPage === totalPages
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
) : null}


      </div>
    </div>
  );
};

export default OrderHistory;
