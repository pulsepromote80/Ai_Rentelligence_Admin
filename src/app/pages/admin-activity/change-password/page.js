'use client'

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChangePasswordAdminMaster } from '@/app/redux/adminMasterSlice';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { isValidPassword } from '@/app/common/utils/validationHelpers';
import Spinner from '@/app/common/spinner';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { loading, error, ChangePasswordData } = useSelector((state) => state.adminMaster);

  const [formData, setFormData] = useState({
    username: '',
    oldPassword: '',
    newPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
 

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    // username validation
    if (!formData.username.trim()) {
      newErrors.username ='Username is required';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Old password validation
    const oldPasswordError = isValidPassword(formData.oldPassword);
    if (oldPasswordError) {
      newErrors.oldPassword = oldPasswordError;
    }

    // New password validation
    const newPasswordError = isValidPassword(formData.newPassword);
    if (newPasswordError) {
      newErrors.newPassword = newPasswordError;
    } else if (formData.newPassword === formData.oldPassword) {
      newErrors.newPassword = 'New password must be different from old password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(ChangePasswordAdminMaster(formData)).unwrap();
      
      // Show success toast if statusCode is 200
      if (result && result.statusCode === 200) {
        toast.success(result.message || 'Password Updated Successfully');
        setFormData({
          username: '',
          oldPassword: '',
          newPassword: ''
        });
      }
    } catch (error) {
      console.error('Password change failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="w-full max-w-xl p-8 mx-auto bg-white shadow-xl rounded-2xl">
        <h2 className="mb-8 text-2xl font-bold text-center">Change Password</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 border border-red-200 rounded-md bg-red-50">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Admin User ID Field */}
            <div>
              <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter Admin Username"
                className={`bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 block w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 outline-none transition ${errors.username ? 'border border-red-300' : 'border-none'}`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Old Password Field */}
            <div>
              <label htmlFor="oldPassword" className="block mb-1 text-sm font-medium text-gray-700">
                Current Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type={showOldPassword ? 'text' : 'password'}
                  required
                  value={formData.oldPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className={`bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 block w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 outline-none transition pr-10 ${errors.oldPassword ? 'border border-red-300' : 'border-none'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showOldPassword ? (
                    <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.oldPassword}</p>
              )}
            </div>
          </div>

          {/* New Password Field */}
          <div>
            <label htmlFor="newPassword" className="block mb-1 text-sm font-medium text-gray-700">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                required
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className={`bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400 block w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 outline-none transition pr-10 ${errors.newPassword ? 'border border-red-300' : 'border-none'}`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showNewPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg font-bold text-white transition rounded-lg shadow bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Spinner />
                  <span className="ml-2">Changing Password...</span>
                </div>
              ) : (
                'Change Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;