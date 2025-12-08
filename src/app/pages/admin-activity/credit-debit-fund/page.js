"use client";
import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getUserWalletDetails, addFund } from '@/app/redux/adminManageFundSlice';

const CreditDebitFund = () => {
  const [form, setForm] = useState({
    loginId: '',
    name: '',
    wallet: '',
    type: '',
    amount: '',
    remark: '',
  });
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { data: walletData, loading, error} = useSelector((state) => state.adminManageFund);
 
  useEffect(() => {
    if (!form.loginId) return;
    const handler = setTimeout(async() => {
      const result = await dispatch(getUserWalletDetails(form.loginId));
      if (!result.payload) {
        setErrors({ authLogin: "User not found" });
      } else {
        setErrors({});
      }
    }, 100); 
    return () => clearTimeout(handler);
  }, [form.loginId, dispatch]);

  useEffect(() => {
    if (walletData?.walletDetails) {
      setForm((prev) => ({
        ...prev,
        name: walletData.walletDetails.fullName || walletData.walletDetails.name || '',
      }));
    }
  }, [walletData]);

  useEffect(() => {
    if (walletData?.fundTypeWiseCrDrList && form.wallet) {
      setFilteredTypes(walletData.fundTypeWiseCrDrList);
    } else {
      setFilteredTypes([]);
    }
  }, [form.wallet, walletData]);

  useEffect(() => {
    if (!form.loginId) {
      setForm((prev) => ({
        ...prev,
        name: '',
      }));
    }
  }, [form.loginId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'wallet') {
      setForm((prev) => ({ ...prev, type: '' }));
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   let newErrors = {};
  //   if (!form.loginId.trim()) newErrors.loginId = 'UserId is required';
  //   if (!form.wallet) newErrors.wallet = 'Select Wallet is required';
  //   if (!form.type) newErrors.type = 'Select Type is required';
  //   if (!form.amount) newErrors.amount = 'Enter Amount is required';
  //   if (!form.remark) newErrors.remark = 'Description is required';
  //   setErrors(newErrors);
  //   if (Object.keys(newErrors).length > 0) return;
  //   if (!form.wallet || !form.type || !form.amount || !form.remark) return;
  //   const selectedType = filteredTypes.find((t) => String(t.id) === String(form.type));
  //   const crDr = selectedType ? selectedType.crDr : null;

  //   const payload = {
  //     wallettype: form.wallet,
  //     crDr: crDr,
  //     urid: walletData?.walletDetails?.urid,
  //     amt: form.amount,
  //     remark: form.remark,
  //   };

  //   try {
  //     const response = await dispatch(addFund(payload)).unwrap();
  //     if (response.statusCode === 200) {
  //       toast.success(response.message || 'Fund added successfully!');
  //     }
  //     setForm({
  //       loginId: '',
  //       name: '',
  //       wallet: '',
  //       type: '',
  //       amount: '',
  //       remark: '',
  //     });
  //   } catch (err) {
  //     toast.error(err?.message || 'Failed to add fund.');
  //   }
  // };
const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);
  let newErrors = {};
  if (!form.loginId.trim()) newErrors.loginId = 'UserId is required';
  if (!form.wallet) newErrors.wallet = 'Select Wallet is required';
  if (!form.type) newErrors.type = 'Select Type is required';
  if (!form.amount) newErrors.amount = 'Enter Amount is required';
  if (!form.remark) newErrors.remark = 'Description is required';
  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;
  if (!form.wallet || !form.type || !form.amount || !form.remark) return;

  const selectedType = filteredTypes.find((t) => String(t.id) === String(form.type));
  const crDr = selectedType ? selectedType.crDr : null;
  const amount = parseFloat(form.amount);

  // Check if it's a debit operation
  if (crDr === '2' || selectedType.type === 'Debit') { // Changed to check both crDr and type
    let currentBalance = 0;
    switch (form.wallet) {
      case '1': // Income Wallet
        currentBalance = parseFloat(walletData?.walletDetails?.incomeWallet || 0);
        break;
      case '2': // Deposit Wallet
        currentBalance = parseFloat(walletData?.walletDetails?.depositWallet || 0);
        break;
      case '3': // Rent Wallet
        currentBalance = parseFloat(walletData?.walletDetails?.rentWallet || 0);
        break;
      default:
        currentBalance = 0;
    }

    // Check if the debit would make the balance go below 0
    if (currentBalance - amount < 0) {
      toast.error(`Debit would not be less than 0`);
      return;
    }
  }

  const payload = {
    wallettype: form.wallet,
    crDr: crDr,
    urid: walletData?.walletDetails?.urid,
    amt: form.amount,
    remark: form.remark,
  };

  try {
    const response = await dispatch(addFund(payload)).unwrap();
    console.log(response);
    if (response.statusCode === 200) {
      toast.success(response.message || 'Fund added successfully!');
    }
    setForm({
      loginId: '',
      name: '',
      wallet: '',
      type: '',
      amount: '',
      remark: '',
    });
  } catch (err) {
    toast.error(err?.message || 'Failed to add fund.');
  } finally {
    setSubmitting(false);
  }
};
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-xl p-8 bg-white border border-gray-100 shadow-2xl rounded-2xl"
  >
    {/* Icon and Title */}
    <div className="flex flex-col items-center mb-8">
      <div className="flex items-center justify-center w-20 h-20 mb-4 border border-blue-200 rounded-full bg-blue-50">
        <svg
          className="w-10 h-10 text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
            1.79-4 4 1.79 4 4 4zm0 0c-4.418 0-8 2.239-8 
            5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.761-3.582-5-8-5z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Credit / Debit Fund</h2>
      <p className="text-sm text-gray-500">Fill details to credit or debit funds</p>
    </div>

    {/* Form Grid */}
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* User ID */}
      <div>
        <label className="block mb-1 text-sm font-semibold text-gray-700" htmlFor="userId">
          Enter User ID
        </label>
        <input
          type="text"
          id="loginId"
          name="loginId"
          value={form.loginId}
          onChange={handleChange}
          className="w-full px-4 py-3 text-base border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter User Id"
          autoComplete="off"
        />
        {errors.authLogin && <div className="mt-1 text-sm text-red-500">{errors.authLogin}</div>}
        {errors.loginId && <div className="mt-1 text-sm text-red-500">{errors.loginId}</div>}
      </div>

      {/* User Name */}
      <div>
        <label className="block mb-1 text-sm font-semibold text-gray-700" htmlFor="user">
          User Name
        </label>
        <input
          type="text"
          id="user"
          name="name"
          value={form.name}
          onChange={handleChange}
          readOnly
          className="w-full px-4 py-3 text-base bg-gray-100 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="User Name"
        />
      </div>

      {/* Wallet Data (only if user exists) */}
      {form.name && (
        <>
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Wallet Balances
            </label>
            {walletData?.walletDetails && (
              <div className="flex flex-col gap-2 px-4 py-3 text-sm border border-blue-200 shadow-sm rounded-xl bg-blue-50 md:flex-row md:justify-between">
                <span>
                  Income Wallet:{" "}
                  <span className="font-semibold text-blue-800">
                    ${walletData.walletDetails.incomeWallet}
                  </span>
                </span>
                <span>
                  Deposit Wallet:{" "}
                  <span className="font-semibold text-blue-800">
                    ${walletData.walletDetails.depositWallet}
                  </span>
                </span>
                <span>
                  Rent Wallet:{" "}
                  <span className="font-semibold text-blue-800">
                    ${walletData.walletDetails.rentWallet}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Wallet Select */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700" htmlFor="wallet">
              Select Wallet 
            </label>
            <select
              id="wallet"
              name="wallet"
              value={form.wallet}
              onChange={handleChange}
              className="w-full px-4 py-3 text-base border bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={!walletData?.walletDetails?.urid}
            >
              <option value="">-Select Wallet-</option>
              {walletData?.fundTypes?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.type}
                </option>
              ))}
            </select>
            {errors.wallet && <div className="mt-1 text-sm text-red-500">{errors.wallet}</div>}
          </div>

          {/* Type Select */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700" htmlFor="type">
              Select Type
            </label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-4 py-3 text-base border bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={!form.wallet}
            >
              <option value="">-Select Type-</option>
              {filteredTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.type}
                </option>
              ))}
            </select>
            {errors.type && <div className="mt-1 text-sm text-red-500">{errors.type}</div>}
          </div>

          {/* Amount */}
          <div className='md:col-span-2'>
            <label className="block mb-1 text-sm font-semibold text-gray-700 w-100" htmlFor="amount">
              Enter Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-3 text-base border bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Amount"
            />
            {errors.amount && <div className="mt-1 text-sm text-red-500">{errors.amount}</div>}
          </div>

          {/* Remark */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-semibold text-gray-700" htmlFor="remark">
              Enter Description
            </label>
            <textarea
              id="remark"
              name="remark"
              value={form.remark}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 text-base border bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Remark"
            />
            {errors.remark && <div className="mt-1 text-sm text-red-500">{errors.remark}</div>}
          </div>
        </>
      )}
    </div> 

    {/* Status Messages */}
    {loading && <div className="mt-4 text-center text-blue-600 animate-pulse">Loading wallet details...</div>}
    {error && <div className="mt-4 text-center text-red-600">{typeof error === 'string' ? error : 'Failed to fetch wallet details.'}</div>}

    {/* Submit Button */}
    <button
      type="submit"
      disabled={!!errors.authLogin || submitting}
      className="w-full py-3 mt-6 text-lg font-bold text-white shadow rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {submitting ? 'Submitting...' : 'Submit'}
    </button>
  </form>
</div>

  );
};

export default CreditDebitFund;