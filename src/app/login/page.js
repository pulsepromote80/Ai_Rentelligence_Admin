'use client'

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { adminLogin, clearError } from "@/app/redux/authSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Spinner from "../common/spinner";
import { isValidPassword, isValidUsername, limitToCharacters } from "../common/utils/validationHelpers";
import { FaUser, FaLock } from 'react-icons/fa';

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
    <div className="flex items-center justify-center w-full">
      <div className="w-full p-8  rounded-2xl shadow-2xl max-w-96  backdrop-blur-md border-white/30 transition-transform duration-300 hover:scale-[1.02]">
        <h2 className="mb-4 text-2xl font-extrabold text-center text-black drop-shadow-lg">Admin Login</h2>
        <form onSubmit={handleLogin}>
          {error && (
            <p className="px-2 py-1 mb-3 text-sm font-semibold text-center text-red-400 rounded shadow bg-white/10">{error}</p>
          )}
          <label htmlFor="username" className="block text-lg font-medium text-black">User Name</label>
          <div className="relative mt-2 mb-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FaUser className="w-5 h-5" />
            </span>
            <input
              id="username"
              type="text"
              placeholder="Enter Your User Name"
              value={username}
              onChange={(e) => handleChange(e, setUsername, 'username')}
              className={`w-full pl-10 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60 text-black placeholder:text-gray-400 ${errors.username ? 'border-red-400' : 'border-gray-300'}`}
            />
          </div>
          {errors.username && <p className="text-sm text-red-400">{errors.username}</p>}
          <label htmlFor="password" className="block mt-2 text-lg font-medium text-black">Password</label>
          <div className="relative mt-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <FaLock className="w-5 h-5" />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => handleChange(e, setPassword, 'password')}
              className={`w-full pl-10 px-3 py-2 pr-10 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60 text-black placeholder:text-gray-400 ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 flex items-center text-gray-700 right-2"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
          <button
            type="submit"
            className="flex items-center justify-center w-full py-2 mt-4 text-white transition-colors duration-200 bg-green-500 rounded-full shadow-lg hover:bg-green-600"
          >
            {loading && <Spinner />}
            {loading ? "Login..." : "Login"}
          </button>
          <p className="mt-4 text-base text-center text-blue-500 cursor-pointer hover:underline">
            <Link href="/login/register">Don&rsquo;t have an Account? Register</Link>
          </p>
          {/* <div className="flex justify-center mt-2">
            <Link href="/login/forgot-password" className="text-blue-500 hover:underline" passHref>
              Forgot Password?
            </Link>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
