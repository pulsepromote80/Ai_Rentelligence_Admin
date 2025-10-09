"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { clearError, registerUser } from "@/app/redux/authSlice";
import Loading from "@/app/common/loading";
import {
  isValidEmail,
  isValidMobile,
  isValidPassword,
  isValidUsername,
  limitToCharacters,
} from "@/app/common/utils/validationHelpers";

const AdminRegistration = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    fname: "",
    lname: "",
    type: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (isValidUsername(formData.username))
      newErrors.username = isValidUsername(formData.username);
    if (isValidUsername(formData.fname))
      newErrors.fname = isValidUsername(formData.fname);
    if (isValidEmail(formData.email))
      newErrors.email = isValidEmail(formData.email);
    if (isValidMobile(formData.phoneNumber))
      newErrors.phoneNumber = isValidMobile(formData.phoneNumber);
    if (isValidPassword(formData.password))
      newErrors.password = isValidPassword(formData.password);
    if (!formData.type) newErrors.type = "Please select a type";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = name === "phoneNumber" ? value.replace(/\D/g, "") : value;
    updatedValue = limitToCharacters(updatedValue);

    setFormData({ ...formData, [name]: updatedValue });
    setErrors({ ...errors, [name]: "" });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      if (result && result.statusCode === 200) {
        toast.success("🎉 Account Created Successfully. Contact Administration.");

        // ✅ Reset form fields
        setFormData({
          username: "",
          fname: "",
          lname: "",
          type: "",
          email: "",
          phoneNumber: "",
          password: "",
        });

        setRegistrationComplete(true);
      } else {
        setMessage(result?.message || "Registration failed");
      }
    } catch (errorMessage) {
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (error) {
      setMessage(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (loading) return <Loading />;

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-2xl p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="mb-2 text-3xl font-bold text-center text-gray-800">
          Create Account
        </h2>
        <p className="mb-6 text-sm text-center text-gray-500">
          For business, brand or celebrity
        </p>

        {message && (
          <p className="mb-4 text-sm font-medium text-center text-red-500">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username + Type */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative">
              <User className="absolute text-gray-400 left-3 top-3" size={18} />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-all focus:ring-2 focus:ring-indigo-500 ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username}</p>
              )}
            </div>

            <div className="relative">
              <User className="absolute text-gray-400 left-3 top-3" size={18} />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.type ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Type</option>
                <option value="SuperAdmin">Super Admin</option>
                <option value="Admin">Admin</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-xs text-red-500">{errors.type}</p>
              )}
            </div>
          </div>

          {/* Name fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative">
              <User className="absolute text-gray-400 left-3 top-3" size={18} />
              <input
                type="text"
                name="fname"
                placeholder="First Name"
                value={formData.fname}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.fname ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.fname && (
                <p className="mt-1 text-xs text-red-500">{errors.fname}</p>
              )}
            </div>

            <div className="relative">
              <User className="absolute text-gray-400 left-3 top-3" size={18} />
              <input
                type="text"
                name="lname"
                placeholder="Last Name"
                value={formData.lname}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative">
              <Mail className="absolute text-gray-400 left-3 top-3" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <Phone className="absolute text-gray-400 left-3 top-3" size={18} />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Mobile Number"
                maxLength="10"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute text-gray-400 left-3 top-3" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              maxLength="25"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-500 cursor-pointer right-3 top-3"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || registrationComplete}
            className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              registrationComplete ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegistration;
