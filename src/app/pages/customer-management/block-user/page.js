"use client"
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usernameLoginId, blockUserByAdmin } from '@/app/redux/adminMasterSlice';
import { toast } from 'react-toastify';

const BlockUser = () => {
  const dispatch = useDispatch();
  const { usernameData, blockUserData, loading, error } = useSelector((state) => state.adminMaster);
  const [authLogin, setAuthLogin] = useState('');
  const [touched, setTouched] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (authLogin && authLogin.trim()) {
        const result = await dispatch(usernameLoginId(authLogin));
        if (!result.payload) {
          setErrors({ authLogin: "User not found" });
        } else {
          setErrors({});
        }
        setTouched(true);
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [authLogin, dispatch]);

  const handleUserIdChange = (e) => {
    setAuthLogin(e.target.value);
    if (errors.title && e.target.value.trim()) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleBlurOrFetch = () => {
    if (authLogin && authLogin.trim()) {
      dispatch(usernameLoginId(authLogin));
      setTouched(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!authLogin.trim()) newErrors.title = 'UserId is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const result = await dispatch(blockUserByAdmin(authLogin));
      if (result.payload) {
        toast.success(result.payload.message || 'User blocked successfully!');
        setAuthLogin('');
        setTouched(false);
      }
    } catch (error) {
      toast.error('Error blocking user: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div className="flex items-center justify-center p-0 mx-auto mt-0">
      <div className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-3xl border">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 mb-4 rounded-full border-4 border-blue-200 flex items-center justify-center bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15c-3.866 0-7 1.79-7 4v1h14v-1c0-2.21-3.134-4-7-4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 12a5 5 0 100-10 5 5 0 000 10z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Block User</h2>
          <p className="text-sm text-gray-500">Enter User ID to block access</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* User ID + User Name */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                User ID
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 text-sm border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 ${
                  errors.authLogin || errors.title
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-gray-200 focus:ring-blue-300'
                }`}
                value={authLogin}
                onChange={handleUserIdChange}
                onBlur={handleBlurOrFetch}
                placeholder="Enter User ID"
              />
              {errors.authLogin && (
                <div className="mt-1 text-xs text-red-500">
                  {errors.authLogin}
                </div>
              )}
              {errors.title && (
                <div className="mt-1 text-xs text-red-500">
                  {errors.title}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-600">
                User Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-100"
                value={
                  touched && usernameData
                    ? usernameData.name || usernameData.userName || ''
                    : ''
                }
                readOnly
                placeholder="User Name"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all"
            disabled={loading || !!errors.authLogin}
          >
            {loading ? 'Blocking...' : 'Block User'}
          </button>
        </form>

        {/* Messages */}
        {loading && (
          <div className="mt-3 text-sm text-blue-500">Processing...</div>
        )}
        {error && <div className="mt-3 text-sm text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default BlockUser;
