"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaseAgent } from '@/app/redux/adminMasterSlice';
import ImagePopup from "@/app/pages/image-popup/page";

const LeaseAgentPage = () => {
  const dispatch = useDispatch();
  const { leaseAgentData, loading } = useSelector((state) => state.adminMaster ?? {});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); 

  useEffect(() => {
    dispatch(getLeaseAgent());
  }, [dispatch]);

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

  const tableData = Array.isArray(leaseAgentData?.data)
    ? leaseAgentData.data.map((item, idx) => ({
        srNo: idx + 1,
        ...item,
      }))
    : leaseAgentData?.data && typeof leaseAgentData.data === 'object'
      ? [{ srNo: 1, ...leaseAgentData.data }]
      : [];

  const paginatedData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, tableData.length);

  return (
    <div className="p-6 mx-auto mt-8 mb-10 bg-white border border-blue-100 shadow-2xl max-w-7xl rounded-2xl">
      <h2 className="mb-8 text-2xl font-bold tracking-wide text-center text-black drop-shadow">Lease Agent Management</h2>
      <div className="mt-2 overflow-x-auto border border-blue-100 shadow-lg rounded-xl bg-white/90">
        <table className="min-w-full border border-gray-200 rounded-xl">
          <thead className="sticky top-0 z-10 text-blue-900 bg-gradient-to-r from-blue-200 to-blue-400">
            <tr>
              <th className="px-4 py-3 text-center border">Sr.No.</th>
              <th className="px-4 py-3 text-center border">Image</th>
              <th className="px-4 py-3 text-center border">Login</th>
              <th className="px-4 py-3 text-center border">Name</th>
              <th className="px-4 py-3 text-center border">Product</th>
              <th className="px-4 py-3 text-center border">Price</th>
              <th className="px-4 py-3 text-center border">Total Return</th>
              <th className="px-4 py-3 text-center border">Weekly Return</th>
              <th className="px-4 py-3 text-center border">Date</th>
              <th className="px-4 py-3 text-center border">Duration (Months)</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-10 text-lg text-center text-gray-400">No Data Found</td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-50 transition'}>
                  <td className="px-4 py-2 font-medium text-center border">{row.srNo}</td>
                  <td className="px-4 py-2 text-center border">
                    {row.imageUrl ? (
                      <ImagePopup src={row.imageUrl} alt="Agent" />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center border">{row.AuthLogin}</td>
                  <td className="px-4 py-2 text-center border">{row.Name}</td>
                  <td className="px-4 py-2 text-center border">{row.productName}</td>
                  <td className="px-4 py-2 text-center border">{row.price}</td>
                  <td className="px-4 py-2 text-center border">{row.totalReturn}</td>
                  <td className="px-4 py-2 text-center border">{row.weeklyReturn}</td>
                  <td className="px-4 py-2 text-center border">{formatDate(row.RDate)}</td>
                  <td className="px-4 py-2 text-center border">{row.DurationOnMonth}</td>
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
                className="p-1 mr-3 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {startItem}-{endItem} of {tableData.length}
            </div>
            <div className="flex items-center gap-2 ml-2">
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
    </div>
  );
};

export default LeaseAgentPage;