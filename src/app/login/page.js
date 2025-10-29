'use client'

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { adminLogin, clearError } from "@/app/redux/authSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Spinner from "../common/spinner";
import { isValidPassword, isValidUsername, limitToCharacters } from "../common/utils/validationHelpers";
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const HARD_OTP = "989796";

  const validate = () => {
    const newErrors = {};
    const usernameError = isValidUsername(username);
    if (usernameError) newErrors.username = usernameError;
    const passwordError = isValidPassword(password);
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setShowOtp(true);
    setOtpMessage('');
  };

  const handleOtpSend = () => {
    setOtpSent(true);
    setOtpMessage("OTP sent successfully!");
  };

  const handleOtpVerify = async () => {
    if (!otpValue) return setOtpMessage("Please enter OTP");
    if (otpValue.length !== 6) return setOtpMessage("OTP must be 6 digits");

    if (otpValue === HARD_OTP) {
      try {
        const resultAction = await dispatch(adminLogin({ username, password }));
        if (adminLogin.fulfilled.match(resultAction)) router.push('/pages/Dashboard');
      } catch (error) {
        console.error('Login failed:', error);
      }
    } else {
      setOtpMessage("Wrong OTP, please try again!");
      setOtpValue('');
    }
  };

  const handleChange = (e, setter, field) => {
    const limitedValue = limitToCharacters(e.target.value);
    setter(limitedValue);
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (error) dispatch(clearError());
  };

  return (
    <div className="flex items-center justify-center  w-full p-2 xs:p-4 sm:p-6 lg:p-8 bg-gray-50">
      <div className="flex flex-col md:flex-row w-full max-w-4xl xl:max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Left side */}
        <div className="relative flex flex-col justify-center w-full md:w-2/5 p-4 xs:p-6 sm:p-8 lg:p-10 text-white bg-gradient-to-br from-indigo-600 to-purple-700">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute w-64 h-64 bg-white rounded-full top-10 left-10"></div>
            <div className="absolute w-32 h-32 bg-white rounded-full bottom-10 right-10"></div>
            <div className="absolute w-40 h-40 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full top-1/2 left-1/2"></div>
          </div>

          <div className="relative z-10">
            <h1 className="mb-3 text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold">Welcome Back!</h1>
            <p className="text-indigo-200 text-xs xs:text-sm sm:text-base leading-relaxed mb-6">
              Rentelligence: Deploying Intelligence for a financially independent future and empowering the future with AI Agents — Rent, Lease, Own, and Evolve.
            </p>

            <div className="relative flex items-center justify-center h-24 xs:h-32 sm:h-40 md:h-56">
              <div className="flex items-center justify-center w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white/20 rounded-3xl backdrop-blur-sm rotate-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 xs:w-12 xs:h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white transform -rotate-12" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="4" y="6" width="16" height="12" rx="3" ry="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <circle cx="9" cy="12" r="1.5" fill="currentColor" />
                  <circle cx="15" cy="12" r="1.5" fill="currentColor" />
                  <line x1="12" y1="3" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="2" r="1" fill="currentColor" />
                  <rect x="9" y="15" width="6" height="1.5" rx="0.5" fill="currentColor" />
                </svg>
              </div>
            </div>

            <div className="flex items-center mt-8">
              <div className="w-10 h-1 mr-2 bg-purple-300"></div>
              <div className="w-5 h-1 mr-2 bg-purple-400"></div>
              <div className="w-3 h-1 bg-purple-500"></div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex flex-col justify-center w-full md:w-3/5 p-4 xs:p-6 sm:p-8 lg:p-10 bg-white">
          <div className="mb-6 text-center">
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800">Admin Login</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="flex items-center p-3 text-red-700 rounded-lg bg-red-50 text-sm">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label htmlFor="username" className="block mb-2 text-xs xs:text-sm font-medium text-gray-700">Username</label>
              <div className="relative">
                <FaUser className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3 xs:w-4 xs:h-4" />
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => handleChange(e, setUsername, 'username')}
                  className={`w-full pl-10 xs:pl-12 pr-4 py-2 xs:py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm xs:text-base ${errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-indigo-300'}`}
                />
              </div>
              {errors.username && <p className="mt-2 text-xs xs:text-sm text-red-600">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-2 text-xs xs:text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 xs:left-4 top-1/2 -translate-y-1/2 text-gray-500 w-3 h-3 xs:w-4 xs:h-4" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => handleChange(e, setPassword, 'password')}
                  className={`w-full pl-10 xs:pl-12 pr-12 py-2 xs:py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm xs:text-base ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-indigo-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 xs:pr-4 text-gray-500 hover:text-indigo-600"
                >
                  {showPassword ? <EyeSlashIcon className="w-4 h-4 xs:w-5 xs:h-5" /> : <EyeIcon className="w-4 h-4 xs:w-5 xs:h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-xs xs:text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* OTP Section */}
            {showOtp && (
              <div className="mt-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-3 sm:space-y-0">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    disabled={!otpSent}
                    className={`flex-1 px-4 py-2 xs:py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 border-gray-300 text-center text-sm xs:text-base ${!otpSent ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={handleOtpSend}
                    disabled={otpSent}
                    className={`w-full sm:w-auto px-4 py-2 xs:py-3 text-white rounded-xl transition-colors duration-200 text-sm xs:text-base ${otpSent ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                  >
                    Send OTP
                  </button>
                </div>
                {otpMessage && (
                  <p className={`text-xs xs:text-sm mt-1 ${otpMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {otpMessage}
                  </p>
                )}
                {otpSent && (
                  <button
                    type="button"
                    onClick={handleOtpVerify}
                    className="w-full py-2 xs:py-3 mt-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 text-sm xs:text-base"
                  >
                    Verify OTP & Login
                  </button>
                )}
              </div>
            )}

            {/* Login button */}
            {!showOtp && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 xs:py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center text-sm xs:text-base"
              >
                {loading ? (
                  <>
                    <Spinner />
                    <span className="ml-2">LOG IN</span>
                  </>
                ) : (
                  <>
                    <span>LOG IN</span>
                    <FaArrowRight className="w-3 h-3 xs:w-4 xs:h-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;