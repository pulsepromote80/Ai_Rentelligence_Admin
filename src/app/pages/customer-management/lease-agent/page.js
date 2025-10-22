"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usernameLoginId, clearUsernameData, getRechargeTransactionAdmin } from '@/app/redux/adminMasterSlice';
import { getProductList } from '@/app/redux/productSlice';
import ImagePopup from "@/app/pages/image-popup/page";
import Select from 'react-select';
import { toast } from 'react-toastify';

const LeaseAgentPage = () => {
  const dispatch = useDispatch();
  const { error: usernameError, rechargeTransactionData, usernameData } = useSelector((state) => state.adminMaster ?? {});
  console.log("Abhishek-->",rechargeTransactionData)
  const { data: productData } = useSelector((state) => state.product ?? {});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Form states
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [durationHr, setDurationHr] = useState(null);
  const [userid, setUserid] = useState('');
  const [packageType, setPackageType] = useState(null);
  const [useridError, setUseridError] = useState('');
  const [submittedUserid, setSubmittedUserid] = useState('');

  useEffect(() => {
    dispatch(getProductList());
  }, [dispatch]);

  // Userid verification effect
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (userid && userid.trim()) {
        const result = await dispatch(usernameLoginId(userid));
        if (result.payload === null) {
          setUseridError("User ID doesn't exist");
        } else {
          setUseridError('');
        }
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [userid, dispatch]);

  // Handle username error
  useEffect(() => {
    if (usernameError) {
      toast.error(usernameError.message || 'Invalid User ID');
      setUseridError("User ID doesn't exist");
    }
  }, [usernameError]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    } catch (error) {
      return dateString;
    }
  };

  const tableData = Array.isArray(rechargeTransactionData?.data)
    ? rechargeTransactionData?.data?.map((item, idx) => ({
        srNo: idx + 1,
        ...item,
      }))
    : rechargeTransactionData?.data && typeof rechargeTransactionData?.data === 'object'
      ? [{ srNo: 1, ...rechargeTransactionData?.data }]
      : [];

  const paginatedData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, tableData.length);

  // Options for dropdowns
  const agentOptions = Array.isArray(productData)
    ? productData.map((product) => ({
        value: product.productId, // Using productId as unique identifier
        label: product.productName,
      }))
    : [];

  const durationOptions = Array.from({ length: 50 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} Hr`,
  }));

  const packageOptions = [
    { value: 1, label: 'Zero Pin' },
    { value: 2, label: 'Power' },
  ];

  // Form handlers
  const handleUseridChange = (e) => {
    setUserid(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAgent) {
      toast.error('Please select an agent');
      return;
    }
    if (!durationHr) {
      toast.error('Please select duration hours');
      return;
    }
    if (!userid.trim()) {
      toast.error('Please enter User ID');
      return;
    }
    if (useridError) {
      toast.error('Please enter a valid User ID');
      return;
    }
    if (!packageType) {
      toast.error('Please select package type');
      return;
    }


    // Check if usernameData exists and has urid
    if (!usernameData || !usernameData.urid) {
      toast.error('Please verify the User ID first');
      return;
    }

    // Call getRechargeTransactionAdmin API
    const rechargePayload = {
      urid: usernameData.urid,
      productId: selectedAgent.value,
      leaseDuration: durationHr.value,
      packageType: packageType.value,
    };
    try {
      const result = await dispatch(getRechargeTransactionAdmin(rechargePayload));
      if (result.payload) {
        toast.success('Recharge transaction fetched successfully!');
      } else {
        toast.error('Failed to fetch recharge transaction data');
      }
    } catch (error) {
      toast.error('Error fetching recharge transaction data');
      console.error('Error:', error);
    }

    // Set submitted userid for display
    setSubmittedUserid(userid);

    // Reset form
    setSelectedAgent(null);
    setDurationHr(null);
    setUserid('');
    setPackageType(null);
    setUseridError('');
    dispatch(clearUsernameData());
  };

  return (
   <div className="p-8 mx-auto mt-0 mb-12 border border-blue-100 shadow-2xl max-w-7xl bg-gradient-to-b from-white via-blue-50 to-white rounded-3xl">

<h6
  className="heading"
  style={{
    borderBottom: "1px solid #daebed",
    marginBottom: "15px",
  }}
>
  Lease Agent Management
</h6>

{/* Form Section */}
<div className="mb-8 p-6 bg-white border border-blue-100 shadow-lg rounded-xl">
  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Agent List DDL */}
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-600">Agent List</label>
      <Select
        options={agentOptions}
        value={selectedAgent}
        onChange={setSelectedAgent}
        placeholder="Select Agent"
        classNamePrefix="select"
        className="select-drop-dwon"
        styles={{
          control: (provided, state) => ({
            ...provided,
            minHeight: "47px",
            height: "47px",
            borderRadius: "0.75rem",
            borderWidth: "1px",
            borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
            boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
            backgroundColor: "#f9fafb",
            "&:hover": {
              borderColor: "#3b82f6",
            },
          }),
          valueContainer: (provided) => ({
            ...provided,
            height: "48px",
            padding: "0 8px",
            display: "flex",
            alignItems: "center",
          }),
          input: (provided) => ({
            ...provided,
            margin: "0px",
            padding: "0px",
            color: "#000",
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            height: "48px",
          }),
          singleValue: (provided) => ({
            ...provided,
            display: "flex",
            alignItems: "center",
            color: "#000",
          }),
          placeholder: (provided) => ({
            ...provided,
            color: "#9ca3af",
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: "#fff",
            border: "1px solid #d1d5db",
            borderRadius: "0.75rem",
            zIndex: 20,
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
              ? "#3b82f6"
              : state.isFocused
                ? "#f3f4f6"
                : "transparent",
            color: state.isSelected ? "#fff" : "#374151",
            "&:active": {
              backgroundColor: "#e5e7eb",
            },
          }),
        }}
        isSearchable
      />
    </div>

    {/* Duration Hr DDL */}
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-600">Duration Hr</label>
      <Select
        options={durationOptions}
        value={durationHr}
        onChange={setDurationHr}
        placeholder="Select Hours"
        classNamePrefix="select"
        className="select-drop-dwon"
        styles={{
          control: (provided, state) => ({
            ...provided,
            minHeight: "47px",
            height: "47px",
            borderRadius: "0.75rem",
            borderWidth: "1px",
            borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
            boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
            backgroundColor: "#f9fafb",
            "&:hover": {
              borderColor: "#3b82f6",
            },
          }),
          valueContainer: (provided) => ({
            ...provided,
            height: "48px",
            padding: "0 8px",
            display: "flex",
            alignItems: "center",
          }),
          input: (provided) => ({
            ...provided,
            margin: "0px",
            padding: "0px",
            color: "#000",
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            height: "48px",
          }),
          singleValue: (provided) => ({
            ...provided,
            display: "flex",
            alignItems: "center",
            color: "#000",
          }),
          placeholder: (provided) => ({
            ...provided,
            color: "#9ca3af",
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: "#fff",
            border: "1px solid #d1d5db",
            borderRadius: "0.75rem",
            zIndex: 20,
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
              ? "#3b82f6"
              : state.isFocused
                ? "#f3f4f6"
                : "transparent",
            color: state.isSelected ? "#fff" : "#374151",
            "&:active": {
              backgroundColor: "#e5e7eb",
            },
          }),
        }}
        isSearchable
      />
    </div>

    {/* Enter Userid */}
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-600">Enter Userid</label>
      <input
        type="text"
        className={`w-full px-4 py-3 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 ${useridError
            ? "border-red-400 focus:ring-red-300"
            : "border-gray-200 focus:ring-blue-300"
          }`}
        value={userid}
        onChange={handleUseridChange}
        placeholder="Enter User ID"
      />
      {useridError && (
        <div className="mt-2 text-xs text-red-500">{useridError}</div>
      )}
    </div>

    {/* Package Type DDL */}
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-600">Package Type</label>
      <Select
        options={packageOptions}
        value={packageType}
        onChange={setPackageType}
        placeholder="Select Package"
        classNamePrefix="select"
        className="select-drop-dwon"
        styles={{
          control: (provided, state) => ({
            ...provided,
            minHeight: "47px",
            height: "47px",
            borderRadius: "0.75rem",
            borderWidth: "1px",
            borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
            boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
            backgroundColor: "#f9fafb",
            "&:hover": {
              borderColor: "#3b82f6",
            },
          }),
          valueContainer: (provided) => ({
            ...provided,
            height: "48px",
            padding: "0 8px",
            display: "flex",
            alignItems: "center",
          }),
          input: (provided) => ({
            ...provided,
            margin: "0px",
            padding: "0px",
            color: "#000",
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            height: "48px",
          }),
          singleValue: (provided) => ({
            ...provided,
            display: "flex",
            alignItems: "center",
            color: "#000",
          }),
          placeholder: (provided) => ({
            ...provided,
            color: "#9ca3af",
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: "#fff",
            border: "1px solid #d1d5db",
            borderRadius: "0.75rem",
            zIndex: 20,
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
              ? "#3b82f6"
              : state.isFocused
                ? "#f3f4f6"
                : "transparent",
            color: state.isSelected ? "#fff" : "#374151",
            "&:active": {
              backgroundColor: "#e5e7eb",
            },
          }),
        }}
        isSearchable
      />
    </div>

    {/* Submit Button */}
    <div className="md:col-span-2 lg:col-span-4 flex justify-end">
      <button
        type="submit"
        className="px-6 py-3 text-sm font-semibold text-white transition-all rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
      >
        Submit
      </button>
    </div>
  </form>
</div>

 
  <div className="mt-2 overflow-x-auto border border-blue-100 shadow-lg rounded-xl bg-white/90">
    <table className="min-w-full border border-gray-200 rounded-xl">
      {/* Table Head */}
      <thead className="sticky top-0 z-10 text-white bg-gradient-to-r from-blue-600 to-blue-800">
        <tr>
          <th className="px-4 py-3 text-sm font-semibold text-center border th-wrap-text">#</th>
          <th className="px-4 py-3 text-sm font-semibold text-center border th-wrap-text">Image</th>
          <th className="px-4 py-3 text-sm font-semibold text-center border th-wrap-text">Login</th>
          <th className="px-4 py-3 text-sm font-semibold text-center border th-wrap-text">Name</th>
          <th className="px-4 py-3 text-sm font-semibold text-center border th-wrap-text">Product</th>
          <th className="px-4 py-3 text-sm font-semibold text-center border th-wrap-text">Price</th>
          <th className="px-4 py-3 text-sm font-semibold text-center border th-wrap-text">Total Return</th>
          <th className="px-4 py-3 text-sm font-semibold text-center border th-wrap-text">Weekly Return</th>
          <th className="px-4 py-3 text-sm font-semibold text-center border th-wrap-text">Date</th>
          <th className="px-4 py-3 text-sm font-semibold text-center border th-wrap-text">Duration (Months)</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody>
        {paginatedData.length === 0 ? (
          <tr className='transition-colors duration-200 bg-blue-50 hover:bg-blue-100'>
            <td colSpan={10} className="px-2 py-2 border td-wrap-text text-center">
              No Data Found
            </td>
          </tr>
        ) : (
          paginatedData.map((row, idx) => (
            <tr
              key={idx}
              className={`${
                idx % 2 === 0 ? "transition-colors duration-200 bg-white hover:bg-blue-50" : "bg-white"
              } hover:bg-blue-100 transition`}
            >
              <td className="px-2 py-2 text-center border td-wrap-text">{row.srNo}</td>
              <td className="px-2 py-2 text-center border td-wrap-text">
                {row.image ? (
                  <img
                    src={row.image}
                    alt="Product"
                    className="w-10 h-10 object-cover rounded mx-auto"
                  />
                ) : (
                  'N/A'
                )}
              </td>
              <td className="px-2 py-2 text-center border td-wrap-text">{submittedUserid || row.URID || 'N/A'}</td>
              <td className="px-2 py-2 text-center border td-wrap-text">{row.subName || 'N/A'}</td>
              <td className="px-2 py-2 text-center border td-wrap-text">{row.ProductName || 'N/A'}</td>
              <td className="px-2 py-2 text-center border td-wrap-text">${row.Rkprice || 'N/A'}</td>
              <td className="px-2 py-2 text-center border td-wrap-text">${row.TotalReturn || 'N/A'}</td>
              <td className="px-2 py-2 text-center border td-wrap-text">${row.WeeklyReturn || 'N/A'}</td>
              <td className="px-2 py-2 text-center border td-wrap-text">{formatDate(row.RDate)}</td>
              <td className="px-2 py-2 text-center border td-wrap-text">{row.DurationOnMonth || 'N/A'}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>

    {/* Pagination */}
    {tableData.length > 0 && (
      <div className="flex items-center justify-between px-4 py-3">
        {/* Rows per page */}
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

        {/* Showing items */}
        <div className="text-sm text-gray-600">
          {startItem}-{endItem} of {tableData.length}
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-1 rounded ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:text-blue-800"
            }`}
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
            className={`p-1 rounded ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:text-blue-800"
            }`}
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

  );
};

export default LeaseAgentPage;