"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminUserDetails,
  updateAdminProfile,
} from "@/app/redux/adminUserSlice";
import Loading from "@/app/common/loading";
import { getAdminUserId, getUsername } from "@/app/pages/api/auth";
import { toast } from "react-toastify";

const UpdateProfileAdmin = () => {
  const dispatch = useDispatch();
  const { user: adminDetailsRaw, loading } = useSelector((state) => state.admin);

  const adminDetails = Array.isArray(adminDetailsRaw)
    ? adminDetailsRaw[0]
    : adminDetailsRaw;

  const adminUserId = getAdminUserId();
  const username = getUsername();

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    phoneNumber: "",
    email: "",
  });

  // fetch details on load
  useEffect(() => {
    if (adminUserId && username) {
      dispatch(fetchAdminUserDetails({ adminUserId, username }));
    }
  }, [adminUserId, username, dispatch]);

  // set formData when adminDetails fetched
  useEffect(() => {
    if (adminDetails) {
      setFormData({
        username: adminDetails.username || "",
        firstName: adminDetails.firstName || "",
        phoneNumber: adminDetails.phoneNumber || "",
        email: adminDetails.email || "",
      });
    }
  }, [adminDetails]);

  if (loading) return <Loading />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Validation Function
  const validateForm = () => {
    if (!formData.username.trim()) {
      toast.error("Username cannot be empty!");
      return false;
    }
    if (!formData.firstName.trim()) {
      toast.error("First Name cannot be empty!");
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      toast.error("Phone Number cannot be empty!");
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.phoneNumber.trim())) {
      toast.error("Enter a valid 10-digit phone number!");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email cannot be empty!");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      toast.error("Enter a valid email address!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await dispatch(updateAdminProfile(formData)).unwrap();
      if (result && result.statusCode === 1) {
        toast.success(result.message || "Profile Updated Successfully");
      } else if (result.statusCode === 409) {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Profile update failed!");
    }
  };

  return (
<div className="flex items-center justify-center from-blue-50 to-indigo-100">
  <div className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-2xl border border-gray-100">
    <h6 className="mb-2 text-1xl font-bold text-center text-gray-800">
      Update Profile
    </h6>
    <p className="mb-3 text-sm text-center text-gray-500">
      Keep your information up-to-date
    </p>

    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Username
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.121 17.804A7 7 0 1117.804 5.121M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <input
            type="text"
            name="username"
            value={formData.username}
            readOnly
            className="w-full pl-10 pr-3 py-2 mt-1 bg-gray-100 border rounded-lg cursor-not-allowed focus:outline-none"
          />
        </div>
      </div>

      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-600">
          First Name
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 20h9M12 4h9M4 9h16M4 15h16"
            />
          </svg>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Phone Number
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5h2l3.6 7.59-1.35 2.44A2 2 0 007 18h10a2 2 0 001.75-1.03l3.58-6.49a1 1 0 00-.89-1.48H6.21"
            />
          </svg>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-600">
          Email
        </label>
        <div className="relative">
          <svg
            className="absolute left-3 top-3 w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 12H8m0 0l4-4m-4 4l4 4m8-8H4a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2v-8a2 2 0 00-2-2z"
            />
          </svg>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 mt-6 text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
      >
        Update Profile
      </button>
    </form>
  </div>
</div>

  );
};

export default UpdateProfileAdmin;
