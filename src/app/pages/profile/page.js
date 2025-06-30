"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { fetchAdminUserDetails } from "@/app/redux/adminUserSlice";
import Loading from "@/app/common/loading";

const AdminProfilePage = () => {
  const dispatch = useDispatch();
  const { user: adminDetails, loading, error } = useSelector((state) => state.admin);
  const adminUserId = Cookies.get("adminUserId");

  useEffect(() => {
    if (adminUserId) {
      dispatch(fetchAdminUserDetails({ adminUserId }));
    }
  }, [adminUserId, dispatch]);

  if (loading) return <Loading />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl">
        <h1 className="mb-6 text-3xl font-semibold text-center text-blue-700">
          Admin Profile
        </h1>

        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            Error: {error}
          </div>
        )}

        {adminDetails ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 ">
              <span className="w-32 font-medium text-gray-600">Name:</span>
              <span className="text-gray-800">{adminDetails.username || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-32 font-medium text-gray-600">Email:</span>
              <span className="text-gray-800">{adminDetails.email || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-32 font-medium text-gray-600">Phone:</span>
              <span className="text-gray-800">{adminDetails.phoneNumber || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-32 font-medium text-gray-600">First Name:</span>
              <span className="text-gray-800">{adminDetails.firstName || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-32 font-medium text-gray-600">Middle Name:</span>
              <span className="text-gray-800">{adminDetails.middleName || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-32 font-medium text-gray-600">Last Name:</span>
              <span className="text-gray-800">{adminDetails.lastName || "N/A"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-32 font-medium text-gray-600">Password:</span>
              <span className="text-gray-800">{adminDetails.password || "N/A"}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No user data available</p>
        )}
      </div>
    </div>
  );
};

export default AdminProfilePage;
