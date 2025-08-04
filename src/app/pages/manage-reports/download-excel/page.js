"use client"
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { downloadExcel } from '@/app/redux/adminMasterSlice';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const DownloadExcel = () => {
  const dispatch = useDispatch();
  const [selectedReport, setSelectedReport] = useState('');
  const { loading, error, excelData } = useSelector((state) => state.adminMaster);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showTable, setShowTable] = useState(false);

  const reportTypes = [
    { value: 'AllMember', label: 'All Member' },
    { value: 'ActiveIds', label: 'Active IDs' },
    { value: 'WalletReport', label: 'Wallet Report' },
    { value: 'IncomeWallet', label: 'Income Wallet' },
    { value: 'DepositWallet', label: 'Deposit Wallet' },
    { value: 'Withdrawal', label: 'Withdrawal' },
    { value: 'Deposit', label: 'Deposit' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedReport) {
      const action = await dispatch(downloadExcel({ transType: selectedReport }));
      if (action.payload && Array.isArray(action.payload.data) && action.payload.data.length > 0) {
        setShowTable(true);
        const ws = XLSX.utils.json_to_sheet(action.payload.data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const fileName = `${selectedReport}_Report.xlsx`;
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), fileName);
      } else {
        setShowTable(false);
      }
      if (action.payload && action.payload.statusCode === 200) {
        toast.success(action.payload.message || 'Report downloaded successfully!');
      }
    }
  };
  
  const handleReportChange = (e) => {
    setSelectedReport(e.target.value);
    setShowTable(false);
    setCurrentPage(1);
  };

  const tableData = excelData && Array.isArray(excelData.data)
    ? excelData.data.map((item, idx) => ({ srNo: idx + 1, ...item }))
    : [];
  
  const paginatedData = tableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(tableData.length / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, tableData.length);

  return (
    <div className="flex items-center justify-center mt-5">
      <div className="w-full max-w-6xl p-8 bg-white border border-gray-100 shadow-2xl rounded-2xl item-center">
        <h1 className="mb-8 text-2xl font-bold tracking-tight text-center text-black-600 drop-shadow-sm">Download Excel Reports</h1>
        
        <div className='flex items-center justify-center'>
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
            <div className="flex flex-col space-y-2">
              <label htmlFor="reportType" className="text-xl font-medium text-center text-gray-700">
                Select Report Type
              </label>
              <select
                id="reportType"
                value={selectedReport}
                onChange={handleReportChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a Report Type</option>
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={!selectedReport || loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                !selectedReport || loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Downloading...' : 'Download Report'}
            </button>

            {error && (
              <p className="mt-2 text-sm text-red-500">{error}</p>
            )}
          </form>
        </div>
     
        {showTable && excelData && Array.isArray(excelData.data) && (
          <div className="w-full max-w-6xl mt-8 border border-blue-100 shadow-lg rounded-xl bg-white/90">
            <div className="overflow-x-auto">
              <table className="w-full mr-20 border border-gray-200 table-fixed min-w-max rounded-xl">
                <thead className="sticky top-0 z-10 text-blue-900 bg-gradient-to-r from-blue-200 to-blue-400">
                  <tr>
                    <th className="px-4 py-3 text-center break-words whitespace-normal border">Sr.No.</th>
                    {tableData[0] && Object.keys(tableData[0]).filter(key => key !== 'srNo' && key !== 'WalletAddress').map((key) => (
                      <th key={key} className="px-4 py-3 text-center break-words whitespace-normal border">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length === 0 ? (
                    <tr>
                      <td colSpan={tableData[0] ? Object.keys(tableData[0]).length : 1} className="py-10 text-lg text-center text-gray-400 break-words whitespace-normal">No Data Found</td>
                    </tr>
                  ) : (
                    paginatedData.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-blue-50 hover:bg-blue-100 transition' : 'bg-white hover:bg-blue-50 transition'}>
                        <td className="px-4 py-2 font-medium text-center break-words whitespace-normal border">{startItem + idx}</td>
                        {Object.keys(row).filter(key => key !== 'srNo' && key !== 'WalletAddress').map((key, i) => (
                          <td key={i} className="px-4 py-2 text-center break-words whitespace-normal border">{row[key]}</td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {tableData.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="p-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>
                <div className="text-sm text-gray-600">
                  {startItem}-{endItem} of {tableData.length}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-1 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-1 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadExcel;