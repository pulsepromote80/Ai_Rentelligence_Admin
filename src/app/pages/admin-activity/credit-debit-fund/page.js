"use client";
import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getUserWalletDetails, addFund } from '@/app/redux/adminManageFundSlice';

const CreditDebitFund = () => {
  const [form, setForm] = useState({
    loginId: '',
    user: '',
    wallet: '',
    type: '',
    amount: '',
    remark: '',
  });
  const [filteredTypes, setFilteredTypes] = useState([]);
  const dispatch = useDispatch();
  const { data: walletData, loading, error} = useSelector((state) => state.adminManageFund);
 
  useEffect(() => {
    if (!form.loginId) return;
    const handler = setTimeout(() => {
      dispatch(getUserWalletDetails(form.loginId));
    }, 200); 
    return () => clearTimeout(handler);
  }, [form.loginId, dispatch]);

  useEffect(() => {
    if (walletData?.walletDetails) {
      setForm((prev) => ({
        ...prev,
        user: walletData.walletDetails.fullName || '',
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
        user: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.wallet || !form.type || !form.amount || !form.remark) return;
    const selectedType = filteredTypes.find((t) => String(t.id) === String(form.type));
    const crDr = selectedType ? selectedType.crDr : null;

    const payload = {
      wallettype: form.wallet,
      crDr: crDr,
      urid: walletData?.walletDetails?.urid,
      amt: form.amount,
      remark: form.remark,
    };

    try {
      const response = await dispatch(addFund(payload)).unwrap();
      if (response.statusCode === 200) {
        toast.success(response.message || 'Fund added successfully!');
      }
      setForm({
        loginId: '',
        user: '',
        wallet: '',
        type: '',
        amount: '',
        remark: '',
      });
    } catch (err) {
      toast.error(err?.message || 'Failed to add fund.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] ">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl p-8 bg-white border border-gray-100 shadow-2xl rounded-2xl"
      >
        <h2 className="mb-8 text-xl font-bold tracking-tight text-center text-black-600 drop-shadow-sm">Credit/Debit Fund</h2>
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 font-semibold text-gray-700" htmlFor="userId">Enter User ID :</label>
            <input
              type="text"
              id="loginId"
              name="loginId"
              value={form.loginId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
              placeholder="Enter User Id"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700" htmlFor="user">User Name :</label>
            <input
              type="text"
              id="user"
              name="user"
              value={form.user}
              onChange={handleChange}
              required
              readOnly
              className="w-full px-4 py-3 text-lg bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="User Name"
            />
          </div>
          {form.user && (
            <>
              <div>
                <label className="block mb-2 font-semibold text-gray-700" htmlFor="wallet">Wallet Balances:</label>
                {walletData?.walletDetails && (
                  <div className="flex flex-col w-full gap-1 px-4 py-2 mb-2 text-sm text-blue-800 border border-blue-200 rounded-lg shadow-sm bg-blue-50 md:flex-row md:items-center md:gap-8">
                    <span>Income Wallet: <span className="font-semibold">₹{walletData.walletDetails.incomeWallet}</span></span>
                    <span>Deposit Wallet: <span className="font-semibold">₹{walletData.walletDetails.depositWallet}</span></span>
                  </div>
                )}
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700" htmlFor="wallet">Select Wallet:</label>
                <select
                  id="wallet"
                  name="wallet"
                  value={form.wallet}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  disabled={!walletData?.walletDetails?.urid}
                >
                  <option value="">-Select Wallet-</option>
                  {walletData?.fundTypes?.map((w) => (
                    <option key={w.id} value={w.id}>{w.type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700" htmlFor="type">Select Type :</label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  disabled={!form.wallet}
                >
                  <option value="">-Select Type-</option>
                  {filteredTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block mb-2 font-semibold text-gray-700" htmlFor="amount">Enter Amount :</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  placeholder="Enter Amount"
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block mb-2 font-semibold text-gray-700" htmlFor="remark">Enter Description</label>
                <textarea
                  id="remark"
                  name="remark"
                  value={form.remark}
                  onChange={handleChange}
                  rows={3}
                  className="w-full h-24 px-4 py-5 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  placeholder="Enter Remark"
                />
              </div>
            </>
          )}
        </div>
        {loading && <div className="mb-4 text-center text-blue-600 animate-pulse">Loading wallet details...</div>}
        {error && <div className="mb-4 text-center text-red-600">{typeof error === 'string' ? error : 'Failed to fetch wallet details.'}</div>}
        <button
          type="submit"
          className="w-full py-3 text-lg font-bold text-white transition rounded-lg shadow bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreditDebitFund;