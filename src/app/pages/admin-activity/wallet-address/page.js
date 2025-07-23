'use client'
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generateWalletAddress, getAllWalletAddress } from '@/app/redux/adminMangeUserSlice';

const WalletAddress = () => {
  const [quantity, setQuantity] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const dispatch = useDispatch();
  const { walletAddressData, allWalletData, loading, error } = useSelector(
    (state) => state.adminManageUser
  );

  useEffect(() => {
    dispatch(getAllWalletAddress());
  }, [dispatch]);

  const handleGenerate = async () => {
  const result = await dispatch(generateWalletAddress({ quantity: Number(quantity) }));
  if (result?.payload?.status === "Succeed") {
    toast.success('Generate Wallet Address Successful');
    setQuantity(0);
    dispatch(getAllWalletAddress());
  } else {
    toast.error(result?.payload?.message || 'Failed to add wallet address');
  }
};

  // Table data
  const tableData = Array.isArray(allWalletData?.data)
    ? allWalletData.data.map((item, idx) => ({
        srNo: idx + 1,
        walletAddress: item.walletAddress,
        status: item.status,
        usedByLoginId: item.authlogin || '',
        usedByName: item.name || '', 
      }))
    : [];
  const paginatedData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  return (
    <div className="min-h-[80vh] ">
      <div className="flex justify-center pt-10">
        <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl">
          <h2 className="mb-6 text-2xl font-bold text-center text-black">Manage User Wallet Address</h2>
          <form
            className="flex flex-col gap-4"
            onSubmit={e => { e.preventDefault(); handleGenerate(); }}
          >
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Quantity</label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || (/^\d+$/.test(val) && Number(val) > 0)) {
                    setQuantity(val);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter Quantity"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white transition-all duration-200 rounded-lg shadow bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Address'}
            </button>
          </form>
          {error && <div className="mt-4 text-center text-red-600">{error.toString()}</div>}
        </div>
      </div>
      <div className="px-4 mt-10 md:px-10">
        <div className="w-full overflow-x-auto border border-blue-100 shadow-lg rounded-xl bg-white/90">
          <table className="min-w-full border border-gray-200 rounded-xl">
            <thead className="sticky top-0 z-10 text-blue-900 bg-gradient-to-r from-blue-200 to-blue-400">
              <tr>
                <th className="px-4 py-3 text-center border">S. No.</th>
                <th className="px-4 py-3 text-center border">Wallet Address</th>
                <th className="px-4 py-3 text-center border">Status</th>
                <th className="px-4 py-3 text-center border">UsedBy(LoginId)</th>
                <th className="px-4 py-3 text-center border">UsedBy(Name)</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-lg text-center text-gray-400">No Data Found</td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr key={row.srNo} className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-50 transition'}>
                    <td className="px-4 py-2 font-medium text-center border">{row.srNo}</td>
                    <td className="px-4 py-2 text-center border">{row.walletAddress}</td>
                    <td className="px-4 py-2 text-center border">{row.status}</td>
                    <td className="px-4 py-2 text-center border">{row.usedByLoginId}</td>
                    <td className="px-4 py-2 text-center border">{row.usedByName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {tableData.length > rowsPerPage && (
            <div className="flex items-center justify-center gap-2 py-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-700 text-white' : 'bg-blue-200 text-blue-800 hover:bg-blue-400'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default WalletAddress;
