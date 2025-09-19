"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaseAgent } from '@/app/redux/adminMasterSlice';
import ImagePopup from "@/app/pages/image-popup/page";

const RecentActivity = () => {
  const dispatch = useDispatch();
  const { leaseAgentData, loading } = useSelector((state) => state.adminMaster ?? {});

  useEffect(() => {
      dispatch(getLeaseAgent());
    }, [dispatch]);

  const statusColors = {
    confirm: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    return: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-4 sm:p-6">
      <h5 className="tracking-tight text-gray-800 sm:text-3xl">
        Recent Agent Lease
      </h5>

      <div className="mt-6 overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl">
            <table className="min-w-full text-left border-collapse">
              <thead className="text-center text-gray-700 border border-gray-300 bg-gradient-to-r from-slate-200 to-slate-300">
  <tr>
    {[
      "Username",
      "Name",
      "Agent Name",
      "Price ($)",
      "Payment Mode",
      "Date",
      "Image",
      "Total Return ($)",
      "Weekly Return ($)",
      "Month",
      "Remark",
    ].map((header) => (
      <th
        key={header}
        className="px-3 py-3 text-sm font-semibold tracking-wide uppercase border border-gray-300 sm:px-4 sm:py-4"
      >
        {header}
      </th>
    ))}
  </tr>
</thead>


              <tbody className="text-center divide-y divide-gray-200">
                {leaseAgentData?.length > 0 ? (
                  leaseAgentData.map((txn, idx) => (
                    <tr
                      key={idx}
                      className={`transition-colors hover:bg-slate-50 ${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-3 py-3 font-medium text-gray-800 border sm:px-4 sm:py-4 whitespace-nowrap">
                        {txn.AuthLogin}
                      </td>
                      <td className="px-3 py-3 border sm:px-4 sm:py-4 whitespace-nowrap">
                        {txn.Name}
                      </td>
                      <td className="px-3 py-3 border sm:px-4 sm:py-4 whitespace-nowrap">
                        {txn.productName}
                      </td>
                      <td className="px-3 py-3 font-semibold text-gray-900 border sm:px-4 sm:py-4 whitespace-nowrap">
                        {txn.price}
                      </td>
                      <td className="px-3 py-3 border sm:px-4 sm:py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                          {txn.Paymentmode}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-gray-600 border sm:px-4 sm:py-4 whitespace-nowrap">
                        {txn.RDate}
                      </td>
                      <td className="px-2 py-2 text-center border td-wrap-text">
                {txn.imageUrl ? (
                  <ImagePopup src={txn.imageUrl} alt="Agent" />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </td>
                      <td className="px-3 py-3 border sm:px-4 sm:py-4 whitespace-nowrap">
                        {txn.totalReturn}
                      </td>
                      <td className="px-3 py-3 border sm:px-4 sm:py-4 whitespace-nowrap">
                        {txn.weeklyReturn}
                      </td>
                      <td className="px-3 py-3 border sm:px-4 sm:py-4 whitespace-nowrap">
                        {txn.month}
                      </td>
                      <td className="px-3 py-3 border sm:px-4 sm:py-4 whitespace-nowrap">
                        {txn.Remark}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-4 py-6 italic text-center text-gray-500"
                      colSpan="9"
                    >
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;
