"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllContactUs } from '@/app/redux/adminMasterSlice';
import { toast } from 'react-toastify';

const ContactUs = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getAllContactUs())
      .unwrap()
      .catch((error) => {
        toast.error(error.message || 'Failed to fetch contact us details');
      });
  }, [dispatch]);

  const contactUsData = useSelector((state) => state.adminMaster.contactUsData?.data || []);

  // Calculate pagination
  const totalPages = Math.ceil(contactUsData.length / rowsPerPage);
  const currentItems = contactUsData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, contactUsData.length);

  return (
    <div className="max-w-6xl p-6 mx-auto mt-8 mb-10 bg-white border border-blue-100 shadow-2xl rounded-2xl">
      <h1 className="w-full mb-6 text-2xl font-bold text-center text-gray-700">Contact Us Details</h1>
      
      <div className="mt-2 overflow-x-auto border border-blue-100 shadow-lg rounded-xl bg-white/90">
        <table className="min-w-full border border-gray-200 rounded-xl">
          <thead className="sticky top-0 z-10 text-white bg-blue-500">
            <tr>
              <th className="px-4 py-2 text-sm font-medium text-center border rounded-tl-lg">S.No.</th>
              <th className="px-4 py-2 text-sm font-semibold text-center border">Name</th>
              <th className="px-4 py-2 text-sm font-semibold text-center border">Email</th>
              <th className="px-4 py-2 text-sm font-semibold text-center border">Mobile</th>
              <th className="px-4 py-2 text-sm font-semibold text-center border">Subject</th>
              <th className="px-4 py-2 text-sm font-semibold text-center border rounded-tr-lg">Message</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-lg text-center text-gray-400">No Data Found</td>
              </tr>
            ) : (
              currentItems.map((item, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-50 transition'}
                >
                  <td className="px-4 py-2 text-sm font-medium text-center text-gray-700 border">{startItem + idx}</td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700 border">{item.Name || '-'}</td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700 border">{item.Email || '-'}</td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700 border">{item.Mobile || '-'}</td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700 border">{item.Subject || '-'}</td>
                  <td className="px-4 py-2 text-sm text-center text-gray-700 border">{item.Message || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {contactUsData.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="p-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {startItem}-{endItem} of {contactUsData.length}
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
    </div>
  );
};

export default ContactUs;