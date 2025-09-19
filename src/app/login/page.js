'use client'

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { adminLogin, clearError } from "@/app/redux/authSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Spinner from "../common/spinner";
import { isValidPassword, isValidUsername, limitToCharacters } from "../common/utils/validationHelpers";
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

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

    try {
      const resultAction = await dispatch(adminLogin({ username, password }));
      if (adminLogin.fulfilled.match(resultAction)) {
        router.push('/pages/Dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleChange = (e, setter, field) => {
    const limitedValue = limitToCharacters(e.target.value); 
    setter(limitedValue);

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (error) dispatch(clearError());
  };

  return (
    <div className="lex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4 overflow-auto">
      <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl max-h-[90vh]">
        {/* Left side - Illustration and Welcome Text */}
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

        {/* Right side - Login Form */}
        <div className="w-full md:w-3/5 bg-white p-6 md:p-10 flex flex-col justify-center overflow-y-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Hello!</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                  <FaUser className="w-4 h-4" />
                </span>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter Your E-mail"
                  value={username}
                  onChange={(e) => handleChange(e, setUsername, 'username')}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    errors.username ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-indigo-300'
                  }`}
                />
              </div>
              {errors.username && <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                {errors.username}
              </p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
                  <FaLock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => handleChange(e, setPassword, 'password')}
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-indigo-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-indigo-600 transition-colors duration-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                {errors.password}
              </p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <Link href="/login/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Spinner />
                  <span className="ml-2">SIGN IN</span>
                </>
              ) : (
                <>
                  <span>LOG IN</span>
                  <FaArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                  Create
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;