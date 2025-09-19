"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminUserDetails } from "@/app/redux/adminUserSlice";
import Loading from "@/app/common/loading";
import { getAdminUserId, getUsername } from "@/app/pages/api/auth";
import { User, Mail, Phone, Lock } from "lucide-react";
const AdminProfilePage = () => {
  const dispatch = useDispatch();
  const { user: adminDetailsRaw, loading, error } = useSelector((state) => state.admin);
  const adminDetails = Array.isArray(adminDetailsRaw) ? adminDetailsRaw[0] : adminDetailsRaw;
  const adminUserId = getAdminUserId();
  const username = getUsername();

  useEffect(() => {
    if (adminUserId,username) {
      dispatch(fetchAdminUserDetails({ adminUserId,username }));
    }
  }, [adminUserId,username,dispatch]);

  if (loading) return <Loading />;

  return (
     <div className="flex items-center justify-center p-0 mx-auto mt-0">
      <div className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-3xl border">
   <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 mb-4 rounded-full border-4 border-blue-200 flex items-center justify-center bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15c-3.866 0-7 1.79-7 4v1h14v-1c0-2.21-3.134-4-7-4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 12a5 5 0 100-10 5 5 0 000 10z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">  Admin Profile</h2> 
        </div>
 

        {error && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            Error: {error}
          </div>
        )}

        {adminDetails ? (
          

<div className="mt-6 space-y-4">
  {[
    { label: "Name", value: adminDetails.username || "N/A", icon: <User className="w-5 h-5 text-blue-500" /> },
    { label: "Email", value: adminDetails.email || "N/A", icon: <Mail className="w-5 h-5 text-green-500" /> },
    { label: "Phone", value: adminDetails.phoneNumber || "N/A", icon: <Phone className="w-5 h-5 text-purple-500" /> },
    { label: "Password", value: adminDetails.password || "N/A", icon: <Lock className="w-5 h-5 text-red-500" /> },
  ].map((item, index) => (
    <div
      key={index}
      className="flex items-center justify-between p-4 transition-all bg-gray-50 rounded-xl hover:bg-gray-100"
    >
      <span className="flex items-center gap-3 text-sm font-semibold text-gray-700">
        {item.icon}
        <span className="w-24">{item.label}:</span>
      </span>
      <span className="text-gray-900">{item.value}</span>
    </div>
  ))}
</div>
 
        ) : (
          <p className="text-center text-gray-500">No user data available</p>
        )}
      </div>
    </div>
  );
};

export default AdminProfilePage;
