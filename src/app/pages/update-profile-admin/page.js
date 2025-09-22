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
import { User, Mail, Phone } from "lucide-react";

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

  const insecureNumbers = ["123456", "123456789", "123123", "password", "qwerty"];

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
    if (!/^[0-9]{7,12}$/.test(formData.phoneNumber.trim())) {
  toast.error("Enter a valid phone number (7 to 12 digits)!");
  return false;


    }
    if (insecureNumbers.includes(formData.phoneNumber.trim())) {
  toast.error("This mobile number is too common and insecure!");
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
      <div className="w-full max-w-lg p-8 bg-white border border-gray-100 shadow-2xl rounded-2xl">
        <h6 className="mb-2 font-bold text-center text-gray-800 text-1xl">
          Update Profile
        </h6>
        <p className="mb-3 text-sm text-center text-gray-500">
          Keep Your Information Update
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <div className="relative">
              <User className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
              <input
                type="text"
                name="username"
                value={formData.username}
                readOnly
                className="w-full py-2 pl-10 pr-3 mt-1 bg-gray-100 border rounded-lg cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              First Name
            </label>
            <div className="relative">
              <User className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
              <input
                type="number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-3 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 font-semibold text-white transition-all duration-200 rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileAdmin;
