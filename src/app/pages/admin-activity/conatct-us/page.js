"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContactUs } from "@/app/redux/adminMasterSlice";
import { toast } from "react-toastify";

const ContactUs = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getAllContactUs())
      .unwrap()
      .catch((error) => {
        toast.error(error.message || "Failed to fetch contact us details");
      });
  }, [dispatch]);

  const contactUsData = useSelector(
    (state) => state.adminMaster.contactUsData?.data || []
  );

  const contactUsList = contactUsData.filter((item) => item.CareerName === null);
  const careerList = contactUsData.filter((item) => item.CareerName !== null);

  const paginate = (data, page, rowsPerPage) => {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const startItem = (page - 1) * rowsPerPage + 1;
    const endItem = Math.min(page * rowsPerPage, data.length);
    const currentItems = data.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return { totalPages, startItem, endItem, currentItems };
  };

  const contactPagination = paginate(contactUsList, currentPage, rowsPerPage);
  const careerPagination = paginate(careerList, currentPage, rowsPerPage);

  return (
    <div className="max-w-6xl p-6 mx-auto mt-8 mb-10 bg-white border border-blue-100 shadow-2xl rounded-2xl space-y-10">

      {/* Contact Us Table */}
      <div>
        <h1 className="w-full mb-6 text-2xl font-bold text-center text-gray-700">
          Contact Us Details
        </h1>

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
              {contactPagination.currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-lg text-center text-gray-400">
                    No Contact Data Found
                  </td>
                </tr>
              ) : (
                contactPagination.currentItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx % 2 === 0
                        ? "bg-blue-50 hover:bg-blue-100 transition"
                        : "bg-white hover:bg-blue-50 transition"
                    }
                  >
                    <td className="px-4 py-2 text-sm font-medium text-center text-gray-700 border">
                      {contactPagination.startItem + idx}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {item.Name || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {item.Email || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {item.Mobile || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {item.Subject || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {item.Message || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Career Table */}
      <div>
        <h1 className="w-full mb-6 text-2xl font-bold text-center text-gray-700">
          Career Details
        </h1>

        <div className="mt-2 overflow-x-auto border border-blue-100 shadow-lg rounded-xl bg-white/90">
          <table className="min-w-full border border-gray-200 rounded-xl">
            <thead className="sticky top-0 z-10 text-white bg-blue-500">
              <tr>
                <th className="px-4 py-2 text-sm font-medium text-center border rounded-tl-lg">S.No.</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Name</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Email</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Mobile</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border">Subject</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border ">Message</th>
                <th className="px-4 py-2 text-sm font-semibold text-center border rounded-tr-lg">CareerName</th>
              </tr>
            </thead>
            <tbody>
              {careerPagination.currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-lg text-center text-gray-400">
                    No Career Data Found
                  </td>
                </tr>
              ) : (
                careerPagination.currentItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx % 2 === 0
                        ? "bg-blue-50 hover:bg-blue-100 transition"
                        : "bg-white hover:bg-blue-50 transition"
                    }
                  >
                    <td className="px-4 py-2 text-sm font-medium text-center text-gray-700 border">
                      {careerPagination.startItem + idx}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {item.Name || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {item.Email || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {item.Mobile || "-"}
                    </td>
                    <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {item.Subject  || "-"} 
                    </td>
                     <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {item.Message  || "-"} 
                    </td>
                     <td className="px-4 py-2 text-sm text-center text-gray-700 border">
                      {item.CareerName  || "-"} 
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
