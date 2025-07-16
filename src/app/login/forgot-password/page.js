"use client"

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { sendOTP, verifyOtp, resetPassword, clearError } from '@/app/redux/authSlice';
import Loading from '@/app/common/loading';
import Link from 'next/link';
import Spinner from '@/app/common/spinner';
import { isValidUsername } from '@/app/common/utils/validationHelpers';
import { FaUser, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [inputError, setInputError] = useState('');
  const [otpError, setOtpError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    const error = isValidUsername(value);
    setInputError(error);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    setOtp(value);
    const sanitizedValue = value.replace(/[a-zA-Z<>'"]/g, '');
    setOtp(sanitizedValue);
    const error = sanitizedValue !== value ? 'Invalid characters detected in OTP.' : '';
    setOtpError(error);
  };

  const handleSendOTP = () => {
    const usernameError = isValidUsername(username);
    if (usernameError) {
      setInputError(usernameError);
      return;
    }
    setInputError('');
    dispatch(sendOTP({ username }))
      .unwrap()
      .then(() => setStep(2))
      .catch((err) => {
        if (err?.message?.toLowerCase().includes('not exist')) {
          toast.error('Username does not exist');
        } else {
          console.error('OTP Send Failed', err);
        }
      });
  };

  const handleVerifyOTP = () => {
    const otpError = otp.match(/[^0-9]/) ? 'OTP can only contain numbers.' : '';
    if (otpError) {
      setOtpError(otpError);
      return;
    }
    setOtpError('');
    dispatch(verifyOtp({ username, otp }))
      .unwrap()
      .then(() => router.push('/login/reset-password'))
      .catch((err) => console.error('OTP Verification Failed', err));
  };

  
  const handleNavigateToLogin = () => {
    dispatch(clearError());
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full p-8 border rounded-2xl shadow-2xl max-w-96 bg-white/20 backdrop-blur-md border-white/30 transition-transform duration-300 hover:scale-[1.02]">
        <h2 className="mb-4 text-2xl font-extrabold text-center text-black drop-shadow-lg">
          {step === 1 ? 'Forgot Password' : 'Verify OTP'}
        </h2>
        {step === 1 ? (
          <>
            <label htmlFor="username" className="block text-lg font-medium text-black">User Name</label>
            <div className="relative mt-2 mb-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FaUser className="w-5 h-5" />
              </span>
              <input
                id="username"
                type="text"
                placeholder="Enter User Name"
                value={username}
                onChange={handleUsernameChange}
                className={`w-full pl-10 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60 text-black placeholder:text-gray-400 ${inputError ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {inputError && <p className="mt-2 mb-4 text-sm text-red-500">{inputError}</p>}
            <button
              onClick={handleSendOTP}
              className="flex items-center justify-center w-full py-2 mt-2 text-white transition-colors duration-200 bg-green-500 rounded-full shadow-lg hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading && <Spinner />}
              {loading ? 'Sending OTP' : 'Send OTP'}
            </button>
            <Link href="/" className="block mt-4 text-center text-blue-500 hover:underline">
              Already have an account? Login
            </Link>
          </>
        ) : (
          <>
            <label htmlFor="otp" className="block text-lg font-medium text-black">OTP</label>
            <div className="relative mt-2 mb-4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FaLock className="w-5 h-5" />
              </span>
              <input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
                className={`w-full pl-10 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white/60 text-black placeholder:text-gray-400 ${otpError ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {otpError && <p className="mt-2 mb-4 text-sm text-red-500">{otpError}</p>}
            <button
              onClick={handleVerifyOTP}
              className="flex items-center justify-center w-full py-2 mt-2 text-white transition-colors duration-200 bg-green-500 rounded-full shadow-lg hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading && <Spinner />}
              {loading ? 'Verifying OTP' : 'Verify OTP'}
            </button>
            <Link href="../../" className="block mt-4 text-center text-blue-500 hover:underline" onClick={handleNavigateToLogin}>
              Already have an account? Login
            </Link>
          </>
        )}
        {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}
      </div>
    </div>
  );
}
