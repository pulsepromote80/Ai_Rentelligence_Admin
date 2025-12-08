"use client";

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAdminManageUser, clearSearchData } from '@/app/redux/adminMangeUserSlice';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import { FaCopy } from 'react-icons/fa'
import {
  FaCalendarAlt,
  FaUser,
  FaIdBadge,
  FaEnvelope,
  FaPhoneAlt,
  FaWallet,
  FaFileExcel,
  FaSyncAlt,
} from "react-icons/fa";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { loading, searchData } = useSelector((state) => state.adminManageUser ?? {});
  const [form, setForm] = useState({
    authLogin: '',
    fname: '',
    active: '',
    mobile: '',
    email: '',
    walletid: '',
    kid: '',
    fromDate: '',
    toDate: ''
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(500);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);

    // format dates
    const formatInputDate = (dateStr) => {
      if (!dateStr) return "";
      const [year, month, day] = dateStr.split("-");
      return `${day}-${month}-${year}`;
    };

    const formattedForm = {
      ...form,
      fromDate: formatInputDate(form.fromDate),
      toDate: formatInputDate(form.toDate),
    };

    try {
      await dispatch(addAdminManageUser(formattedForm));
    } catch (err) {
      console.error("Search error:", err);
    }
  };


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
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      return dateString;
    }
  };

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


  const filteredData = Array.isArray(searchData?.data)
    ? searchData.data.filter(item => {
      if (form.active === '') return true;

      // normalize status value
      const status =
        typeof item.Active === 'boolean'
          ? (item.Active ? 'Active' : 'InActive')
          : (item.Status || '');

      if (form.active === '1') return status === 'Active';
      if (form.active === '0') return status === 'InActive';

      return true;
    })
    : [];

  const handleRefresh = () => {
    setIsRefreshing(true);
    dispatch(clearSearchData());
    const emptyForm = {
      authLogin: "",
      fname: "",
      active: "",
      mobile: "",
      email: "",
      walletid: "",
      kid: "",
      fromDate: "",
      toDate: "",
    };
    setForm(emptyForm);
    setHasSearched(false);
    setCurrentPage(1);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000); // Show refreshing for 1 second
  };

  const handleExport = () => {
    if (!searchData?.data || searchData?.data?.length === 0) {
      alert("No data available to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      searchData.data.map((item, index) => ({
        "Sr.No.": index + 1,
        "User ID": item.AuthLogin || "-",
        Name: item.Name || "-",
        Email: item.Email || "-",
        Mobile: item.Mobile || "-",
        "Wallet Address": item.WalletAddress || "-",
        Package: item.Package || "-",
        PackageStatus: item.PackageStatus || "-",
        "Reg Date": item.RegDate || "-",
        Status:
          item.Status || (item.Active ? "Active" : "InActive") || "-",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "AllUsers.xlsx");
  };

  const tableData = filteredData.map((item, idx) => ({
    srNo: idx + 1,
    AuthLogin: item.AuthLogin || '',
    Name: item.Name || '',
    Mobile: item.Mobile || '',
    Email: item.Email || '',
    WalletAddress: item.WalletAddress || '',
    Package: item.Package || '',
    RegDate: formatDate(item.RegDate),
    PacakgateStatus: item.PacakgateStatus,
    active: item.Status || (item.Active ? 'Active' : 'InActive'),
  }));

  const paginatedData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, tableData.length);

  return (
    <div className="p-8 mx-auto mt-0 mb-12 border border-blue-100 shadow-2xl max-w-7xl bg-gradient-to-b from-white via-blue-50 to-white rounded-3xl">
      <h6 className="heading">Search Users</h6>

      <form className="grid grid-cols-1 gap-6" >
        {/* User Name */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-blue-700">User Name</label>
          <div className="relative">
            <FaUser className="absolute text-blue-500 -translate-y-1/2 left-3 top-1/2" />
            <input
              name="authLogin"
              value={form.authLogin}
              onChange={handleChange}
              className="w-full py-2 pl-10 pr-3 transition border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter UserName"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-blue-700">Name</label>
          <div className="relative">
            <FaIdBadge className="absolute text-blue-500 -translate-y-1/2 left-3 top-1/2" />
            <input
              name="fname"
              value={form.fname}
              onChange={handleChange}
              className="w-full py-2 pl-10 pr-3 transition border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter Name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-blue-700">Email Address</label>
          <div className="relative">
            <FaEnvelope className="absolute text-blue-500 -translate-y-1/2 left-3 top-1/2" />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full py-2 pl-10 pr-3 transition border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter EmailId"
            />
          </div>
        </div>

        {/* Contact Number */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-blue-700">Contact Number</label>
          <div className="relative">
            <FaPhoneAlt className="absolute text-blue-500 -translate-y-1/2 left-3 top-1/2" />
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="w-full py-2 pl-10 pr-3 transition border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter Mobile Number"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-blue-700">Status</label>
          <div className="relative">
            <FaIdBadge className="absolute text-blue-500 -translate-y-1/2 left-3 top-1/2" />
            <select
              name="active"
              value={form.active}
              onChange={handleChange}
              className="w-full py-2 pl-10 pr-3 transition border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Select Type</option>
              <option value="1">Active</option>
              <option value="0">InActive</option>
            </select>
          </div>
        </div>

        {/* Wallet Address */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-blue-700">Wallet Address</label>
          <div className="relative">
            <FaWallet className="absolute text-blue-500 -translate-y-1/2 left-3 top-1/2" />
            <input
              name="walletid"
              value={form.walletid}
              onChange={handleChange}
              className="w-full py-2 pl-10 pr-3 transition border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter Wallet Address"
            />
          </div>
        </div>

        {/* From Date */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-blue-700">From Date</label>
          <div className="relative">
            <FaCalendarAlt className="absolute text-blue-500 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="date"
              name="fromDate"
              value={form.fromDate}
              onChange={handleChange}
              className="w-full py-2 pl-10 pr-3 border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>
        </div>

        {/* To Date */}
        <div>
          <label className="block mb-1 text-sm font-semibold text-blue-700">To Date</label>
          <div className="relative">
            <FaCalendarAlt className="absolute text-blue-500 -translate-y-1/2 left-3 top-1/2" />
            <input
              type="date"
              name="toDate"
              value={form.toDate}
              onChange={handleChange}
              className="w-full py-2 pl-10 pr-3 border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-end gap-2 mt-2 justify-left md:col-span-4">
          <button
            type="submit"
            disabled={loading}
            onClick={handleSearch}
            className="px-8 py-2 font-semibold text-white transition-all duration-200 rounded-lg shadow bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading.." : "Search"}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2 text-white transition bg-green-600 shadow rounded-xl hover:bg-green-700"
          >
            <FaFileExcel className="w-4 h-4" /> Export
          </button>
          <button
            onClick={handleRefresh}
            disabled={ isRefreshing}
            className="flex items-center gap-2 px-5 py-2 text-white transition bg-gray-600 shadow rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSyncAlt className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : 'animate-spin-on-hover'}`} />{isRefreshing ? "Refreshing.." : " Refresh"}
          </button>
        </div>
      </form>

      <div className="mt-10">
        {hasSearched && (
          loading && !isRefreshing ? (
            <div className="py-10 mt-10 font-semibold text-center text-blue-600 bg-white border border-gray-200 shadow-xl rounded-2xl">Loading...</div>
          ) : (
            <div className="overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-center border-collapse">
                  {/* Table Header */}
                  <thead className="text-white bg-blue-600">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">Sr.No.</th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">User Login</th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">Name</th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">Mobile</th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">Email</th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">Wallet Address</th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">Package ($)</th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">Package Status</th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">RegDate</th>
                      <th className="px-4 py-3 text-xs font-semibold tracking-wide uppercase border border-b border-blue-500 th-wrap-text">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-4 py-3 border td-wrap-text">No Data Found</td>
                      </tr>
                    ) : (
                      paginatedData.map((row, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-50 transition'}
                        >
                          <td className="px-4 py-3 border td-wrap-text">{row.srNo}</td>
                          <td className="px-4 py-3 border td-wrap-text">{row.AuthLogin}</td>
                          <td className="px-4 py-3 border td-wrap-text">{row.Name}</td>
                          <td className="px-4 py-3 border td-wrap-text">{row.Mobile}</td>
                          <td className="px-4 py-3 border td-wrap-text">{row.Email}</td>
                          <td className="px-4 py-3 border td-wrap-text">

                            {row.WalletAddress || '-'}
                            {row.WalletAddress && (
                              <button
                                onClick={() => copyToClipboard(row.Wallet)}
                                className="p-1 text-blue-500 hover:text-blue-700"
                                title="Copy to Clipboard"
                              >
                                <FaCopy className="w-3 h-3" />
                              </button>
                            )}

                          </td>
                          <td className="px-4 py-3 border td-wrap-text">{row.Package}</td>
                          <td className="px-4 py-3 border td-wrap-text">{row.PacakgateStatus}</td>
                          <td className="px-4 py-3 border td-wrap-text">{row.RegDate}</td>
                          <td className="px-4 py-3 border td-wrap-text">
                            <span
                              className={`px-2 py-1 text-md font-semibold ${row.active === 'Active'
                                ? 'text-green-800'
                                : 'text-red-800'
                                }`}
                            >
                              {row.active}
                            </span>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {tableData.length > 0 && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Rows per page:</span>
                      <select
                        value={rowsPerPage}
                        onChange={(e) => {
                          setRowsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="p-1 mr-4 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="500">500</option>
                        <option value="1000">1000</option>
                        <option value="1500">1500</option>
                      </select>
                    </div>
                    <div className="text-sm text-gray-600">
                      {startItem}-{endItem} of {tableData.length}
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
              </div></div>
          )
        )}
      </div>
    </div>
  );
};

export default AllUsers;