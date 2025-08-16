"use client"
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usernameLoginId, clearUsernameData } from '@/app/redux/adminMasterSlice';
import { updateUser } from '@/app/redux/authSlice';
import { toast } from 'react-toastify';

const EditUser = () => {
  const dispatch = useDispatch();
  const { usernameData, error: usernameError } = useSelector((state) => state.adminMaster);
  const { updateUserData, loading, error } = useSelector((state) => state.auth);
  const [authLogin, setAuthLogin] = useState('');
  const [fields, setFields] = useState({
    name: '',
    fName: '',
    lName: '',
    email: '',
    address: '',
    mobile: '',
    urid: ''
  });
  const [errors, setErrors] = useState({});
  const [walletBep20, setWalletBep20] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (authLogin && authLogin.trim()) {
        dispatch(usernameLoginId(authLogin));
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [authLogin, dispatch]);

  useEffect(() => {
    if (usernameError) {
      toast.error(usernameError.message || 'Invalid User ID');
      setFields({
        name: '',
        fName: '',
        lName: '',
        email: '',
        address: '',
        mobile: '',
        urid: ''
      });
    }
  }, [usernameError]);

  useEffect(() => {
    if (usernameData) {
      setFields({
        name: usernameData.name || '',
        fName: usernameData.fName || '',
        lName: usernameData.lName || '',
        email: usernameData.email || '',
        address: usernameData.address || '',
        mobile: usernameData.mobile || '',
        urid: usernameData.urid || ''
      });
    }
  }, [usernameData]);

  useEffect(() => {
    if (updateUserData && updateUserData.statusCode === 200) {
      toast.success(updateUserData.message || 'User updated successfully!');
      setFields({
        name: '',
        fName: '',
        lName: '',
        email: '',
        address: '',
        mobile: '',
        urid: ''
      });
      setAuthLogin('');
      setWalletBep20('');
      setImage(null);
      dispatch(clearUsernameData());
    }
  }, [updateUserData, dispatch]);
  
  const handleUserIdChange = (e) => {
    setAuthLogin(e.target.value);
    setFields({
      name: '', fName: '', lName: '', email: '', address: '', mobile: '', urid: ''
    });
    if (errors.title && e.target.value.trim()) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleFieldChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameData) {
      toast.error('Please enter a valid User ID first');
      return;
    }
    
    const formData = new FormData();
    formData.append('LoginID', authLogin);
    formData.append('FName', fields.fName);
    formData.append('LName', fields.lName);
    formData.append('Address', fields.address);
    formData.append('Email', fields.email);
    formData.append('WalletBep20', walletBep20);
    if (image) formData.append('image', image);
    dispatch(updateUser(formData));
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="w-full max-w-4xl p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="mb-8 text-2xl font-bold text-center text-black">Edit User</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-semibold text-gray-700">Enter User ID :</label>
              <input
                type="text"
                className={`w-full px-4 py-3 text-base bg-gray-100 border ${usernameError ? 'border-red-500' : 'border-gray-200'} rounded-lg${usernameData ? ' cursor-not-allowed' : ''}`}
                value={authLogin}
                onChange={handleUserIdChange}
                placeholder="Enter User Id"
                readOnly={!!usernameData}
                tabIndex={usernameData ? -1 : 0}
              />
              {usernameError && <div className="mt-1 text-sm text-red-500">{usernameError.message || 'Invalid User ID'}</div>}
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-semibold text-gray-700">User Name :</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                name="name"
                value={fields.name}
                onChange={handleFieldChange}
                placeholder="User Name"
                readOnly
              />
            </div>
          </div>
          {/* Rest of your form remains the same */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-semibold text-gray-700">First Name :</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg"
                name="fName"
                value={fields.fName}
                onChange={handleFieldChange}
                placeholder="First Name"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-semibold text-gray-700">Last Name :</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg"
                name="lName"
                value={fields.lName}
                onChange={handleFieldChange}
                placeholder="Last Name"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-semibold text-gray-700">Email :</label>
              <input
                type="email"
                className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg"
                name="email"
                value={fields.email}
                onChange={handleFieldChange}
                placeholder="Email"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-semibold text-gray-700">Mobile :</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg"
                name="mobile"
                value={fields.mobile}
                onChange={handleFieldChange}
                placeholder="Mobile"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-semibold text-gray-700">Address :</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg"
                name="address"
                value={fields.address}
                onChange={handleFieldChange}
                placeholder="Address"
              />
            </div>
             <div className="flex-1">
              <label className="block mb-1 text-sm font-semibold text-gray-700">Wallet BEP20 :</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg"
                name="walletBep20"
                value={walletBep20}
                onChange={e => setWalletBep20(e.target.value)}
                placeholder="Wallet BEP20"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 mt-2 text-lg font-semibold text-white transition-colors rounded-lg bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
              disabled={!usernameData || loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
        {loading && <div className="mt-2 text-blue-500">Loading...</div>}
        {error && <div className="mt-2 text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default EditUser;