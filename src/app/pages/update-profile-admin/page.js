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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-xl">
        <h1 className="mb-6 text-2xl font-semibold text-center text-gray-700">
          Update Profile
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              readOnly
              className="w-full px-3 py-2 mt-1 bg-gray-100 border rounded-lg cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileAdmin;
