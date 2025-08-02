"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllContactUs } from '@/app/redux/adminMasterSlice';
import { toast } from 'react-toastify';

const ContactUs = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(getAllContactUs())
      .unwrap()
      .catch((error) => {
        toast.error(error.message || 'Failed to fetch contact us details');
      });
  }, [dispatch]);

  const contactUsData = useSelector((state) => state.adminMaster.contactUsData?.data || []);

  // Calculate pagination
  const totalPages = Math.ceil(contactUsData.length / itemsPerPage);
  const currentItems = contactUsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
                  <td className="px-4 py-2 text-sm font-medium text-center text-gray-700 border">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
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

        {/* Pagination - Only show if there's data */}
        {contactUsData.length > itemsPerPage && (
          <div className="flex items-center justify-center gap-2 py-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-800 hover:bg-blue-400'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;