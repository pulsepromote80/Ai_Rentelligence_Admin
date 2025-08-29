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
    const timeoutId = setTimeout(async() => {
      if (authLogin && authLogin.trim()) {
       const result = await  dispatch(usernameLoginId(authLogin));
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
      console.log(result)
      
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
    <div className="flex items-center justify-center mt-20">
      <div className="w-full max-w-4xl p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="mb-8 text-2xl font-bold text-center text-black">Block User</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-semibold text-gray-700">Enter User ID :</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={authLogin}
                onChange={handleUserIdChange}
                onBlur={handleBlurOrFetch}
                placeholder="Enter User Id"
                
              />
              {errors.authLogin && (
                <div className="mt-1 text-sm text-red-500">
                  {errors.authLogin}
                </div>
              )}
              {errors.title && <div className="mt-1 text-sm text-red-500">{errors.title}</div>}
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-semibold text-gray-700">User Name :</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg"
                value={touched && usernameData ? usernameData.name || usernameData.userName || '' : ''}
                readOnly
                placeholder="User Name"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 text-lg font-semibold text-white transition-colors rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={loading || !!errors.authLogin}
          >
            {loading ? 'Blocking...' : 'Submit'}
          </button>
        </form>
        {loading && <div className="mt-2 text-blue-500">Loading...</div>}
        {error && <div className="mt-2 text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default BlockUser;