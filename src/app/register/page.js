"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { clearError, registerUser } from "@/app/redux/authSlice";
import Loading from "@/app/common/loading";
import {
  isValidEmail,
  isValidMobile,
  isValidPassword,
  isValidUsername,
  limitToCharacters,
} from "@/app/common/utils/validationHelpers";
import { User, Mail, Phone, Lock } from "lucide-react";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    name: "",
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

    const usernameError = isValidUsername(formData.username);
    if (usernameError) newErrors.username = usernameError;

    const nameError = isValidUsername(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = isValidEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const phoneNumberError = isValidMobile(formData.phoneNumber);
    if (phoneNumberError) newErrors.phoneNumber = phoneNumberError;

    const passwordError = isValidPassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "phoneNumber") {
      updatedValue = value.replace(/\D/g, "");
    }

    updatedValue = limitToCharacters(updatedValue);

    setFormData({
      ...formData,
      [name]: updatedValue,
    });

    setErrors({
      ...errors,
      [name]: "",
    });

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      if (result && result.statusCode === 200) {
        toast.success("Account Created Successfully. Contact Administration");
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
    <div className="flex justify-center items-center">
      {/* Left Side */}
            <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
              <p className="text-indigo-200">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pharetra magna nisi, at posuere sem dapibus sed.
              </p>
            </div>
            
            <div className="relative h-56 flex items-center justify-center">
              <div className="w-40 h-40 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm transform rotate-12">
                <svg className="w-20 h-20 text-white transform -rotate-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
            
            <div className="mt-8 flex items-center">
              <div className="w-10 h-1 bg-purple-300 mr-2"></div>
              <div className="w-5 h-1 bg-purple-400 mr-2"></div>
              <div className="w-3 h-1 bg-purple-500"></div>
            </div>
          </div>
        </div>

      {/* Right Side */}
      

{/* Right Side */}
<div className="flex items-center justify-center w-full lg:w-1/2 bg-white p-8">
  <div className="w-full max-w-md">
    <h2 className="mb-2 text-3xl font-bold text-gray-800 text-center">
      Create Account
    </h2>
    <p className="mb-6 text-sm text-gray-500 text-center">
      For business, brand or celebrity
    </p>

    {message && (
      <p className="mb-4 text-center text-sm font-medium text-red-500">
        {message}
      </p>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Username + Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <User size={18} />
          </span>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-500">{errors.username}</p>
          )}
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <User size={18} />
          </span>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Mail size={18} />
          </span>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Phone size={18} />
          </span>
          <input
            type="text"
            name="phoneNumber"
            placeholder="Mobile Number"
            maxLength="10"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
          )}
        </div>
      </div>

      {/* Password */}
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <Lock size={18} />
        </span>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          maxLength="25"
          value={formData.password}
          onChange={handleChange}
          className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
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
        className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center ${
          registrationComplete
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        Create Account
      </button>
    </form>

    {/* Success redirect */}
    {registrationComplete && (
      <button
        onClick={() => router.push("/")}
        className="w-full py-2 mt-4 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition"
      >
        Go to Login
      </button>
    )}

    {/* Login link */}
    {!registrationComplete && (
      <p
        onClick={() => router.push("/")}
        className="mt-5 text-center text-sm font-medium text-blue-600 cursor-pointer hover:underline"
      >
        Already have an account? Log in
      </p>
    )}
  </div>
</div>

    </div>
  );
};

export default Register;
