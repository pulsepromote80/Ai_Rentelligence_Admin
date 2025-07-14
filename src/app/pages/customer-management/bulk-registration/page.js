"use client"
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usernameLoginId } from '@/app/redux/adminMasterSlice';
import { bulkRegistration } from '@/app/redux/authSlice';
import { fetchCountries } from '@/app/redux/regionSlice';
import { toast } from 'react-toastify';

const initialForm = {
  fName: '',
  lName: '',
  mobile: '',
  email: '',
  password: '',
  noOfId: '',
  countryId: '',
};

const BulkRegistration = () => {
  const dispatch = useDispatch();
  const { usernameData, loading: userLoading, error: userError } = useSelector((state) => state.adminMaster);
  const { countries, loading: countryLoading } = useSelector((state) => state.region);
  const { bulkRegistrationData, loading: regLoading, error: regError } = useSelector((state) => state.auth);
  const [userId, setUserId] = useState('');
  const [touched, setTouched] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [introURID, setIntroURID] = useState('');
  const [noOfIdError, setNoOfIdError] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!countries || countries.length === 0) {
      dispatch(fetchCountries());
    }
  }, [dispatch, countries]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (userId && userId.trim()) {
        dispatch(usernameLoginId(userId)).then((res) => {
          setIntroURID(res.payload?.urid || '');
        });
        setTouched(true);
      } else {
        setIntroURID('');
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [userId, dispatch]);

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleBlurOrFetch = () => {
    if (userId && userId.trim()) {
      dispatch(usernameLoginId(userId)).then((res) => {
        setIntroURID(res.payload?.urid || '');
      });
      setTouched(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'noOfId') {
      let val = value;
      if (Number(val) > 50) {
        setNoOfIdError('Number not greater than 50');
      } else if (Number(val) < 0) {
        setNoOfIdError('Number must not be negative');
      } else {
        setNoOfIdError('');
      }
      if (Number(val) > 50) {
        val = '50';
      } else if (Number(val) < 0) {
        val = '0';
      }
      setForm((prev) => ({ ...prev, [name]: val }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validation function for all fields
  const validateForm = () => {
    const newErrors = {};
    if (!userId.trim()) newErrors.userId = 'UserId is required';
    if (!form.fName.trim()) newErrors.fName = 'First Name is required';
    if (!form.lName.trim()) newErrors.lName = 'Last Name is required';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile is required';
    else if (!/^\d{10,15}$/.test(form.mobile.trim())) newErrors.mobile = 'Enter a valid mobile number';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) newErrors.email = 'Enter a valid email address';
    if (!form.password.trim()) newErrors.password = 'Password is required';
    if (!form.noOfId || isNaN(Number(form.noOfId))) newErrors.noOfId = 'No Of Id is required';
    else if (Number(form.noOfId) > 50) newErrors.noOfId = 'Number not greater than 50';
    else if (Number(form.noOfId) < 0) newErrors.noOfId = 'Number must not be negative';
    if (!form.countryId) newErrors.countryId = 'Country is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    for (const key of Object.keys(initialForm)) {
      if (!form[key] || (key === 'noOfId' && (isNaN(Number(form[key])) || Number(form[key]) > 50))) {
        toast.error('Please fill all fields correctly. No Of Id should not be more than 50.');
        return;
      }
    }
    const reqBody = {
      introURID,
      ...form,
      introSide: null,
      noOfId: Number(form.noOfId),
    };
    try {
      const result = await dispatch(bulkRegistration(reqBody)).unwrap();
      toast.success('Bulk registration successfull!');
      setForm(initialForm);
      setUserId('');
      setIntroURID('');
      setTouched(false);
    } catch (err) {
      toast.error(regError || err?.message || 'Bulk registration failed.');
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className="w-full max-w-4xl p-8 bg-white shadow-2xl rounded-2xl">
        <h2 className="mb-8 text-2xl font-bold text-center text-black">Bulk Registration</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-semibold text-gray-700">Enter User ID :</label>
              <input
                type="text"
                className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={userId}
                onChange={handleUserIdChange}
                onBlur={handleBlurOrFetch}
                placeholder="Enter User Id"
              />
              {errors.userId && <div className="mt-1 text-sm text-red-500">{errors.userId}</div>}
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
          {touched && usernameData && introURID && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">First Name</label>
                <input type="text" name="fName" value={form.fName} onChange={handleChange} className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg" placeholder="First Name" required />
                {errors.fName && <div className="mt-1 text-sm text-red-500">{errors.fName}</div>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Last Name</label>
                <input type="text" name="lName" value={form.lName} onChange={handleChange} className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg" placeholder="Last Name" required />
                {errors.lName && <div className="mt-1 text-sm text-red-500">{errors.lName}</div>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Mobile</label>
                <input type="text" name="mobile" value={form.mobile} onChange={handleChange} className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg" placeholder="Mobile" required />
                {errors.mobile && <div className="mt-1 text-sm text-red-500">{errors.mobile}</div>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg" placeholder="Email" required />
                {errors.email && <div className="mt-1 text-sm text-red-500">{errors.email}</div>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg" placeholder="Password" required />
                {errors.password && <div className="mt-1 text-sm text-red-500">{errors.password}</div>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">No Of Id</label>
                <input type="number" name="noOfId" value={form.noOfId} onChange={handleChange} className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg" placeholder="No Of Id" required max={50} min={0} />
                {noOfIdError && (
                  <div className="mt-1 text-sm text-red-600">{noOfIdError}</div>
                )}
                {errors.noOfId && <div className="mt-1 text-sm text-red-500">{errors.noOfId}</div>}
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Country</label>
                <select name="countryId" value={form.countryId} onChange={handleChange} className="w-full px-4 py-3 text-base bg-gray-100 border border-gray-200 rounded-lg" required>
                  <option value="">Select Country</option>
                  {countries && countries.map((country) => (
                    <option key={country.country_Id} value={country.country_Id}>{country.country_Name}</option>
                  ))}
                </select>
                {errors.countryId && <div className="mt-1 text-sm text-red-500">{errors.countryId}</div>}
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 mt-2 text-lg font-semibold text-white transition-colors rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={userLoading || regLoading || countryLoading}
          >
            {(userLoading || regLoading || countryLoading) ? 'Processing...' : 'Submit'}
          </button>
        </form>
        {(userLoading || regLoading || countryLoading) && <div className="mt-2 text-blue-500">Loading...</div>}
        {(userError || regError) && <div className="mt-2 text-red-500">{userError || regError}</div>}
      </div>
    </div>
  );
};

export default BulkRegistration;
