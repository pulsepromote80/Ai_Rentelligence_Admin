"use client";

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAdminManageUser } from '@/app/redux/adminMangeUserSlice';
import { toast } from 'react-toastify';
import { Search, FileSpreadsheet } from "lucide-react";
import { Calendar, User, UserCircle2 } from "lucide-react";
import { FaSyncAlt } from "react-icons/fa";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { loading, searchData } = useSelector((state) => state.adminManageUser ?? {});
  const [form, setForm] = useState({
    authLogin: '',
    fname: '',
    mobile: '',
    email: '',
    walletid: '',
    status: ''
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    try {
      await dispatch(addAdminManageUser(form));
    } catch (err) {
      
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

  
  const filteredData = Array.isArray(searchData?.data)
    ? searchData.data.filter(item => {
        if (form.status === '') return true; 
        if (form.status === '1') return item.Active === true; 
        if (form.status === '0') return item.Active === false; 
        return true;
      })
    : [];

  const tableData = filteredData.map((item, idx) => ({
    srNo: idx + 1,
    AuthLogin: item.AuthLogin || '',
    Name: item.Name || '',
    Mobile: item.Mobile || '',
    Email: item.Email || '',
    WalletAddress: item.WalletAddress || '',
    WalletBep20: item.WalletBep20 || '',
    Package: item.Package || '',
    RegDate: formatDate(item.RegDate),
    status: item.Status || (item.Active ? 'Active' : 'Inactive'),
  }));

  const paginatedData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, tableData.length);

  return (
    <div className="p-6 mx-auto mt-8 mb-10 bg-white border border-blue-100 shadow-2xl max-w-7xl rounded-2xl">
      <h2 className="mb-8 text-2xl font-bold tracking-wide text-center text-black drop-shadow">Search Users</h2>
      <form className="grid grid-cols-1 gap-6 p-6 border border-blue-100 shadow-md md:grid-cols-4 bg-white/80 rounded-xl" onSubmit={handleSearch}>
        <div>
          <label className="block mb-2 font-semibold text-blue-800">User Name</label>
          <input 
            name="authLogin" 
            value={form.authLogin} 
            onChange={handleChange} 
            className="w-full p-2 transition border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
            placeholder="Enter UserName" 
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-blue-800">Name</label>
          <input 
            name="fname" 
            value={form.fname} 
            onChange={handleChange} 
            className="w-full p-2 transition border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
            placeholder="Enter Name" 
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-blue-800">Email Address</label>
          <input 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            className="w-full p-2 transition border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
            placeholder="Enter EmailId" 
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-blue-800">Contact Number</label>
          <input 
            name="mobile" 
            value={form.mobile} 
            onChange={handleChange} 
            className="w-full p-2 transition border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
            placeholder="Enter Mobile Number" 
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold text-blue-800">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-2 transition border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select Type</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 font-semibold text-blue-800">Wallet Address</label>
          <input 
            name="walletid" 
            value={form.walletid} 
            onChange={handleChange} 
            className="w-full p-2 transition border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
            placeholder="Enter Wallet Address" 
          />
        </div>
        <div className="flex items-end justify-center mt-2 md:col-span-4">
          <button 
            type="submit" 
            className="px-8 py-2 font-semibold text-white transition-all duration-200 rounded-lg shadow bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
          >
            Search
          </button>
        </div>
      </form>
      
      <div className="mt-10">
        {hasSearched && (
          loading ? (
            <div className="py-8 font-semibold text-center text-blue-700 animate-pulse">Loading...</div>
          ) : (
            <div className="mt-2 overflow-x-auto border border-blue-100 shadow-lg rounded-xl bg-white/90">
              <table className="min-w-full border border-gray-200 rounded-xl">
                <thead className="sticky top-0 z-10 text-blue-900 bg-gradient-to-r from-blue-200 to-blue-400">
                  <tr>
                    <th className="px-4 py-3 text-center border">Sr.No.</th>
                    <th className="px-4 py-3 text-center border">User Login</th>
                    <th className="px-4 py-3 text-center border">Name</th>
                    <th className="px-4 py-3 text-center border">Mobile</th>
                    <th className="px-4 py-3 text-center border">Email</th>
                    <th className="px-4 py-3 text-center border">Wallet Address</th>
                    <th className="px-4 py-3 text-center border">Wallet BEP</th>
                    <th className="px-4 py-3 text-center border">Package</th>
                    <th className="px-4 py-3 text-center border">RegDate</th>
                    <th className="px-4 py-3 text-center border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-10 text-lg text-center text-gray-400">No Data Found</td>
                    </tr>
                  ) : (
                    paginatedData.map((row, idx) => (
                      <tr 
                        key={idx} 
                        className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-50 transition'}
                      >
                        <td className="px-4 py-2 font-medium text-center border">{row.srNo}</td>
                        <td className="px-4 py-2 text-center border">{row.AuthLogin}</td>
                        <td className="px-4 py-2 text-center border">{row.Name}</td>
                        <td className="px-4 py-2 text-center border">{row.Mobile}</td>
                        <td className="px-4 py-2 text-center border">{row.Email}</td>
                        <td className="px-4 py-2 text-center border">{row.WalletAddress}</td>
                        <td className="px-4 py-2 text-center border">{row.WalletBep20}</td>
                        <td className="px-4 py-2 text-center border">{row.Package}</td>
                        <td className="px-4 py-2 text-center border">{row.RegDate}</td>
                        <td className="px-4 py-2 text-center border">
                          <span className={`px-2 py-1 text-md font-semibold  ${
                            row.status === 'Active' 
                              ? 'text-green-800' 
                              : 'text-red-800'
                          }`}>
                            {row.status}
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
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
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
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AllUsers;